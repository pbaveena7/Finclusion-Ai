import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartProps {
  data: { date: string; value: number }[] | { date: string; price: number }[];
  dataKey?: string;
  color?: string;
  gradientId?: string;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

const CustomTooltip = ({ active, payload, label, formatValue }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 shadow-xl border border-border-primary">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">
        {formatValue ? formatValue(payload[0].value) : `₹${payload[0].value.toLocaleString('en-IN')}`}
      </p>
    </div>
  );
};

export default function AreaChartComponent({
  data,
  dataKey = 'value',
  color = '#10b981',
  gradientId = 'areaGradient',
  height = 300,
  showGrid = true,
  showAxis = true,
  showTooltip = true,
  formatValue,
  className = '',
}: AreaChartProps) {
  // Handle both 'value' and 'price' data keys
  const normalizedData = data.map((d: any) => ({
    date: d.date,
    value: d[dataKey] ?? d.value ?? d.price,
  }));

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={normalizedData} margin={{ top: 5, right: 5, left: showAxis ? 10 : 0, bottom: 5 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.06)" vertical={false} />
          )}
          {showAxis && (
            <>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
                  if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
                  return val.toString();
                }}
                width={50}
                domain={['auto', 'auto']}
              />
            </>
          )}
          {showTooltip && (
            <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
