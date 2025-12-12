from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime, timedelta
import numpy as np

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "CoinMind Finance API Ready"}

@app.get("/predict/{ticker}")
def predict_crypto(ticker: str):
    # 1. FETCH LIVE DATA (Last 60 days, 1h interval)
    symbol = f"{ticker.upper()}-USD"
    # multi_level_index=False ensures simple column names
    data = yf.download(symbol, period="60d", interval="1h", progress=False)
    
    if data.empty:
        return {"error": "Symbol not found"}

    # 2. PREPARE DATA FOR AI
    # Clean up column names just in case (Flatten multi-index if present)
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.get_level_values(0)

    df = data[['Close']].copy()
    df['Prediction'] = df['Close'].shift(-1) # Target is NEXT hour
    
    # Drop NaN values created by shift
    df_clean = df.dropna()

    X = np.array(df_clean['Close']).reshape(-1, 1)
    y = np.array(df_clean['Prediction'])
    
    # 3. TRAIN MODEL
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # 4. PREDICT NEXT 24 HOURS
    future_prices = []
    # Start predicting from the very last real price we have
    last_real_price = df['Close'].iloc[-1]
    current_input = np.array([[last_real_price]])
    
    for _ in range(24):
        next_pred = model.predict(current_input)[0]
        future_prices.append(float(next_pred))
        current_input = np.array([[next_pred]])

    # 5. FORMAT DATA FOR FRONTEND (The Fix is Here)
    # Get last 24 hours of history
    history = df['Close'].tail(24).reset_index()
    
    # FORCE RENAME columns to avoid KeyError
    # The first column is always Time, second is Price
    history.columns = ['time', 'price']
    
    history_data = []
    for _, row in history.iterrows():
        history_data.append({
            "time": str(row['time'])[11:16], # Extract HH:MM
            "price": float(row['price']),
            "type": "History"
        })
    
    # Add Predicted Data
    future_data = []
    current_time = datetime.now()
    for i, price in enumerate(future_prices):
        time_str = (current_time + timedelta(hours=i+1)).strftime("%H:%M")
        future_data.append({"time": time_str, "price": round(price, 2), "type": "Prediction"})

    # Determine Trend
    current_price = history_data[-1]['price']
    final_pred = future_data[-1]['price']
    trend = "Bullish 🚀" if final_pred > current_price else "Bearish 🔻"
    percent = ((final_pred - current_price) / current_price) * 100

    return {
        "symbol": symbol,
        "current_price": round(current_price, 2),
        "predicted_price_24h": round(final_pred, 2),
        "trend": trend,
        "change_percent": round(percent, 2),
        "graph_data": history_data + future_data
    }