"use client";
import { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Search, Activity, Cpu, Database, Info, AlertTriangle } from "lucide-react";

export default function Home() {
  const [ticker, setTicker] = useState("BTC");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
        const res = await axios.get(`https://coinmindaibackend.onrender.com/predict/${ticker}`);      if (res.data.error) {
        alert("Symbol not found! Try BTC, ETH, or SOL.");
      } else {
        setData(res.data);
      }
    } catch (err) {
      alert("Is the Backend running?");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0b1120] text-slate-300 font-sans selection:bg-emerald-500/30">
      
      {/* NAVBAR */}
      <nav className="border-b border-slate-800 bg-[#0b1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <Activity className="text-emerald-500" size={24} />
            Coin<span className="text-emerald-500">Mind</span>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            v1.0 BETA
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* HERO SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Predict the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Future</span> of Crypto
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real-time machine learning forecasting using Random Forest algorithms. 
            Train a model instantly on the last 60 days of market data.
          </p>
        </div>

        {/* SEARCH & CHEAT SHEET */}
        <div className="flex flex-col items-center mb-16">
          <div className="flex bg-slate-800 p-2 rounded-full border border-slate-700 w-full max-w-md shadow-2xl shadow-emerald-500/10">
            <input 
              type="text" 
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="bg-transparent border-none outline-none text-white px-6 w-full font-bold tracking-widest placeholder-slate-600"
              placeholder="BTC"
            />
            <button 
              onClick={handlePredict}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-3 rounded-full transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Training AI..." : <><Search size={18}/> Predict</>}
            </button>
          </div>
          
          {/* Popular Tickers Helper */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
            <span className="uppercase tracking-wider font-semibold mr-2">Popular:</span>
            {['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOGE', 'DOT', 'MATIC'].map(t => (
                <button 
                    key={t}
                    onClick={() => setTicker(t)}
                    className="hover:text-emerald-400 transition cursor-pointer bg-slate-800/50 px-2 py-1 rounded border border-slate-700 hover:border-emerald-500/50"
                >
                    {t}
                </button>
            ))}
          </div>
        </div>

        {/* RESULTS DASHBOARD */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 mb-24">
            
            {/* STATS COLUMN */}
            <div className="space-y-6">
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Live Price</p>
                <h2 className="text-4xl font-bold text-white flex items-center">
                  <DollarSign size={28} className="text-slate-500"/>
                  {data.current_price.toLocaleString()}
                </h2>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">24h AI Forecast</p>
                <h2 className={`text-4xl font-bold flex items-center ${data.change_percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                   <DollarSign size={28} className="text-slate-500"/>
                   {data.predicted_price_24h.toLocaleString()}
                </h2>
                <div className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-sm font-bold ${data.change_percent >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                   {data.change_percent >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                   {data.change_percent}%
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Model Confidence</p>
                <h2 className="text-2xl font-bold text-white mb-1">{data.trend}</h2>
                <p className="text-xs text-slate-500">Based on Random Forest regression of last 1,440 data points.</p>
              </div>
            </div>

            {/* MAIN GRAPH */}
            <div className="lg:col-span-2 bg-slate-800/30 p-6 rounded-2xl border border-slate-700 h-[450px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-300 font-medium flex items-center gap-2">
                    <Activity size={18} className="text-emerald-500"/> Price Projection
                </h3>
                <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> History</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-400"></div> Prediction</span>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={data.graph_data}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#475569" fontSize={12} tickMargin={10} />
                  <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={12} tickFormatter={(val) => `$${val.toLocaleString()}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* HOW IT WORKS (The "About" Section) */}
        <div className="border-t border-slate-800 pt-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">System Architecture</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-800/20 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition group">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                        <Database className="text-emerald-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">1. Data Ingestion</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        The system connects to Yahoo Finance API to fetch the last <strong>60 days</strong> of hourly OHLCV data for the requested ticker.
                    </p>
                </div>

                <div className="bg-slate-800/20 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition group">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                        <Cpu className="text-cyan-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">2. Live Training</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        A <strong>Random Forest Regressor</strong> (Scikit-Learn) is trained on-the-fly. It learns patterns from the lagged price data to understand momentum.
                    </p>
                </div>

                <div className="bg-slate-800/20 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                        <Activity className="text-purple-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">3. Rolling Forecast</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        The model predicts the next hour, feeds that prediction back into itself, and repeats 24 times to generate a full day trend line.
                    </p>
                </div>
            </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-16 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-amber-500/80">
                <strong>Disclaimer:</strong> This is an AI engineering portfolio project. Predictions are generated by machine learning algorithms and should not be used as financial advice.
            </p>
        </div>

      </div>
    </main>
  );
}