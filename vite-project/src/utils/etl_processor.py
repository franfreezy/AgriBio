import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
import os
import json
from datetime import datetime

class ETLProcessor:
    def __init__(self, upload_dir: str, processed_dir: str):
        """
        Initialize ETL processor with input and output directories
        """
        self.upload_dir = upload_dir
        self.processed_dir = processed_dir
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(processed_dir, exist_ok=True)

    def validate_columns(self, df: pd.DataFrame, required_columns: List[str]) -> Tuple[bool, str]:
        """
        Validate if all required columns are present
        """
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return False, f"Missing required columns: {', '.join(missing_columns)}"
        return True, "All required columns present"

    def check_missing_values(self, df: pd.DataFrame) -> Dict:
        """
        Check for missing values in each column
        """
        missing_stats = {}
        for column in df.columns:
            missing_count = df[column].isna().sum()
            if missing_count > 0:
                missing_stats[column] = {
                    'count': int(missing_count),
                    'percentage': round(float(missing_count / len(df) * 100), 2)
                }
        return missing_stats

    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Basic data cleaning operations
        """
        # Remove duplicate rows
        df = df.drop_duplicates()
        
        # Convert date columns to datetime
        date_columns = df.select_dtypes(include=['object']).columns
        for col in date_columns:
            try:
                if df[col].str.match(r'\d{4}-\d{2}-\d{2}').any():
                    df[col] = pd.to_datetime(df[col])
            except:
                continue
        
        return df

    def process_file(self, file_path: str, required_columns: List[str]) -> Dict:
        """
        Process a single file
        """
        try:
            # Read file
            file_extension = os.path.splitext(file_path)[1].lower()
            if file_extension == '.csv':
                df = pd.read_csv(file_path)
            elif file_extension in ['.xlsx', '.xls']:
                df = pd.read_excel(file_path)
            else:
                return {
                    'status': 'error',
                    'message': f'Unsupported file format: {file_extension}'
                }

            # Validate columns
            valid_columns, message = self.validate_columns(df, required_columns)
            if not valid_columns:
                return {
                    'status': 'error',
                    'message': message
                }

            # Check missing values
            missing_stats = self.check_missing_values(df)

            # Clean data
            cleaned_df = self.clean_data(df)

            # Calculate basic statistics
            stats = {
                'row_count': len(cleaned_df),
                'column_count': len(cleaned_df.columns),
                'missing_values': missing_stats,
                'duplicates_removed': len(df) - len(cleaned_df)
            }

            # Save processed file
            output_filename = os.path.join(
                self.processed_dir,
                f"cleaned_{os.path.basename(file_path)}"
            )
            
            if file_extension == '.csv':
                cleaned_df.to_csv(output_filename, index=False)
            else:
                cleaned_df.to_excel(output_filename, index=False)

            return {
                'status': 'cleaned',
                'message': 'File processed successfully',
                'stats': stats,
                'output_file': output_filename
            }

        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    def get_required_columns(self, file_type: str) -> List[str]:
        """
        Get required columns based on file type
        """
        # Define required columns for different file types
        column_requirements = {
            'crop_survey': ['date', 'crop_type', 'field_id', 'area', 'yield'],
            'soil_sample': ['date', 'field_id', 'depth', 'ph', 'nitrogen', 'phosphorus', 'potassium'],
            'weather_data': ['date', 'temperature', 'humidity', 'rainfall'],
        }
        return column_requirements.get(file_type, [])
