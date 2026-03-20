import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#14b8a6'];

interface Props {
  data: Record<string, unknown>[];
  municipios: string[];
}

export default function RadarChartMunicipio({ data, municipios }: Props) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#334155" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 10 }} />
        {municipios.map((m, i) => (
          <Radar
            key={m}
            name={m}
            dataKey={m}
            stroke={COLORS[i % COLORS.length]}
            fill={COLORS[i % COLORS.length]}
            fillOpacity={0.25}
          />
        ))}
        <Tooltip
          contentStyle={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 12,
            color: '#f1f5f9',
          }}
        />
        <Legend wrapperStyle={{ color: '#cbd5e1' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
