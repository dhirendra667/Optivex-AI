"use client";

// ─── components/audit/SpendBreakdownChart.tsx ──────────────────────────────

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SpendBreakdownItem } from "@/types/audit";
import { formatCurrency, verdictConfig } from "@/lib/utils/helpers";

interface SpendBreakdownChartProps {
  data: SpendBreakdownItem[];
  totalMonthlySpend: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as SpendBreakdownItem;
  const verdict = verdictConfig(item.verdict);

  return (
    <div className="glass-card rounded-xl p-3 border border-white/8 shadow-xl">
      <p className="text-sm font-semibold text-white mb-1">{item.name}</p>
      <p className="text-xs text-white/60">{formatCurrency(item.value)}/mo</p>
      <p className="text-xs text-white/40">{item.percentage}% of spend</p>
      <span
        className="text-[10px] font-medium px-1.5 py-0.5 rounded mt-1 inline-block"
        style={{ color: verdict.color, background: verdict.bg }}
      >
        {verdict.label}
      </span>
    </div>
  );
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap gap-2 justify-center mt-3">
    {payload?.map((entry: any, i: number) => (
      <div key={i} className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: entry.color }}
        />
        <span className="text-xs text-white/50">{entry.value}</span>
      </div>
    ))}
  </div>
);

export function SpendBreakdownChart({
  data,
  totalMonthlySpend,
}: SpendBreakdownChartProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-white/30 uppercase tracking-wider">
            Spend Breakdown
          </p>
          <p className="text-2xl font-bold text-white mt-1">
            {formatCurrency(totalMonthlySpend)}
            <span className="text-sm font-normal text-white/40 ml-1">/mo</span>
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={0.85}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Breakdown list */}
      <div className="space-y-2 mt-4 border-t border-white/5 pt-4">
        {data.map((item) => {
          const verdict = verdictConfig(item.verdict);
          return (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-white/70">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-xs">{item.percentage}%</span>
                <span className="text-white font-medium">
                  {formatCurrency(item.value)}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded w-16 text-center"
                  style={{ color: verdict.color, background: verdict.bg }}
                >
                  {verdict.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
