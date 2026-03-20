import React, { useEffect, useState, useMemo } from 'react';
import {
  loadEstabelecimentos, loadFuncionarios, loadEstoque, loadPostos,
  getMunicipios, getClassificacoes, sumByClassificacao,
  topMunicipiosByTotal, pivotByMunicipio, pivotFuncionarios,
  topMunicipiosByFuncionarios, buildTimeSeries, buildPostosSeries,
  buildRadarData, buildTreemapData, buildScatterData, buildFunnelData,
} from './utils/csvParser';
import type { EstabelecimentoRow, FuncionarioRow, EstoqueRow, PostoRow } from './utils/csvParser';

import Filters from './components/Filters';
import BarChartEstabelecimentos from './components/charts/BarChartEstabelecimentos';
import PieChartClassificacao from './components/charts/PieChartClassificacao';
import LineChartEstoque from './components/charts/LineChartEstoque';
import AreaChartEstoque from './components/charts/AreaChartEstoque';
import RadarChartMunicipio from './components/charts/RadarChartMunicipio';
import TreemapEstabelecimentos from './components/charts/TreemapEstabelecimentos';
import BarChartFuncionarios from './components/charts/BarChartFuncionarios';
import ComposedChartPostos from './components/charts/ComposedChartPostos';
import ScatterPlotCorrelacao from './components/charts/ScatterPlotCorrelacao';
import FunnelChartSetores from './components/charts/FunnelChartSetores';

function KpiCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="kpi-card">
      <span className="kpi-icon">{icon}</span>
      <div>
        <p className="kpi-value">{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}</p>
        <p className="kpi-label">{label}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, id }: { title: string; subtitle?: string; children: React.ReactNode; id?: string }) {
  return (
    <section className="chart-card" id={id}>
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      </div>
      <div className="chart-body">
        {children}
      </div>
    </section>
  );
}

export default function App() {
  const [estab, setEstab] = useState<EstabelecimentoRow[]>([]);
  const [func, setFunc] = useState<FuncionarioRow[]>([]);
  const [estoque, setEstoque] = useState<EstoqueRow[]>([]);
  const [postos, setPostos] = useState<PostoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMunicipio, setSelectedMunicipio] = useState('Poços de Caldas');
  const [selectedRadar, setSelectedRadar] = useState<string[]>(['Poços de Caldas', 'Pouso Alegre']);

  useEffect(() => {
    Promise.all([loadEstabelecimentos(), loadFuncionarios(), loadEstoque(), loadPostos()])
      .then(([e, f, es, p]) => {
        setEstab(e);
        setFunc(f);
        setEstoque(es);
        setPostos(p);
        setLoading(false);
      });
  }, []);

  const municipios = useMemo(() => getMunicipios(estab), [estab]);
  const classificacoes = useMemo(() => getClassificacoes(estab), [estab]);
  const top15 = useMemo(() => topMunicipiosByTotal(estab, 15), [estab]);
  const top10func = useMemo(() => topMunicipiosByFuncionarios(func, 12), [func]);
  const radarTop = useMemo(() => topMunicipiosByTotal(estab, 10), [estab]);

  // KPIs
  const totalEstab = useMemo(() => estab.reduce((s, d) => s + d.Estabelecimentos, 0), [estab]);
  const totalFunc = useMemo(() => func.reduce((s, d) => s + d.Funcionarios, 0), [func]);
  const totalMunicipios = municipios.length;

  // Chart data
  const barData = useMemo(() => pivotByMunicipio(estab, top15), [estab, top15]);
  const pieData = useMemo(() => sumByClassificacao(estab), [estab]);
  const lineSeries = useMemo(() => buildTimeSeries(estoque, selectedMunicipio), [estoque, selectedMunicipio]);
  const areaSeries = useMemo(() => buildTimeSeries(estoque, selectedMunicipio), [estoque, selectedMunicipio]);
  const radarData = useMemo(() => buildRadarData(estab, selectedRadar), [estab, selectedRadar]);
  const treemapData = useMemo(() => buildTreemapData(estab), [estab]);
  const funcBarData = useMemo(() => pivotFuncionarios(func, top10func), [func, top10func]);
  const postosSeries = useMemo(() => buildPostosSeries(postos, selectedMunicipio), [postos, selectedMunicipio]);
  const scatterData = useMemo(() => buildScatterData(estab, func), [estab, func]);
  const funnelData = useMemo(() => buildFunnelData(estab), [estab]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Carregando dados do observatório...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* ─── HEADER ─── */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="header-title">
              <span className="header-icon">📊</span>
              Observatório de Turismo
            </h1>
            <p className="header-subtitle">
              Dashboard interativo — Região Sul de Minas Gerais
            </p>
          </div>
          <div className="header-badge">
            <span className="badge">Dados Atualizados • 2021–2025</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* ─── KPI ROW ─── */}
        <div className="kpi-row">
          <KpiCard icon="🏢" label="Total de Estabelecimentos" value={totalEstab} />
          <KpiCard icon="👥" label="Total de Funcionários" value={totalFunc} />
          <KpiCard icon="🗺️" label="Municípios Analisados" value={totalMunicipios} />
          <KpiCard icon="📈" label="Classificações" value={classificacoes.length} />
        </div>

        {/* ─── FILTERS ─── */}
        <Filters
          municipios={municipios}
          selectedMunicipio={selectedMunicipio}
          onMunicipioChange={setSelectedMunicipio}
          radarMunicipios={radarTop}
          selectedRadar={selectedRadar}
          onRadarChange={setSelectedRadar}
        />

        {/* ─── SECTION: VISÃO GERAL ─── */}
        <div className="section-header">
          <h2 className="section-title">Visão Geral dos Estabelecimentos</h2>
          <p className="section-subtitle">Panorama completo do setor turístico regional</p>
        </div>

        <div className="charts-grid charts-grid-2">
          <ChartCard
            title="Estabelecimentos por Município"
            subtitle="Top 15 municípios — barras agrupadas por classificação"
            id="bar-estab"
          >
            <BarChartEstabelecimentos data={barData} classificacoes={classificacoes} />
          </ChartCard>

          <ChartCard
            title="Distribuição por Classificação"
            subtitle="Proporção de cada setor turístico na região"
            id="pie-class"
          >
            <PieChartClassificacao data={pieData} />
          </ChartCard>
        </div>

        <div className="charts-grid charts-grid-2">
          <ChartCard
            title="Treemap de Estabelecimentos"
            subtitle="Visualização proporcional — cada bloco representa um município/setor"
            id="treemap"
          >
            <TreemapEstabelecimentos data={treemapData} />
          </ChartCard>

          <ChartCard
            title="Funil dos Setores Turísticos"
            subtitle="Hierarquia de concentração por classificação"
            id="funnel"
          >
            <FunnelChartSetores data={funnelData} />
          </ChartCard>
        </div>

        {/* ─── SECTION: EVOLUÇÃO TEMPORAL ─── */}
        <div className="section-header">
          <h2 className="section-title">Evolução Temporal — {selectedMunicipio}</h2>
          <p className="section-subtitle">Estoque acumulado e saldo de postos de trabalho ao longo do tempo</p>
        </div>

        <div className="charts-grid charts-grid-2">
          <ChartCard
            title="Estoque Acumulado (Linha)"
            subtitle={`Evolução mensal por classificação — ${selectedMunicipio}`}
            id="line-estoque"
          >
            <LineChartEstoque data={lineSeries} classificacoes={classificacoes} />
          </ChartCard>

          <ChartCard
            title="Estoque Acumulado (Área Empilhada)"
            subtitle={`Composição do estoque ao longo do tempo — ${selectedMunicipio}`}
            id="area-estoque"
          >
            <AreaChartEstoque data={areaSeries} classificacoes={classificacoes} />
          </ChartCard>
        </div>

        <div className="charts-grid charts-grid-1">
          <ChartCard
            title="Saldo de Postos de Trabalho"
            subtitle={`Gráfico composto — barras + linhas — ${selectedMunicipio}`}
            id="composed-postos"
          >
            <ComposedChartPostos data={postosSeries} classificacoes={classificacoes} />
          </ChartCard>
        </div>

        {/* ─── SECTION: EMPREGO E CORRELAÇÕES ─── */}
        <div className="section-header">
          <h2 className="section-title">Emprego e Correlações</h2>
          <p className="section-subtitle">Análise de funcionários e relação com infraestrutura</p>
        </div>

        <div className="charts-grid charts-grid-2">
          <ChartCard
            title="Funcionários por Município"
            subtitle="Top 12 — barras horizontais empilhadas por classificação"
            id="bar-func"
          >
            <BarChartFuncionarios data={funcBarData} classificacoes={classificacoes} />
          </ChartCard>

          <ChartCard
            title="Correlação: Estabelecimentos × Funcionários"
            subtitle="Cada ponto é um município — quanto mais à direita, mais estabelecimentos"
            id="scatter"
          >
            <ScatterPlotCorrelacao data={scatterData} />
          </ChartCard>
        </div>

        {/* ─── SECTION: COMPARAÇÃO ─── */}
        <div className="section-header">
          <h2 className="section-title">Comparação entre Municípios</h2>
          <p className="section-subtitle">Selecione até 4 municípios para comparar no radar</p>
        </div>

        <div className="charts-grid charts-grid-1">
          <ChartCard
            title="Radar Comparativo"
            subtitle={`Comparando: ${selectedRadar.join(', ')}`}
            id="radar"
          >
            <RadarChartMunicipio data={radarData} municipios={selectedRadar} />
          </ChartCard>
        </div>

        {/* ─── FOOTER ─── */}
        <footer className="app-footer">
          <p>Observatório de Turismo — TCC © 2026 · Dados: CAGED / Ministério do Trabalho</p>
        </footer>
      </main>
    </div>
  );
}