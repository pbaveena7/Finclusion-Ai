interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantStyles = {
  success: 'bg-[#C4EED0] text-[#0F5223] border-transparent',
  danger: 'bg-[#FFD8E4] text-[#B3261E] border-transparent',
  warning: 'bg-[#FFDF99] text-[#7D5260] border-transparent',
  info: 'bg-[#D3E3FD] text-[#0B57D0] border-transparent',
  neutral: 'bg-[#E7E0EC] text-[#49454F] border-transparent',
  purple: 'bg-[#E8DEF8] text-[#1D192B] border-transparent',
};

const dotColors = {
  success: 'bg-[#0F5223]',
  danger: 'bg-[#B3261E]',
  warning: 'bg-[#7D5260]',
  info: 'bg-[#0B57D0]',
  neutral: 'bg-[#49454F]',
  purple: 'bg-[#1D192B]',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
