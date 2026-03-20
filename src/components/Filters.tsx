import React from 'react';

interface Props {
  municipios: string[];
  selectedMunicipio: string;
  onMunicipioChange: (v: string) => void;
  radarMunicipios: string[];
  selectedRadar: string[];
  onRadarChange: (v: string[]) => void;
}

export default function Filters({
  municipios,
  selectedMunicipio,
  onMunicipioChange,
  radarMunicipios,
  selectedRadar,
  onRadarChange,
}: Props) {
  const handleRadarToggle = (m: string) => {
    if (selectedRadar.includes(m)) {
      if (selectedRadar.length > 1) {
        onRadarChange(selectedRadar.filter(x => x !== m));
      }
    } else if (selectedRadar.length < 4) {
      onRadarChange([...selectedRadar, m]);
    }
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label className="filter-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Município (Séries Temporais)
        </label>
        <select
          className="filter-select"
          value={selectedMunicipio}
          onChange={e => onMunicipioChange(e.target.value)}
        >
          {municipios.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Comparar no Radar (máx 4)
        </label>
        <div className="radar-chips">
          {radarMunicipios.map(m => (
            <button
              key={m}
              className={`chip ${selectedRadar.includes(m) ? 'chip-active' : ''}`}
              onClick={() => handleRadarToggle(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
