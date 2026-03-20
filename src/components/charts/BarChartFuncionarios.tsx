import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#14b8a6', '#f59e0b'];

interface Props {
  data: Record<string, unknown>[];
  classificacoes: string[];
}

export default function BarChartFuncionarios({ data, classificacoes }: Props) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 100, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} horizontal={false} />
        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <YAxis
          dataKey="Município"
          type="category"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          width={95}
        />
        <Tooltip
          contentStyle={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 12,
            color: '#f1f5f9',
          }}
        />
        <Legend wrapperStyle={{ color: '#cbd5e1' }} />
        {classificacoes.map((c, i) => (
          <Bar
            key={c}
            dataKey={c}
            stackId="a"
            fill={COLORS[i % COLORS.length]}
            radius={i === classificacoes.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
