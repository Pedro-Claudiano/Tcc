import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ZAxis,
} from 'recharts';

interface DataPoint {
  Município: string;
  Estabelecimentos: number;
  Funcionarios: number;
}

interface Props {
  data: DataPoint[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: DataPoint }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: 12,
      padding: '10px 14px',
      color: '#f1f5f9',
      fontSize: 13,
    }}>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{d.Município}</p>
      <p>Estabelecimentos: {d.Estabelecimentos.toLocaleString('pt-BR')}</p>
      <p>Funcionários: {d.Funcionarios.toLocaleString('pt-BR')}</p>
    </div>
  );
}

export default function ScatterPlotCorrelacao({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
        <XAxis
          type="number"
          dataKey="Estabelecimentos"
          name="Estabelecimentos"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          label={{ value: 'Estabelecimentos', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
        />
        <YAxis
          type="number"
          dataKey="Funcionarios"
          name="Funcionários"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          label={{ value: 'Funcionários', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
        />
        <ZAxis range={[50, 300]} />
        <Tooltip content={<CustomTooltip />} />
        <Scatter
          data={data}
          fill="#8b5cf6"
          fillOpacity={0.7}
          stroke="#a78bfa"
          strokeWidth={1}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
