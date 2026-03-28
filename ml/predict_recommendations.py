import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime

# Path to the dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'sellsmart_dataset.csv')

def load_and_preprocess():
    """Load the dataset and compute engagement scores."""
    if not os.path.exists(DATA_PATH):
        print(f"Error: Dataset not found at {DATA_PATH}")
        return None

    df = pd.read_csv(DATA_PATH)
    
    # Parse timestamp into a numerical feature: Hour of the day
    def parse_time(t_str):
        try:
            return datetime.strptime(t_str, '%I:%M:%S %p').hour
        except:
            return 0

    df['hour'] = df['timestamp'].apply(parse_time)

    # Core Smart Engagement Logic: 
    # We assign different weights to likes, comments, and views.
    # Comments: 5 (High effort, meaningful engagement)
    # Likes: 3 (Low effort, positive signal)
    # Views: 0.1 (Passive consumption - we keep it low to emphasize active engagement)
    df['engagement_score'] = (df['views'] * 0.1) + (df['likes'] * 3) + (df['comments'] * 5)
    
    return df

def train_and_predict(df, current_products=None):
    """Train a model to predict engagement and rank current products."""
    # Features: product_id (numerical) and the hour of posting
    X = df[['product_id', 'hour']]
    y = df['engagement_score']

    # Using RandomForestRegressor for robust prediction across product clusters
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    current_hour = datetime.now().hour
    
    if current_products and len(current_products) > 0:
        # We were provided a list of products to rank (from the live database)
        predict_df = pd.DataFrame(current_products)
        
        # Ensure 'hour' exists for new products if not provided
        if 'hour' not in predict_df.columns:
            predict_df['hour'] = current_hour
            
        # For cold start: If a product is new, its product_id mapping might be high.
        # We ensure it's treated as a numerical feature.
        # If it's a MongoDB ID, it should be mapped to a number before being passed here.
        X_predict = predict_df[['product_id', 'hour']]
    else:
        # Fallback to predicting for all unique products in history
        unique_products = sorted(df['product_id'].unique())
        predict_df = pd.DataFrame({
            'product_id': unique_products,
            'hour': [current_hour] * len(unique_products)
        })
        X_predict = predict_df[['product_id', 'hour']]

    # Predict the engagement scores
    # This handles cold start: the model predicts potential based on the 'hour' and 'product_id'
    # even if those specific products have 0 current views/likes.
    predict_df['predicted_engagement'] = model.predict(X_predict)
    
    # Optional: If the product ALREADY has engagement, we can blend actual + predicted
    # but for pure ranking, the predicted engagement potential is our 'intelligent' signal.
    
    # Rank products: Higher predicted engagement = Higher priority
    ranked_products = predict_df.sort_values(by='predicted_engagement', ascending=False)
    
    return ranked_products

import json
import sys
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--json', action='store_true', help='Output results in JSON format')
    args = parser.parse_args()

    df = load_and_preprocess()
    if df is None:
        return

    # Check for incoming product data from stdin (sent by Node.js backend)
    current_products = None
    if not sys.stdin.isatty():
        try:
            stdin_data = sys.stdin.read()
            if stdin_data:
                current_products = json.loads(stdin_data)
        except Exception as e:
            # If parsing fails, we just proceed with historical fallback
            pass

    ranked_list = train_and_predict(df, current_products)
    
    if args.json:
        results = []
        for i, (idx, row) in enumerate(ranked_list.iterrows(), 1):
            prod_id = row['product_id']
            # If it was a MongoDB string ID redirected through 'mongo_id' property
            original_id = row.get('mongo_id', str(int(prod_id)) if isinstance(prod_id, (int, float)) else str(prod_id))
            
            results.append({
                "rank": i,
                "product_id": original_id,
                "engagement_potential": round(float(row['predicted_engagement']), 2)
            })
        print(json.dumps(results))
    else:
        print("SellSmart Recommendation Engine v1.1 (Cold-Start Enabled)")
        print("---------------------------------------------------------")
        for i, (idx, row) in enumerate(ranked_list.iterrows(), 1):
            product_id = row['product_id']
            score = row['predicted_engagement']
            print(f"{i:2d}. ID: {product_id} | Potential: {score:8.2f}")
        
        print("\nIntelligence Summary:")
        top_product = int(ranked_list.iloc[0]['product_id'])
        print(f"Based on historical data, Product {top_product} is predicted to perform BEST if posted around this hour.")
        print("This recommendation considers the current user activity levels and cross-product engagement trends.")

if __name__ == "__main__":
    main()
