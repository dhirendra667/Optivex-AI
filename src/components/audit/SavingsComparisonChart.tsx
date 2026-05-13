"use client";

// ─── components/audit/SavingsComparisonChart.tsx ───────────────────────────

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { formatCurrency } from "@/lib/utils/helpers";

interface SavingsComparisonChartProps {
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlyPotentialSavings: number;
  annualPotentialSavings: number;
  savingsPercentage: number;
}

interface TooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card rounded-xl p-3 border border-white/8 shadow-xl">
      <p className="text-xs text-white/50 mb-1">
        {label}
      </p>

      <p className="text-sm font-bold text-white">
        {formatCurrency(payload[0].value)}/mo
      </p>
    </div>
  );
};

export function SavingsComparisonChart({
  currentMonthlySpend,
  optimizedMonthlySpend,
  monthlyPotentialSavings,
  annualPotentialSavings,
  savingsPercentage,
}: SavingsComparisonChartProps) {
  const data = [
    {
      name: "Current",
      value: currentMonthlySpend,
      color: "#EF4444",
    },
    {
      name: "Optimized",
      value: optimizedMonthlySpend,
      color: "#22C55E",
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">
        Savings Potential
      </p>

      {/* Key metric */}
      <div className="flex items-end gap-2 mb-6">
        <span className="text-4xl font-bold text-teal-400">
          {formatCurrency(monthlyPotentialSavings)}
        </span>

        <span className="text-white/40 text-sm mb-1">
          /month
        </span>

        <span className="ml-2 text-sm font-medium text-teal-400/70 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-lg mb-1">
          -{savingsPercentage}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={48}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "rgba(255,255,255,0.4)",
              fontSize: 12,
            }}
          />

          <YAxis hide />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />

          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Annual callout */}
      <div className="mt-4 p-4 rounded-xl bg-teal-500/8 border border-teal-500/15 flex items-center justify-between">
        <div>
          <p className="text-xs text-teal-400/70 mb-0.5">
            Annual Savings
          </p>

          <p className="text-xl font-bold text-teal-300">
            {formatCurrency(annualPotentialSavings)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-white/30 mb-0.5">
            Optimized Monthly
          </p>

          <p className="text-lg font-semibold text-white">
            {formatCurrency(optimizedMonthlySpend)}
          </p>
        </div>
      </div>
    </div>
  );
}


// "use client";

// // ─── components/audit/SavingsComparisonChart.tsx ───────────────────────────

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";
// import { formatCurrency } from "@/lib/utils/helpers";

// interface SavingsComparisonChartProps {
//   currentMonthlySpend: number;
//   optimizedMonthlySpend: number;
//   monthlyPotentialSavings: number;
//   annualPotentialSavings: number;
//   savingsPercentage: number;
// }

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="glass-card rounded-xl p-3 border border-white/8 shadow-xl">
//       <p className="text-xs text-white/50 mb-1">{label}</p>
//       <p className="text-sm font-bold text-white">{formatCurrency(payload[0].value)}/mo</p>
//     </div>
//   );
// };

// export function SavingsComparisonChart({
//   currentMonthlySpend,
//   optimizedMonthlySpend,
//   monthlyPotentialSavings,
//   annualPotentialSavings,
//   savingsPercentage,
// }: SavingsComparisonChartProps) {
//   const data = [
//     { name: "Current", value: currentMonthlySpend, color: "#EF4444" },
//     { name: "Optimized", value: optimizedMonthlySpend, color: "#22C55E" },
//   ];

//   return (
//     <div className="glass-card rounded-2xl p-6">
//       <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">
//         Savings Potential
//       </p>

//       {/* Key metric */}
//       <div className="flex items-end gap-2 mb-6">
//         <span className="text-4xl font-bold text-teal-400">
//           {formatCurrency(monthlyPotentialSavings)}
//         </span>
//         <span className="text-white/40 text-sm mb-1">/month</span>
//         <span className="ml-2 text-sm font-medium text-teal-400/70 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-lg mb-1">
//           -{savingsPercentage}%
//         </span>
//       </div>

//       <ResponsiveContainer width="100%" height={160}>
//         <BarChart data={data} barSize={48}>
//           <XAxis
//             dataKey="name"
//             axisLine={false}
//             tickLine={false}
//             tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
//           />
//           <YAxis hide />
//           <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
//           <Bar dataKey="value" radius={[8, 8, 0, 0]}>
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>

//       {/* Annual callout */}
//       <div className="mt-4 p-4 rounded-xl bg-teal-500/8 border border-teal-500/15 flex items-center justify-between">
//         <div>
//           <p className="text-xs text-teal-400/70 mb-0.5">Annual Savings</p>
//           <p className="text-xl font-bold text-teal-300">
//             {formatCurrency(annualPotentialSavings)}
//           </p>
//         </div>
//         <div className="text-right">
//           <p className="text-xs text-white/30 mb-0.5">Optimized Monthly</p>
//           <p className="text-lg font-semibold text-white">
//             {formatCurrency(optimizedMonthlySpend)}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }