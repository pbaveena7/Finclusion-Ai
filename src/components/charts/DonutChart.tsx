import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DonutChartProps {
  data: { category: string; value: number; percentage: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
  height?: number;
  className?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 shadow-xl border border-border-primary">
      <p className="text-xs text-slate-400">{d.category}</p>
      <p className="text-sm font-semibold text-white">
        ₹{d.value.toLocaleString('en-IN')} ({d.percentage}%)
      </p>
    </div>
  );
};

export default function DonutChart({
  data,
  centerLabel,
  centerValue,
  height = 250,
  className = '',
}: DonutChartProps) {
  return (
    <div className={`relative ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            dataKey="value"
            nameKey="category"
            paddingAngle={3}
            animationBegin={200}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="transparent"
                style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && (
            <span className="text-xl font-bold text-white">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-xs text-slate-400 mt-0.5">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
