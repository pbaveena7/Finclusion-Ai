import { motion } from 'framer-motion';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-1 p-1 bg-[#E8DEF8] rounded-[16px] overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative px-4 py-2 text-sm font-semibold rounded-[12px] whitespace-nowrap transition-colors ${
            activeTab === tab ? 'text-[#1D192B]' : 'text-[#49454F] hover:text-[#1C1B1F]'
          }`}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-[#FFFBFE] rounded-[12px] shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}
