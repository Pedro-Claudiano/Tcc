import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

interface Props {
  data: Record<string, unknown>[];
  classificacoes: string[];
}

const COLORS_BAR = ['#8b5cf6', '#6366f1', '#3b82f6'];
const COLORS_LINE = ['#f59e0b', '#14b8a6', '#ef4444'];

export default function ComposedChartPostos({ data, classificacoes }: Props) {
  const half = Math.ceil(classificacoes.length / 2);
  const barClasses = classificacoes.slice(0, half);
  const lineClasses = classificacoes.slice(half);

  return (
    <ResponsiveContainer width="100%" height={420}>
      <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#94a3b8', fontSize: 10 }}
          angle={-45}
          textAnchor="end"
          interval={5}
        />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 12,
            color: '#f1f5f9',
          }}
        />
        <Legend wrapperStyle={{ color: '#cbd5e1' }} />
        <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
        {barClasses.map((c, i) => (
          <Bar
            key={c}
            dataKey={c}
            fill={COLORS_BAR[i % COLORS_BAR.length]}
            maxBarSize={8}
            radius={[2, 2, 0, 0]}
            opacity={0.8}
          />
        ))}
        {lineClasses.map((c, i) => (
          <Line
            key={c}
            type="monotone"
            dataKey={c}
            stroke={COLORS_LINE[i % COLORS_LINE.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
