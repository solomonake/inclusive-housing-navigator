# Databricks notebook source
# MAGIC %md
# MAGIC # Inclusive Housing Navigator - D&I Scoring Pipeline
# MAGIC 
# MAGIC This notebook implements the bronze → silver → gold data pipeline for computing Diversity & Inclusion scores for housing listings.

# COMMAND ----------

# MAGIC %md
# MAGIC ## Import Libraries and Setup

# COMMAND ----------

import pandas as pd
import numpy as np
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
import json
from datetime import datetime

# COMMAND ----------

# MAGIC %md
# MAGIC ## Bronze Layer: Raw Data Ingestion

# COMMAND ----------

# Read the sample listings CSV
bronze_df = spark.read.option("header", "true").option("inferSchema", "true").csv("/FileStore/shared_uploads/sample_listings.csv")

# Display schema and sample data
print("Bronze Layer Schema:")
bronze_df.printSchema()
print("\nSample Data:")
bronze_df.show(5)

# COMMAND ----------

# MAGIC %md
# MAGIC ## Silver Layer: Data Cleaning and Transformation

# COMMAND ----------

# Clean and transform the data
silver_df = bronze_df.select(
    col("id").cast("int"),
    col("name"),
    col("address"),
    col("rent").cast("double"),
    col("utilities").cast("double"),
    col("deposits").cast("double"),
    col("bedrooms").cast("int"),
    col("bathrooms").cast("int"),
    col("sqft").cast("int"),
    col("lat").cast("double"),
    col("lng").cast("double"),
    # Accessibility features
    col("step_free_entry").cast("boolean"),
    col("elevator").cast("boolean"),
    col("doorway_width").cast("int"),
    col("accessible_bathroom").cast("boolean"),
    col("accessible_parking").cast("boolean"),
    # Safety features
    col("management_hours"),
    col("lit_streets").cast("boolean"),
    col("distance_to_campus").cast("double"),
    # Commute features
    col("walk_time").cast("int"),
    col("bus_frequency").cast("int"),
    # Inclusivity features
    col("accepts_international").cast("boolean"),
    col("no_ssn_required").cast("boolean"),
    col("allows_cosigner").cast("boolean"),
    col("anti_discrimination_policy").cast("boolean"),
    col("responsive_comms").cast("boolean"),
    col("description"),
    col("amenities"),
    col("neighborhood_safety_score").cast("int"),
    col("transit_score").cast("int"),
    col("walkability_score").cast("int")
).withColumn("processed_at", current_timestamp())

# Display cleaned data
print("Silver Layer Sample:")
silver_df.show(5)

# COMMAND ----------

# MAGIC %md
# MAGIC ## Gold Layer: D&I Score Calculation

# COMMAND ----------

def calculate_affordability_score(rent, utilities, deposits, user_budget=2000):
    """
    Calculate affordability score (0-100)
    Higher score = more affordable
    """
    total_cost = rent + utilities + (deposits / 12)  # Monthly cost including prorated deposits
    if total_cost <= user_budget * 0.3:  # 30% of budget rule
        return 100
    elif total_cost <= user_budget * 0.5:  # 50% of budget rule
        return 80
    elif total_cost <= user_budget * 0.7:  # 70% of budget rule
        return 60
    else:
        return max(0, 100 - ((total_cost - user_budget * 0.7) / user_budget * 0.3) * 100)

def calculate_accessibility_score(step_free_entry, elevator, doorway_width, accessible_bathroom, accessible_parking):
    """
    Calculate accessibility score (0-100)
    """
    score = 0
    if step_free_entry:
        score += 25
    if elevator:
        score += 20
    if doorway_width >= 36:  # ADA compliant
        score += 20
    elif doorway_width >= 32:
        score += 15
    if accessible_bathroom:
        score += 20
    if accessible_parking:
        score += 15
    return score

def calculate_safety_score(distance_to_campus, lit_streets, management_hours, neighborhood_safety_score):
    """
    Calculate safety score (0-100)
    """
    score = 0
    # Distance to campus (closer is safer)
    if distance_to_campus <= 0.5:
        score += 30
    elif distance_to_campus <= 1.0:
        score += 25
    elif distance_to_campus <= 1.5:
        score += 20
    else:
        score += 10
    
    # Well-lit streets
    if lit_streets:
        score += 20
    
    # Management hours (24/7 is best)
    if management_hours == "24/7":
        score += 25
    elif "8-22" in management_hours or "9-19" in management_hours:
        score += 20
    else:
        score += 15
    
    # Neighborhood safety score
    score += neighborhood_safety_score * 0.25
    
    return min(100, score)

def calculate_commute_score(walk_time, bus_frequency, distance_to_campus, winter_penalty=False):
    """
    Calculate commute score (0-100)
    """
    score = 0
    
    # Walk time (shorter is better)
    if walk_time <= 5:
        score += 40
    elif walk_time <= 10:
        score += 35
    elif walk_time <= 15:
        score += 30
    elif walk_time <= 20:
        score += 20
    else:
        score += 10
    
    # Bus frequency (more frequent is better)
    if bus_frequency <= 5:
        score += 30
    elif bus_frequency <= 10:
        score += 25
    elif bus_frequency <= 15:
        score += 20
    elif bus_frequency <= 20:
        score += 15
    else:
        score += 10
    
    # Distance penalty
    if distance_to_campus > 1.0:
        score *= 0.8
    
    # Winter penalty
    if winter_penalty:
        score *= 0.9
    
    return min(100, score)

def calculate_inclusivity_score(accepts_international, no_ssn_required, allows_cosigner, anti_discrimination_policy, responsive_comms):
    """
    Calculate inclusivity score (0-100)
    """
    score = 0
    if accepts_international:
        score += 25
    if no_ssn_required:
        score += 20
    if allows_cosigner:
        score += 20
    if anti_discrimination_policy:
        score += 20
    if responsive_comms:
        score += 15
    return score

# COMMAND ----------

# Register UDFs for score calculations
from pyspark.sql.functions import udf
from pyspark.sql.types import DoubleType

affordability_udf = udf(calculate_affordability_score, DoubleType())
accessibility_udf = udf(calculate_accessibility_score, DoubleType())
safety_udf = udf(calculate_safety_score, DoubleType())
commute_udf = udf(calculate_commute_score, DoubleType())
inclusivity_udf = udf(calculate_inclusivity_score, DoubleType())

# COMMAND ----------

# Calculate D&I scores
gold_df = silver_df.withColumn(
    "affordability_score", affordability_udf(col("rent"), col("utilities"), col("deposits"))
).withColumn(
    "accessibility_score", accessibility_udf(col("step_free_entry"), col("elevator"), col("doorway_width"), col("accessible_bathroom"), col("accessible_parking"))
).withColumn(
    "safety_score", safety_udf(col("distance_to_campus"), col("lit_streets"), col("management_hours"), col("neighborhood_safety_score"))
).withColumn(
    "commute_score", commute_udf(col("walk_time"), col("bus_frequency"), col("distance_to_campus"))
).withColumn(
    "inclusivity_score", inclusivity_udf(col("accepts_international"), col("no_ssn_required"), col("allows_cosigner"), col("anti_discrimination_policy"), col("responsive_comms"))
).withColumn(
    "overall_di_score", 
    col("affordability_score") * 0.35 + 
    col("accessibility_score") * 0.20 + 
    col("safety_score") * 0.20 + 
    col("commute_score") * 0.15 + 
    col("inclusivity_score") * 0.10
).withColumn(
    "score_breakdown",
    concat(
        lit("Affordability: "), col("affordability_score"), lit(" (35%) | "),
        lit("Accessibility: "), col("accessibility_score"), lit(" (20%) | "),
        lit("Safety: "), col("safety_score"), lit(" (20%) | "),
        lit("Commute: "), col("commute_score"), lit(" (15%) | "),
        lit("Inclusivity: "), col("inclusivity_score"), lit(" (10%)")
    )
).withColumn(
    "score_tier",
    when(col("overall_di_score") >= 90, "Gold")
    .when(col("overall_di_score") >= 80, "Silver")
    .when(col("overall_di_score") >= 70, "Bronze")
    .otherwise("Needs Improvement")
).withColumn(
    "processed_at", current_timestamp()
)

# COMMAND ----------

# Display results
print("Gold Layer - D&I Scored Data:")
gold_df.select(
    "id", "name", "overall_di_score", "score_tier", 
    "affordability_score", "accessibility_score", "safety_score", 
    "commute_score", "inclusivity_score", "score_breakdown"
).show(10)

# COMMAND ----------

# MAGIC %md
# MAGIC ## Export Gold Data

# COMMAND ----------

# Save to Delta table
gold_df.write.mode("overwrite").option("overwriteSchema", "true").saveAsTable("housing_di_scores")

# Export to JSON for the app
gold_df.select(
    "id", "name", "address", "rent", "utilities", "deposits", "bedrooms", "bathrooms", "sqft",
    "lat", "lng", "overall_di_score", "score_tier", "affordability_score", "accessibility_score",
    "safety_score", "commute_score", "inclusivity_score", "score_breakdown", "description",
    "amenities", "step_free_entry", "elevator", "accessible_bathroom", "accessible_parking",
    "accepts_international", "no_ssn_required", "allows_cosigner", "anti_discrimination_policy",
    "responsive_comms", "neighborhood_safety_score", "transit_score", "walkability_score"
).coalesce(1).write.mode("overwrite").json("/FileStore/shared_uploads/gold_housing_data.json")

# Also save as Parquet for better performance
gold_df.coalesce(1).write.mode("overwrite").parquet("/FileStore/shared_uploads/housing_di_scores.parquet")

print("Gold data exported successfully!")

# COMMAND ----------

# MAGIC %md
# MAGIC ## Summary Statistics

# COMMAND ----------

# Calculate summary statistics
summary_stats = gold_df.agg(
    count("*").alias("total_listings"),
    avg("overall_di_score").alias("avg_di_score"),
    min("overall_di_score").alias("min_di_score"),
    max("overall_di_score").alias("max_di_score"),
    avg("affordability_score").alias("avg_affordability"),
    avg("accessibility_score").alias("avg_accessibility"),
    avg("safety_score").alias("avg_safety"),
    avg("commute_score").alias("avg_commute"),
    avg("inclusivity_score").alias("avg_inclusivity")
).collect()[0]

print("=== D&I Scoring Summary ===")
print(f"Total Listings: {summary_stats['total_listings']}")
print(f"Average D&I Score: {summary_stats['avg_di_score']:.2f}")
print(f"Score Range: {summary_stats['min_di_score']:.2f} - {summary_stats['max_di_score']:.2f}")
print(f"\nAverage Sub-scores:")
print(f"  Affordability: {summary_stats['avg_affordability']:.2f}")
print(f"  Accessibility: {summary_stats['avg_accessibility']:.2f}")
print(f"  Safety: {summary_stats['avg_safety']:.2f}")
print(f"  Commute: {summary_stats['avg_commute']:.2f}")
print(f"  Inclusivity: {summary_stats['avg_inclusivity']:.2f}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## Score Distribution Analysis

# COMMAND ----------

# Analyze score distribution
score_distribution = gold_df.groupBy("score_tier").count().orderBy("count", ascending=False)
print("Score Tier Distribution:")
score_distribution.show()

# Top 10 listings by D&I score
top_listings = gold_df.orderBy(col("overall_di_score").desc()).limit(10)
print("\nTop 10 Listings by D&I Score:")
top_listings.select("id", "name", "overall_di_score", "score_tier", "rent", "address").show()

# COMMAND ----------

# MAGIC %md
# MAGIC ## Pipeline Complete!
# MAGIC 
# MAGIC The bronze → silver → gold pipeline has been successfully implemented:
# MAGIC 
# MAGIC 1. **Bronze Layer**: Raw CSV data ingestion
# MAGIC 2. **Silver Layer**: Data cleaning and type conversion
# MAGIC 3. **Gold Layer**: D&I score calculation with weighted formula
# MAGIC 
# MAGIC The gold dataset is now available for the Next.js application via the API routes.
