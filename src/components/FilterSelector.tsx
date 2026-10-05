import { Shield, GraduationCap, Globe, Lock } from 'lucide-react';
import { getSettings, saveSettings } from '../services/storage';
import { useState } from 'react';

const FILTER_MODES = [
  { id: 'GENERAL' as const, label: 'General', icon: Globe, description: 'Standard filtering' },
  { id: 'SAFE' as const, label: 'Safe', icon: Shield, description: 'Moderate filtering' },
  { id: 'EDUCATIONAL' as const, label: 'Educational', icon: GraduationCap, description: 'Education-focused' },
  { id: 'STRICT' as const, label: 'Strict', icon: Lock, description: 'Maximum filtering' },
];

export default function FilterSelector() {
  const [settings, setSettings] = useState(getSettings());

  const handleModeChange = (mode: typeof settings.filterMode) => {
    const newSettings = { ...settings, filterMode: mode };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const toggleEducation = () => {
    const newSettings = {
      ...settings,
      educationMode: !settings.educationMode,
      filterMode: settings.educationMode ? settings.filterMode : 'STRICT' as const,
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTER_MODES.map(mode => (
        <button
          key={mode.id}
          onClick={() => handleModeChange(mode.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            settings.filterMode === mode.id
              ? 'bg-vt-accent text-white shadow-lg shadow-vt-accent/20'
              : 'bg-vt-surface-2 text-vt-text-muted hover:text-vt-text hover:bg-vt-border'
          }`}
          title={mode.description}
        >
          <mode.icon size={13} />
          {mode.label}
        </button>
      ))}

      <div className="w-px h-6 bg-vt-border mx-1 hidden sm:block" />

      <button
        onClick={toggleEducation}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
          settings.educationMode
            ? 'bg-vt-success/20 text-vt-success border border-vt-success/30'
            : 'bg-vt-surface-2 text-vt-text-muted hover:text-vt-text hover:bg-vt-border'
        }`}
      >
        <GraduationCap size={13} />
        Education Mode
      </button>
    </div>
  );
}
