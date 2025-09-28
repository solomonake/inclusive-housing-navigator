#!/usr/bin/env python3
"""
Inclusive Housing Navigator - Local D&I Scoring Pipeline

This script implements the bronze → silver → gold data pipeline for computing 
Diversity & Inclusion scores for housing listings, replacing the Databricks 
notebook functionality for local execution.
"""

import pandas as pd
import numpy as np
import json
from datetime import datetime
import os
from pathlib import Path

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
    elif "8-22" in str(management_hours) or "9-19" in str(management_hours):
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

def main():
    print("=== Inclusive Housing Navigator - Local D&I Scoring Pipeline ===\n")
    
    # Set up paths
    script_dir = Path(__file__).parent
    data_dir = script_dir / "data"
    output_dir = script_dir / "output"
    
    # Create output directory if it doesn't exist
    output_dir.mkdir(exist_ok=True)
    
    # Bronze Layer: Raw Data Ingestion
    print("Bronze Layer: Loading raw data...")
    csv_path = data_dir / "sample_listings.csv"
    
    if not csv_path.exists():
        print(f"Error: Data file not found at {csv_path}")
        return
    
    # Read CSV with proper handling of quoted fields containing commas
    try:
        bronze_df = pd.read_csv(csv_path, quotechar='"', escapechar='\\')
    except pd.errors.ParserError:
        # If that fails, try with different parameters
        bronze_df = pd.read_csv(csv_path, quoting=1, escapechar='\\', on_bad_lines='skip')
    print(f"Loaded {len(bronze_df)} listings")
    print(f"Schema: {list(bronze_df.columns)}")
    print(f"Sample data:\n{bronze_df.head()}\n")
    
    # Silver Layer: Data Cleaning and Transformation
    print("Silver Layer: Cleaning and transforming data...")
    
    # Clean and transform the data
    silver_df = bronze_df.copy()
    
    # Convert data types
    numeric_columns = ['id', 'rent', 'utilities', 'deposits', 'bedrooms', 'bathrooms', 'sqft', 
                      'lat', 'lng', 'doorway_width', 'distance_to_campus', 'walk_time', 
                      'bus_frequency', 'neighborhood_safety_score', 'transit_score', 'walkability_score']
    
    boolean_columns = ['step_free_entry', 'elevator', 'accessible_bathroom', 'accessible_parking',
                      'lit_streets', 'accepts_international', 'no_ssn_required', 'allows_cosigner',
                      'anti_discrimination_policy', 'responsive_comms']
    
    for col in numeric_columns:
        if col in silver_df.columns:
            silver_df[col] = pd.to_numeric(silver_df[col], errors='coerce')
    
    for col in boolean_columns:
        if col in silver_df.columns:
            silver_df[col] = silver_df[col].astype(bool)
    
    # Add processing timestamp
    silver_df['processed_at'] = datetime.now()
    
    print(f"Cleaned data shape: {silver_df.shape}")
    print(f"Sample cleaned data:\n{silver_df[['id', 'name', 'rent', 'bedrooms', 'bathrooms']].head()}\n")
    
    # Gold Layer: D&I Score Calculation
    print("Gold Layer: Calculating D&I scores...")
    
    # Calculate scores
    gold_df = silver_df.copy()
    
    # Apply scoring functions
    gold_df['affordability_score'] = gold_df.apply(
        lambda row: calculate_affordability_score(row['rent'], row['utilities'], row['deposits']), 
        axis=1
    )
    
    gold_df['accessibility_score'] = gold_df.apply(
        lambda row: calculate_accessibility_score(
            row['step_free_entry'], row['elevator'], row['doorway_width'], 
            row['accessible_bathroom'], row['accessible_parking']
        ), axis=1
    )
    
    gold_df['safety_score'] = gold_df.apply(
        lambda row: calculate_safety_score(
            row['distance_to_campus'], row['lit_streets'], 
            row['management_hours'], row['neighborhood_safety_score']
        ), axis=1
    )
    
    gold_df['commute_score'] = gold_df.apply(
        lambda row: calculate_commute_score(
            row['walk_time'], row['bus_frequency'], row['distance_to_campus']
        ), axis=1
    )
    
    gold_df['inclusivity_score'] = gold_df.apply(
        lambda row: calculate_inclusivity_score(
            row['accepts_international'], row['no_ssn_required'], 
            row['allows_cosigner'], row['anti_discrimination_policy'], 
            row['responsive_comms']
        ), axis=1
    )
    
    # Calculate overall D&I score with weighted formula
    gold_df['overall_di_score'] = (
        gold_df['affordability_score'] * 0.35 + 
        gold_df['accessibility_score'] * 0.20 + 
        gold_df['safety_score'] * 0.20 + 
        gold_df['commute_score'] * 0.15 + 
        gold_df['inclusivity_score'] * 0.10
    )
    
    # Create score breakdown string
    gold_df['score_breakdown'] = (
        "Affordability: " + gold_df['affordability_score'].round(1).astype(str) + " (35%) | " +
        "Accessibility: " + gold_df['accessibility_score'].round(1).astype(str) + " (20%) | " +
        "Safety: " + gold_df['safety_score'].round(1).astype(str) + " (20%) | " +
        "Commute: " + gold_df['commute_score'].round(1).astype(str) + " (15%) | " +
        "Inclusivity: " + gold_df['inclusivity_score'].round(1).astype(str) + " (10%)"
    )
    
    # Create score tier
    gold_df['score_tier'] = gold_df['overall_di_score'].apply(
        lambda x: "Gold" if x >= 90 else "Silver" if x >= 80 else "Bronze" if x >= 70 else "Needs Improvement"
    )
    
    # Add final processing timestamp
    gold_df['processed_at'] = datetime.now()
    
    print("D&I scores calculated successfully!")
    print(f"Sample scored data:\n{gold_df[['id', 'name', 'overall_di_score', 'score_tier']].head()}\n")
    
    # Display results
    print("=== Gold Layer - D&I Scored Data ===")
    display_cols = ['id', 'name', 'overall_di_score', 'score_tier', 
                   'affordability_score', 'accessibility_score', 'safety_score', 
                   'commute_score', 'inclusivity_score', 'score_breakdown']
    
    print(gold_df[display_cols].head(10).to_string(index=False))
    print()
    
    # Export Gold Data
    print("Exporting gold data...")
    
    # Save to JSON for the app
    app_data = gold_df[[
        'id', 'name', 'address', 'rent', 'utilities', 'deposits', 'bedrooms', 'bathrooms', 'sqft',
        'lat', 'lng', 'overall_di_score', 'score_tier', 'affordability_score', 'accessibility_score',
        'safety_score', 'commute_score', 'inclusivity_score', 'score_breakdown', 'description',
        'amenities', 'step_free_entry', 'elevator', 'accessible_bathroom', 'accessible_parking',
        'accepts_international', 'no_ssn_required', 'allows_cosigner', 'anti_discrimination_policy',
        'responsive_comms', 'neighborhood_safety_score', 'transit_score', 'walkability_score'
    ]].copy()
    
    # Save as JSON
    json_path = output_dir / "gold_housing_data.json"
    app_data.to_json(json_path, orient='records', indent=2)
    print(f"JSON data saved to: {json_path}")
    
    # Save as CSV for easy viewing
    csv_path = output_dir / "gold_housing_data.csv"
    app_data.to_csv(csv_path, index=False)
    print(f"CSV data saved to: {csv_path}")
    
    # Save as Parquet for better performance
    parquet_path = output_dir / "housing_di_scores.parquet"
    gold_df.to_parquet(parquet_path, index=False)
    print(f"Parquet data saved to: {parquet_path}")
    
    # Summary Statistics
    print("\n=== D&I Scoring Summary ===")
    total_listings = len(gold_df)
    avg_di_score = gold_df['overall_di_score'].mean()
    min_di_score = gold_df['overall_di_score'].min()
    max_di_score = gold_df['overall_di_score'].max()
    
    print(f"Total Listings: {total_listings}")
    print(f"Average D&I Score: {avg_di_score:.2f}")
    print(f"Score Range: {min_di_score:.2f} - {max_di_score:.2f}")
    print(f"\nAverage Sub-scores:")
    print(f"  Affordability: {gold_df['affordability_score'].mean():.2f}")
    print(f"  Accessibility: {gold_df['accessibility_score'].mean():.2f}")
    print(f"  Safety: {gold_df['safety_score'].mean():.2f}")
    print(f"  Commute: {gold_df['commute_score'].mean():.2f}")
    print(f"  Inclusivity: {gold_df['inclusivity_score'].mean():.2f}")
    
    # Score Distribution Analysis
    print("\n=== Score Tier Distribution ===")
    score_distribution = gold_df['score_tier'].value_counts()
    print(score_distribution)
    
    # Top 10 listings by D&I score
    print("\n=== Top 10 Listings by D&I Score ===")
    top_listings = gold_df.nlargest(10, 'overall_di_score')[['id', 'name', 'overall_di_score', 'score_tier', 'rent', 'address']]
    print(top_listings.to_string(index=False))
    
    print("\n=== Pipeline Complete! ===")
    print("The bronze → silver → gold pipeline has been successfully implemented locally:")
    print("1. Bronze Layer: Raw CSV data ingestion")
    print("2. Silver Layer: Data cleaning and type conversion")
    print("3. Gold Layer: D&I score calculation with weighted formula")
    print(f"\nOutput files saved to: {output_dir}")
    print("The gold dataset is now available for the Next.js application!")

if __name__ == "__main__":
    main()
