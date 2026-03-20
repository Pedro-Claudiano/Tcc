import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS: Record<string, string> = {
  'Alimentação': '#8b5cf6',
  'Comércio e Serviços': '#6366f1',
  'Entretenimento': '#3b82f6',
  'Hospedagem': '#06b6d4',
  'Transportes': '#14b8a6',
  'Agência e Operadores': '#f59e0b',
};

interface DataItem {
  name: string;
  size: number;
  className: string;
}

interface Props {
  data: DataItem[];
}

interface ContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  className: string;
}

function CustomContent({ x, y, width, height, name, className }: ContentProps) {
  if (width < 40 || height < 25) return null;
  const fill = COLORS[className] || '#64748b';
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#0f172a" strokeWidth={2} rx={4} opacity={0.85} />
      {width > 60 && height > 30 && (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={9} fontWeight={600}>
          {name.length > 20 ? name.slice(0, 18) + '…' : name}
        </text>
      )}
    </g>
  );
}

export default function TreemapEstabelecimentos({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <Treemap
        data={data}
        dataKey="size"
        nameKey="name"
        aspectRatio={4 / 3}
        content={<CustomContent x={0} y={0} width={0} height={0} name="" className="" />}
      >
        <Tooltip
          contentStyle={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 12,
            color: '#f1f5f9',
          }}
          formatter={(value: number) => value.toLocaleString('pt-BR')}
        />
      </Treemap>
    </ResponsiveContainer>
  );
}
