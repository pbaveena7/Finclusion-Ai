import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Home, GraduationCap, Plane, Plus, ArrowRight, Wallet } from 'lucide-react';

export default function GoalPlanner() {
  const [goals] = useState([
    {
      id: 1,
      title: 'Dream Home',
      icon: <Home className="w-6 h-6 text-pink-400" />,
      target: 8000000,
      saved: 1200000,
      year: 2028,
      color: 'from-pink-500 to-rose-400'
    },
    {
      id: 2,
      title: 'Child Education',
      icon: <GraduationCap className="w-6 h-6 text-blue-400" />,
      target: 5000000,
      saved: 1500000,
      year: 2034,
      color: 'from-blue-500 to-cyan-400'
    },
    {
      id: 3,
      title: 'World Tour',
      icon: <Plane className="w-6 h-6 text-emerald-400" />,
      target: 1000000,
      saved: 800000,
      year: 2025,
      color: 'from-emerald-500 to-teal-400'
    }
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#090b14] text-white pt-24 px-8 pb-32"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <Target className="w-10 h-10 text-emerald-400" />
              Goal Planner
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Turn your dreams into achievable milestones. AI-driven SIP recommendations to ensure you hit your targets on time.
            </p>
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500 hover:text-white transition-all font-bold"
          >
            <Plus className="w-5 h-5" /> Add New Goal
          </motion.button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {goals.map(goal => {
            const progress = (goal.saved / goal.target) * 100;
            const remaining = goal.target - goal.saved;
            const yearsLeft = goal.year - new Date().getFullYear();
            // Simple SIP estimate (rough 12% return assumption for display)
            const monthlySIP = Math.round(remaining / (yearsLeft * 12 * 1.5)); 

            return (
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                key={goal.id} 
                className="bg-[#131828]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl transition-colors hover:border-white/20 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                  {goal.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-1">{goal.title}</h3>
                <p className="text-sm text-white/40 font-bold mb-6">TARGET YEAR: {goal.year}</p>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">₹{(goal.saved / 100000).toFixed(1)}L Saved</span>
                    <span className="font-bold">₹{(goal.target / 100000).toFixed(1)}L Goal</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div className={`h-full bg-gradient-to-r ${goal.color} rounded-full`} style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-white/50 mb-1 flex items-center gap-1"><Wallet className="w-3 h-3"/> Required SIP</p>
                    <p className="font-bold text-lg">₹{monthlySIP.toLocaleString()}<span className="text-sm text-white/40 font-normal">/mo</span></p>
                  </div>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
