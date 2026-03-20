import {
  FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer, Cell,
} from 'recharts';

interface DataItem {
  name: string;
  value: number;
  fill: string;
}

interface Props {
  data: DataItem[];
}

export default function FunnelChartSetores({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <FunnelChart>
        <Tooltip
          contentStyle={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 12,
            color: '#f1f5f9',
          }}
          formatter={(value: number) => value.toLocaleString('pt-BR')}
        />
        <Funnel dataKey="value" data={data} isAnimationActive>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} stroke="#0f172a" strokeWidth={2} />
          ))}
          <LabelList
            position="right"
            fill="#cbd5e1"
            stroke="none"
            dataKey="name"
            fontSize={12}
            fontWeight={600}
          />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}
