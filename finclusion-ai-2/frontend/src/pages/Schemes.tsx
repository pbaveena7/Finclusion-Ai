import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Landmark, PiggyBank, ShieldCheck, GraduationCap, Building } from 'lucide-react';

export default function Schemes() {
  const schemes = [
    {
      title: "Public Provident Fund (PPF)",
      icon: <PiggyBank className="w-8 h-8 text-amber-400" />,
      tag: "Tax Saving",
      desc: "A long-term investment scheme backed by the Government of India offering safety with attractive interest rates and returns that are fully exempted from Tax.",
      interest: "7.1% p.a.",
      lockin: "15 Years",
      taxBenefit: "Section 80C (Up to ₹1.5L)"
    },
    {
      title: "National Pension System (NPS)",
      icon: <Building className="w-8 h-8 text-blue-400" />,
      tag: "Retirement",
      desc: "A voluntary, defined contribution retirement savings scheme designed to enable systematic savings during the subscriber's working life.",
      interest: "Market Linked (9-12%)",
      lockin: "Until age 60",
      taxBenefit: "Section 80CCD(1B) (Extra ₹50k)"
    },
    {
      title: "Sukanya Samriddhi Yojana (SSY)",
      icon: <GraduationCap className="w-8 h-8 text-pink-400" />,
      tag: "Girl Child",
      desc: "A government-backed savings scheme targeted at the parents of girl children, encouraging them to build a fund for future education and marriage expenses.",
      interest: "8.2% p.a.",
      lockin: "21 Years",
      taxBenefit: "Section 80C (Up to ₹1.5L)"
    },
    {
      title: "Atal Pension Yojana (APY)",
      icon: <Landmark className="w-8 h-8 text-emerald-400" />,
      tag: "Pension",
      desc: "A pension scheme for citizens of India focused on the unorganized sector workers, guaranteeing a minimum monthly pension.",
      interest: "Guaranteed Pension",
      lockin: "Until age 60",
      taxBenefit: "Section 80CCD"
    }
  ];

  return (
    <div className="min-h-screen bg-[#090b14] text-white font-sans overflow-y-auto relative pb-20">
      <div className="fixed top-[10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <nav className="relative z-40 px-8 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 bg-[#090b14]/80">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-xl tracking-tight text-amber-400">Government Schemes</span>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium text-white/60">
          <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
          <Link to="/mutual-funds" className="hover:text-white transition-colors">Mutual Funds</Link>
          <Link to="/stocks" className="hover:text-white transition-colors">Stocks & F&O</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-bold tracking-wide mb-6">
            <ShieldCheck className="w-4 h-4" />
            100% SOVEREIGN GUARANTEE
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Official Government Schemes</h1>
          <p className="text-white/50 max-w-2xl text-lg">Secure your future with zero-risk investment vehicles. AI-verified official schemes offering tax benefits and guaranteed returns.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme, idx) => (
            <div key={idx} className="bg-[#131828]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-8 shadow-2xl hover:border-white/10 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                  {scheme.icon}
                </div>
                <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-white/70 border border-white/10">
                  {scheme.tag}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{scheme.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8 min-h-[60px]">
                {scheme.desc}
              </p>

              <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Returns</p>
                  <p className="font-bold text-white text-sm">{scheme.interest}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Lock-in</p>
                  <p className="font-bold text-white text-sm">{scheme.lockin}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Tax Benefit</p>
                  <p className="font-bold text-emerald-400 text-sm">{scheme.taxBenefit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
