"use client";

interface Metric {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
}

export default function AnalyticsOverview() {
  const metrics: Metric[] = [
    {
      label: "Total Memories",
      value: "1,284",
      change: "+12% this week",
      trend: "up"
    },
    {
      label: "Tokens Captured",
      value: "4.2M",
      change: "284k today",
      trend: "up"
    },
    {
      label: "Estimated Cost",
      value: "$42.18",
      change: "Saved $12.50",
      trend: "down"
    },
    {
      label: "Context Efficiency",
      value: "94%",
      change: "+2% vs last month",
      trend: "up"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {metrics.map((metric, i) => (
        <div key={i} className="p-6 rounded-3xl glass border border-white/5 relative overflow-hidden group hover:border-brand-primary/30 transition-all duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-16 h-16 text-brand-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">{metric.label}</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-3xl font-bold tracking-tight">{metric.value}</h3>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              metric.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-primary/10 text-brand-primary'
            }`}>
              {metric.change}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
        </div>
      ))}
    </div>
  );
}
