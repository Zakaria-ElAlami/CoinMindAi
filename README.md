# 📈 CoinMind AI

**CoinMind** is a full-stack financial forecasting dashboard. It fetches live market data, trains a Machine Learning model (Random Forest) in real-time, and predicts the next 24 hours of price movement for any cryptocurrency.

### 🚀 [Click Here to Open Live Demo](https://coinmindai.vercel.app/)

---

## 📸 Dashboard Preview
*(Optional: Add a screenshot of the graph here)*

## 🧠 Core Features
* **Real-Time Ingestion:** Connects to Yahoo Finance API to pull the last 60 days of hourly OHLCV data.
* **On-the-Fly Training:** Instantly trains a `RandomForestRegressor` on the specific ticker requested by the user.
* **Rolling Forecast:** Uses a recursive prediction window to generate a 24-hour trend line.
* **Interactive UI:** Built with **Recharts** for responsive, high-fidelity data visualization.

## 🛠️ Technical Architecture
* **Frontend:** Next.js 14, Tailwind CSS, Axios, Lucide React (Hosted on Vercel).
* **Backend:** FastAPI, Pandas, Scikit-Learn, Uvicorn (Hosted on Render).
* **Data Pipeline:**
    1.  User requests Ticker (e.g., "SOL").
    2.  Backend fetches raw data & cleans missing intervals.
    3.  Pandas creates lag features for supervised learning.
    4.  Model fits to data and outputs json predictions.

## 📦 Run Locally
1.  **Clone the repo**
    ```bash
    git clone [https://github.com/Zakaria-ElAlami/CoinMindAi.git](https://github.com/Zakaria-ElAlami/CoinMindAi.git)
    ```
2.  **Start Backend**
    ```bash
    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```
3.  **Start Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---
**Developed by Zakaria El Alami**
