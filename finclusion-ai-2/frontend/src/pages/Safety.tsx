import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Search, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Safety() {
  const [query, setQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!query) return;
    setIsScanning(true);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/fraud/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error scanning for fraud:', error);
      // Fallback if backend is down
      setResult({ status: 'safe', message: 'Backend disconnected', description: 'Could not reach the AI Engine.', flags: [] });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#090b14] text-white pt-24 px-8 pb-32 relative overflow-hidden"
    >
      
      {/* Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Trust & Safety Engine</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            AI-powered fraud detection. Paste any suspicious investment message, URL, or company name below to verify its legitimacy against SEBI & RBI guidelines.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="bg-[#131828]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl mb-8 transition-all hover:border-white/20"
        >
          <div className="relative">
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'Invest ₹5,000 and get guaranteed 40% returns every month! Join our WhatsApp group...'"
              className="w-full bg-black/20 border border-white/5 rounded-2xl p-6 min-h-[150px] text-white focus:outline-none focus:border-emerald-500/50 resize-none"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScan}
              disabled={isScanning || !query}
              className={`absolute bottom-4 right-4 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                isScanning ? 'bg-emerald-500/50 text-white cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
              }`}
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Scan with AI
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
        {result && result.status === 'risk' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-500 mb-2">{result.message}</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  {result.description}
                  <strong className="text-white block mt-2">Do not invest money or share personal information.</strong>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.flags.map((flag: any, idx: number) => (
                    <div key={idx} className="bg-black/20 rounded-xl p-4 border border-red-500/20">
                      <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                        <AlertTriangle className="w-4 h-4" /> {flag.title}
                      </div>
                      <p className="text-sm text-white/60">{flag.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {result && result.status === 'safe' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-8"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-500 mb-2">{result.message}</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  {result.description}
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  {result.flags.map((flag: any, idx: number) => (
                    <div key={idx} className="bg-black/20 rounded-xl p-4 border border-emerald-500/20">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                        <ShieldCheck className="w-4 h-4" /> {flag.title}
                      </div>
                      <p className="text-sm text-white/60">{flag.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
