#!/usr/bin/env python3
"""
Inclusive Housing Navigator - Databricks-Style D&I Scoring Pipeline
Bronze → Silver → Gold data processing with comprehensive D&I scoring
"""

import pandas as pd
import numpy as np
import json
import os
from pathlib import Path
from typing import Dict, List, Tuple
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DIPipeline:
    def __init__(self, data_path: str = "data/sample_listings.csv"):
        self.data_path = data_path
        self.bronze_df = None
        self.silver_df = None
        self.gold_df = None
        
    def bronze_layer(self) -> pd.DataFrame:
        """Bronze Layer: Raw data ingestion"""
        logger.info("🟤 Bronze Layer: Ingesting raw data...")
        
        if not os.path.exists(self.data_path):
            logger.error(f"Data file not found: {self.data_path}")
            return self._create_sample_data()
        
        try:
            # Try different CSV parsing strategies
            try:
                self.bronze_df = pd.read_csv(self.data_path, quotechar='"', escapechar='\\')
            except pd.errors.ParserError:
                try:
                    self.bronze_df = pd.read_csv(self.data_path, quoting=1, escapechar='\\', on_bad_lines='skip')
                except:
                    self.bronze_df = pd.read_csv(self.data_path, sep=',', on_bad_lines='skip')
        except Exception as e:
            logger.error(f"Failed to read CSV: {e}")
            return self._create_sample_data()
        
        logger.info(f"✅ Bronze: Loaded {len(self.bronze_df)} raw listings")
        return self.bronze_df
    
    def silver_layer(self) -> pd.DataFrame:
        """Silver Layer: Data cleaning and transformation"""
        logger.info("🟡 Silver Layer: Cleaning and transforming data...")
        
        if self.bronze_df is None:
            self.bronze_layer()
        
        self.silver_df = self.bronze_df.copy()
        
        # Standardize column names
        column_mapping = {
            'id': 'id',
            'name': 'title',
            'address': 'addr',
            'rent': 'rent',
            'utilities': 'avg_utils',
            'deposits': 'deposit',
            'bedrooms': 'bedrooms',
            'bathrooms': 'bathrooms',
            'sqft': 'sqft',
            'lat': 'lat',
            'lng': 'lng',
            'step_free_entry': 'step_free',
            'elevator': 'elevator',
            'doorway_width': 'doorway_width_cm',
            'accessible_bathroom': 'acc_bath',
            'accessible_parking': 'acc_parking',
            'lit_streets': 'well_lit',
            'distance_to_campus': 'dist_to_campus_km',
            'walk_time': 'walk_min',
            'bus_frequency': 'bus_headway_min',
            'accepts_international': 'accepts_international',
            'no_ssn_required': 'no_ssn_ok',
            'allows_cosigner': 'cosigner_ok',
            'anti_discrimination_policy': 'anti_disc_policy',
            'management_hours': 'mgmt_hours_late'
        }
        
        # Rename columns
        for old_name, new_name in column_mapping.items():
            if old_name in self.silver_df.columns:
                self.silver_df[new_name] = self.silver_df[old_name]
        
        # Convert data types
        numeric_columns = ['rent', 'avg_utils', 'deposit', 'bedrooms', 'bathrooms', 'sqft', 'lat', 'lng', 'doorway_width_cm', 'dist_to_campus_km', 'walk_min', 'bus_headway_min']
        for col in numeric_columns:
            if col in self.silver_df.columns:
                self.silver_df[col] = pd.to_numeric(self.silver_df[col], errors='coerce')
        
        # Handle boolean columns
        boolean_columns = ['step_free', 'elevator', 'acc_bath', 'acc_parking', 'well_lit', 'accepts_international', 'no_ssn_ok', 'cosigner_ok', 'anti_disc_policy']
        for col in boolean_columns:
            if col in self.silver_df.columns:
                self.silver_df[col] = self.silver_df[col].astype(str).str.lower().isin(['true', '1', 'yes'])
        
        # Fill missing values
        self.silver_df['bedrooms'] = self.silver_df['bedrooms'].fillna(1)
        self.silver_df['bathrooms'] = self.silver_df['bathrooms'].fillna(1)
        self.silver_df['avg_utils'] = self.silver_df['avg_utils'].fillna(0)
        self.silver_df['deposit'] = self.silver_df['deposit'].fillna(0)
        self.silver_df['dist_to_campus_km'] = self.silver_df['dist_to_campus_km'].fillna(2.0)
        self.silver_df['walk_min'] = self.silver_df['walk_min'].fillna(20)
        self.silver_df['bus_headway_min'] = self.silver_df['bus_headway_min'].fillna(20)
        
        logger.info(f"✅ Silver: Cleaned {len(self.silver_df)} listings")
        return self.silver_df
    
    def gold_layer(self) -> pd.DataFrame:
        """Gold Layer: D&I scoring and insights"""
        logger.info("🟢 Gold Layer: Calculating D&I scores...")
        
        if self.silver_df is None:
            self.silver_layer()
        
        self.gold_df = self.silver_df.copy()
        
        # Calculate D&I scores for each listing
        scores = self.gold_df.apply(self._calculate_di_score, axis=1)
        score_df = pd.DataFrame(scores.tolist())
        
        # Combine with original data
        self.gold_df = pd.concat([self.gold_df, score_df], axis=1)
        
        # Add additional insights
        self.gold_df['total_monthly_cost'] = self.gold_df['rent'] + self.gold_df['avg_utils']
        self.gold_df['affordability_ratio'] = self.gold_df['total_monthly_cost'] / 2000  # Normalize to $2000 budget
        
        logger.info(f"✅ Gold: Calculated D&I scores for {len(self.gold_df)} listings")
        return self.gold_df
    
    def _calculate_di_score(self, row: pd.Series) -> Dict:
        """Calculate comprehensive D&I score with breakdown"""
        
        # Affordability Score (0-100, higher is better)
        total_cost = row['rent'] + (row.get('avg_utils', 0) or 0) + (row.get('deposit', 0) or 0)
        affordability = max(0, 100 - (total_cost / 2000) * 100)
        
        # Accessibility Score (0-100)
        accessibility = 0
        features = []
        
        if row.get('step_free', False):
            accessibility += 25
            features.append('step-free entry')
        if row.get('elevator', False):
            accessibility += 25
            features.append('elevator access')
        
        # Doorway width scoring
        doorway_width = row.get('doorway_width_cm', 0) or 0
        if doorway_width >= 91:  # 36 inches
            accessibility += 25
            features.append('ADA-compliant doorways')
        elif doorway_width >= 81:  # 32 inches
            accessibility += 15
            features.append('wide doorways')
        
        if row.get('acc_bath', False):
            accessibility += 25
            features.append('accessible bathroom')
        if row.get('acc_parking', False):
            accessibility += 25
            features.append('accessible parking')
        
        # Safety Score (0-100)
        distance = row.get('dist_to_campus_km', 2) or 2
        safety = max(0, 100 - distance * 15)  # Penalize distance more heavily
        
        if row.get('well_lit', False):
            safety += 20
        safety = min(100, safety)
        
        # Commute Score (0-100)
        walk_time = row.get('walk_min', 20) or 20
        bus_frequency = row.get('bus_headway_min', 20) or 20
        commute = max(0, 100 - (walk_time + bus_frequency) / 2)
        
        # Inclusivity Score (0-100)
        inclusivity = 0
        inclusive_features = []
        
        if row.get('accepts_international', False):
            inclusivity += 25
            inclusive_features.append('accepts international students')
        if row.get('no_ssn_ok', False):
            inclusivity += 25
            inclusive_features.append('no SSN required')
        if row.get('cosigner_ok', False):
            inclusivity += 25
            inclusive_features.append('allows co-signers')
        if row.get('anti_disc_policy', False):
            inclusivity += 25
            inclusive_features.append('anti-discrimination policy')
        
        # Weighted overall score
        overall_score = (
            0.35 * affordability +
            0.20 * accessibility +
            0.20 * safety +
            0.15 * commute +
            0.10 * inclusivity
        )
        
        # Determine tier
        if overall_score >= 90:
            tier = 'Gold'
        elif overall_score >= 75:
            tier = 'Silver'
        elif overall_score >= 50:
            tier = 'Bronze'
        else:
            tier = 'Needs Improvement'
        
        return {
            'di_score': round(overall_score, 2),
            'subscores': {
                'affordability': round(affordability, 2),
                'accessibility': round(accessibility, 2),
                'safety': round(safety, 2),
                'commute': round(commute, 2),
                'inclusivity': round(inclusivity, 2)
            },
            'score_tier': tier,
            'score_breakdown': f"Affordability: {affordability:.1f}, Accessibility: {accessibility:.1f}, Safety: {safety:.1f}, Commute: {commute:.1f}, Inclusivity: {inclusivity:.1f}",
            'accessibility_features': ', '.join(features) if features else 'Limited accessibility features',
            'inclusive_features': ', '.join(inclusive_features) if inclusive_features else 'Limited inclusive features'
        }
    
    def _create_sample_data(self) -> pd.DataFrame:
        """Create sample data if CSV is not available"""
        logger.info("Creating sample data...")
        
        sample_data = [
            {
                'id': 1, 'title': 'Modern Studio Apartment', 'addr': '123 University Ave, Blacksburg, VA',
                'rent': 1200, 'avg_utils': 150, 'deposit': 1200, 'bedrooms': 1, 'bathrooms': 1,
                'step_free': True, 'elevator': True, 'doorway_width_cm': 91, 'acc_bath': True, 'acc_parking': True,
                'well_lit': True, 'dist_to_campus_km': 0.5, 'walk_min': 8, 'bus_headway_min': 10,
                'accepts_international': True, 'no_ssn_ok': True, 'cosigner_ok': True, 'anti_disc_policy': True
            },
            {
                'id': 2, 'title': 'Cozy 2-Bedroom House', 'addr': '456 Main St, Blacksburg, VA',
                'rent': 1800, 'avg_utils': 200, 'deposit': 1800, 'bedrooms': 2, 'bathrooms': 2,
                'step_free': False, 'elevator': False, 'doorway_width_cm': 81, 'acc_bath': False, 'acc_parking': True,
                'well_lit': True, 'dist_to_campus_km': 1.2, 'walk_min': 15, 'bus_headway_min': 15,
                'accepts_international': True, 'no_ssn_ok': False, 'cosigner_ok': True, 'anti_disc_policy': True
            },
            {
                'id': 3, 'title': 'Luxury Apartment Complex', 'addr': '789 College Dr, Blacksburg, VA',
                'rent': 2200, 'avg_utils': 250, 'deposit': 2200, 'bedrooms': 3, 'bathrooms': 2,
                'step_free': True, 'elevator': True, 'doorway_width_cm': 91, 'acc_bath': True, 'acc_parking': True,
                'well_lit': True, 'dist_to_campus_km': 0.8, 'walk_min': 10, 'bus_headway_min': 8,
                'accepts_international': True, 'no_ssn_ok': True, 'cosigner_ok': True, 'anti_disc_policy': True
            }
        ]
        
        return pd.DataFrame(sample_data)
    
    def export_results(self, output_dir: str = "output"):
        """Export results in multiple formats"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        if self.gold_df is None:
            self.gold_layer()
        
        # JSON for API consumption
        self.gold_df.to_json(output_path / "gold_housing_data.json", orient='records', indent=2)
        
        # CSV for human inspection
        self.gold_df.to_csv(output_path / "gold_housing_data.csv", index=False)
        
        # Parquet for efficient storage
        self.gold_df.to_parquet(output_path / "housing_di_scores.parquet", index=False)
        
        # Summary statistics
        summary = {
            'total_listings': len(self.gold_df),
            'average_di_score': round(self.gold_df['di_score'].mean(), 2),
            'score_distribution': self.gold_df['score_tier'].value_counts().to_dict(),
            'top_features': {
                'most_accessible': len(self.gold_df[self.gold_df['subscores'].apply(lambda x: x['accessibility'] >= 80)]),
                'most_affordable': len(self.gold_df[self.gold_df['subscores'].apply(lambda x: x['affordability'] >= 80)]),
                'most_inclusive': len(self.gold_df[self.gold_df['subscores'].apply(lambda x: x['inclusivity'] >= 80)])
            }
        }
        
        with open(output_path / "pipeline_summary.json", 'w') as f:
            json.dump(summary, f, indent=2)
        
        logger.info(f"✅ Results exported to {output_path}/")
        logger.info(f"📊 Score distribution: {summary['score_distribution']}")
        logger.info(f"📈 Average D&I score: {summary['average_di_score']}")
        
        return summary

def main():
    """Main pipeline execution"""
    logger.info("🚀 Starting Inclusive Housing Navigator D&I Pipeline")
    
    pipeline = DIPipeline()
    
    # Execute pipeline stages
    pipeline.bronze_layer()
    pipeline.silver_layer()
    pipeline.gold_layer()
    
    # Export results
    summary = pipeline.export_results()
    
    logger.info("🎉 Pipeline completed successfully!")
    return summary

if __name__ == "__main__":
    main()
