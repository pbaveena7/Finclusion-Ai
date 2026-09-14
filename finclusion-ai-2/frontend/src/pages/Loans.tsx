import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Activity, AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react';

export default function Loans() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(5);
  const [income, setIncome] = useState(80000);

  // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = rate / 12 / 100;
  const totalMonths = tenure * 12;
  const emi = Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1));
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  // Stress Test
  const dti = (emi / income) * 100; // Debt to Income ratio
  let stressStatus = { text: 'Healthy', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> };
  
  if (dti > 50) {
    stressStatus = { text: 'High Risk', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: <AlertCircle className="w-5 h-5 text-red-400" /> };
  } else if (dti > 35) {
    stressStatus = { text: 'Warning', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: <AlertCircle className="w-5 h-5 text-amber-400" /> };
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#090b14] text-white pt-24 px-8 pb-32"
    >
      <div className="max-w-6xl mx-auto">
        
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Landmark className="w-10 h-10 text-orange-400" />
            Loans & EMIs
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Calculate your monthly obligations and run a financial stress test to ensure you borrow responsibly.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          
          {/* Calculator Controls */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 bg-[#131828]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-8">EMI Calculator</h2>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-white/80">Loan Amount (Principal)</label>
                  <span className="text-emerald-400 font-bold">₹{principal.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="50000" max="10000000" step="50000"
                  value={principal} onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-white/80">Interest Rate (% p.a.)</label>
                  <span className="text-orange-400 font-bold">{rate}%</span>
                </div>
                <input 
                  type="range" min="5" max="24" step="0.5"
                  value={rate} onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-white/80">Loan Tenure (Years)</label>
                  <span className="text-blue-400 font-bold">{tenure} Years</span>
                </div>
                <input 
                  type="range" min="1" max="30" step="1"
                  value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-white/80">Your Monthly Income</label>
                  <span className="text-white font-bold">₹{income.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="20000" max="500000" step="5000"
                  value={income} onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full accent-white"
                />
                <p className="text-xs text-white/40 mt-2">Used for Financial Stress Test calculations</p>
              </div>
            </div>
          </motion.div>

          {/* Results & Stress Test */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* EMI Result */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-purple-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
              <p className="text-purple-300 font-medium mb-2">Your Monthly EMI</p>
              <h3 className="text-5xl font-bold mb-6">₹{emi.toLocaleString()}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Principal Amount</span>
                  <span className="font-medium">₹{principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Total Interest</span>
                  <span className="font-medium text-orange-400">₹{totalInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                  <span className="text-white/80 font-bold">Total Payment</span>
                  <span className="font-bold">₹{totalPayment.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Stress Test */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`border ${stressStatus.border} ${stressStatus.bg} rounded-3xl p-8 backdrop-blur-xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Financial Stress Test
                </h3>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${stressStatus.border} bg-white/5`}>
                  {stressStatus.icon}
                  <span className={`text-sm font-bold ${stressStatus.color}`}>{stressStatus.text}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Debt-to-Income (DTI) Ratio</span>
                  <span className={`font-bold ${stressStatus.color}`}>{dti.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${dti > 50 ? 'bg-red-500' : dti > 35 ? 'bg-amber-500' : 'bg-emerald-500'} rounded-full`} style={{ width: `${Math.min(dti, 100)}%` }} />
                </div>
              </div>

              <p className="text-sm text-white/60 mt-4 leading-relaxed">
                {dti > 50 
                  ? "Warning: Your EMI exceeds 50% of your monthly income. This poses a severe risk to your financial stability. Consider a lower loan amount or longer tenure." 
                  : dti > 35 
                  ? "Caution: Your EMI takes up a significant portion of your income. Ensure you have an adequate emergency fund before proceeding." 
                  : "Healthy: This EMI is well within safe limits, leaving you with sufficient income for living expenses and investments."}
              </p>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
