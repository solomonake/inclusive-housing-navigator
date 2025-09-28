# Local D&I Scoring Pipeline

This directory contains a local implementation of the Databricks notebook pipeline that calculates Diversity & Inclusion scores for housing listings.

## Problem Solved

The original Databricks notebook was trying to access files from `/FileStore/shared_uploads/` (DBFS root), which is now disabled in modern Databricks workspaces. This local version replaces the Spark operations with pandas and uses local file paths instead.

## Files

- `local_pipeline.py` - Main pipeline script
- `requirements.txt` - Python dependencies
- `data/sample_listings.csv` - Input data
- `output/` - Generated output files
  - `gold_housing_data.json` - JSON format for the Next.js app
  - `gold_housing_data.csv` - CSV format for easy viewing
  - `housing_di_scores.parquet` - Parquet format for performance

## Usage

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the pipeline:
   ```bash
   python3 local_pipeline.py
   ```

## Pipeline Stages

1. **Bronze Layer**: Loads raw CSV data from `data/sample_listings.csv`
2. **Silver Layer**: Cleans and transforms data (type conversion, validation)
3. **Gold Layer**: Calculates D&I scores using weighted formula:
   - Affordability: 35%
   - Accessibility: 20%
   - Safety: 20%
   - Commute: 15%
   - Inclusivity: 10%

## Score Tiers

- **Gold**: 90+ points
- **Silver**: 80-89 points
- **Bronze**: 70-79 points
- **Needs Improvement**: <70 points

## Output

The pipeline generates scored housing data that can be used by the Next.js application. The JSON output is compatible with the existing API routes.
