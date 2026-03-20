import Papa from 'papaparse';

// ===================== TYPES =====================
export interface EstabelecimentoRow {
  Município: string;
  Classificação: string;
  Estabelecimentos: number;
}

export interface FuncionarioRow {
  Município: string;
  Classificação: string;
  Funcionarios: number;
}

export interface EstoqueRow {
  Município: string;
  Classificação: string;
  Ano: number;
  Mês: number;
  Estoque: number;
}

export interface PostoRow {
  Município: string;
  Classificação: string;
  Ano: number;
  Mês: number;
  Saldo: number;
}

// ===================== FETCH + PARSE =====================
async function fetchCSV<T>(path: string): Promise<T[]> {
  const res = await fetch(path);
  const text = await res.text();
  const result = Papa.parse<T>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    transformHeader: (h: string) => h.trim(),
  });
  return result.data;
}

export const loadEstabelecimentos = () => fetchCSV<EstabelecimentoRow>('/data/estabelecimentos.csv');
export const loadFuncionarios = () => fetchCSV<FuncionarioRow>('/data/funcionarios.csv');
export const loadEstoque = () => fetchCSV<EstoqueRow>('/data/estoque_acumulado.csv');
export const loadPostos = () => fetchCSV<PostoRow>('/data/postos.csv');

// ===================== AGGREGATION HELPERS =====================

/** Get all unique municipalities */
export function getMunicipios(data: { Município: string }[]): string[] {
  return [...new Set(data.map(d => d.Município))].sort();
}

/** Get all unique classifications */
export function getClassificacoes(data: { Classificação: string }[]): string[] {
  return [...new Set(data.map(d => d.Classificação))].sort();
}

/** Sum by classification across all municipalities */
export function sumByClassificacao(data: EstabelecimentoRow[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  data.forEach(d => {
    map.set(d.Classificação, (map.get(d.Classificação) || 0) + d.Estabelecimentos);
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/** Top N municipalities by total estabelecimentos */
export function topMunicipiosByTotal(data: EstabelecimentoRow[], n: number): string[] {
  const map = new Map<string, number>();
  data.forEach(d => {
    map.set(d.Município, (map.get(d.Município) || 0) + d.Estabelecimentos);
  });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name]) => name);
}

/** Pivot data for grouped bar chart: [{Município, Alimentação, Hospedagem, ...}] */
export function pivotByMunicipio(data: EstabelecimentoRow[], municipios: string[]): Record<string, unknown>[] {
  const mSet = new Set(municipios);
  const map = new Map<string, Record<string, unknown>>();
  data.filter(d => mSet.has(d.Município)).forEach(d => {
    if (!map.has(d.Município)) {
      map.set(d.Município, { Município: d.Município });
    }
    map.get(d.Município)![d.Classificação] = d.Estabelecimentos;
  });
  return Array.from(map.values());
}

/** Pivot funcionarios for horizontal bar */
export function pivotFuncionarios(data: FuncionarioRow[], municipios: string[]): Record<string, unknown>[] {
  const mSet = new Set(municipios);
  const map = new Map<string, Record<string, unknown>>();
  data.filter(d => mSet.has(d.Município)).forEach(d => {
    if (!map.has(d.Município)) {
      map.set(d.Município, { Município: d.Município });
    }
    map.get(d.Município)![d.Classificação] = d.Funcionarios;
  });
  return Array.from(map.values());
}

/** Top N municipalities by total funcionarios */
export function topMunicipiosByFuncionarios(data: FuncionarioRow[], n: number): string[] {
  const map = new Map<string, number>();
  data.forEach(d => {
    map.set(d.Município, (map.get(d.Município) || 0) + d.Funcionarios);
  });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name]) => name);
}

/** Build time series for estoque: [{date, Alimentação, Hospedagem, ...}] */
export function buildTimeSeries(
  data: EstoqueRow[],
  municipio: string
): Record<string, unknown>[] {
  const filtered = data.filter(d => d.Município === municipio);
  const map = new Map<string, Record<string, unknown>>();
  filtered.forEach(d => {
    const key = `${d.Ano}-${String(d.Mês).padStart(2, '0')}`;
    if (!map.has(key)) {
      map.set(key, { date: key });
    }
    map.get(key)![d.Classificação] = d.Estoque;
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);
}

/** Build time series for postos saldo */
export function buildPostosSeries(
  data: PostoRow[],
  municipio: string
): Record<string, unknown>[] {
  const filtered = data.filter(d => d.Município === municipio);
  const map = new Map<string, Record<string, unknown>>();
  filtered.forEach(d => {
    const key = `${d.Ano}-${String(d.Mês).padStart(2, '0')}`;
    if (!map.has(key)) {
      map.set(key, { date: key });
    }
    map.get(key)![d.Classificação] = d.Saldo;
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);
}

/** Build radar data for a set of municipalities */
export function buildRadarData(
  data: EstabelecimentoRow[],
  municipios: string[]
): Record<string, unknown>[] {
  const classificacoes = getClassificacoes(data);
  return classificacoes.map(c => {
    const entry: Record<string, unknown> = { subject: c };
    municipios.forEach(m => {
      const row = data.find(d => d.Município === m && d.Classificação === c);
      entry[m] = row ? row.Estabelecimentos : 0;
    });
    return entry;
  });
}

/** Build treemap data */
export function buildTreemapData(data: EstabelecimentoRow[]): { name: string; size: number; className: string }[] {
  return data
    .map(d => ({ name: `${d.Município} - ${d.Classificação}`, size: d.Estabelecimentos, className: d.Classificação }))
    .filter(d => d.size > 50)
    .sort((a, b) => b.size - a.size)
    .slice(0, 60);
}

/** Build scatter data correlating estabelecimentos × funcionarios */
export function buildScatterData(
  estab: EstabelecimentoRow[],
  func: FuncionarioRow[]
): { Município: string; Estabelecimentos: number; Funcionarios: number }[] {
  const estabMap = new Map<string, number>();
  estab.forEach(d => {
    estabMap.set(d.Município, (estabMap.get(d.Município) || 0) + d.Estabelecimentos);
  });
  const funcMap = new Map<string, number>();
  func.forEach(d => {
    funcMap.set(d.Município, (funcMap.get(d.Município) || 0) + d.Funcionarios);
  });
  const result: { Município: string; Estabelecimentos: number; Funcionarios: number }[] = [];
  estabMap.forEach((val, key) => {
    result.push({
      Município: key,
      Estabelecimentos: val,
      Funcionarios: funcMap.get(key) || 0,
    });
  });
  return result.sort((a, b) => b.Estabelecimentos - a.Estabelecimentos);
}

/** Build funnel data */
export function buildFunnelData(data: EstabelecimentoRow[]): { name: string; value: number; fill: string }[] {
  const colors = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#14b8a6', '#22c55e'];
  return sumByClassificacao(data).map((d, i) => ({
    name: d.name,
    value: d.value,
    fill: colors[i % colors.length],
  }));
}

/** Get unique years from time series data */
export function getYears(data: { Ano: number }[]): number[] {
  return [...new Set(data.map(d => d.Ano))].sort();
}
