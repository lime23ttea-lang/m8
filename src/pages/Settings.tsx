import { useState } from 'react';
import { Settings as SettingsIcon, Shield, GraduationCap, Database, Eye, Trash2, Server } from 'lucide-react';
import FilterSelector from '../components/FilterSelector';
import { getSettings, saveSettings, isHistoryEnabled, setHistoryEnabled, clearHistory, getBlocklist, getReports } from '../services/storage';
import type { ServerStatus } from '../types';

const SERVERS: ServerStatus[] = [
  { id: 'server-a', name: 'Server A', status: 'online', latency: 42 },
  { id: 'server-b', name: 'Server B', status: 'online', latency: 67 },
  { id: 'server-c', name: 'Server C', status: 'maintenance' },
];

export default function SettingsPage() {
  const [settings, setSettingsState] = useState(getSettings());
  const [historyEnabled, setHistoryEnabledState] = useState(isHistoryEnabled());

  const toggleHistory = () => {
    const newValue = !historyEnabled;
    setHistoryEnabledState(newValue);
    setHistoryEnabled(newValue);
  };

  const handleClearHistory = () => {
    if (confirm('Clear all watch history?')) {
      clearHistory();
    }
  };

  const handleServerChange = (serverId: string) => {
    const newSettings = { ...settings, activeServer: serverId };
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  const blocklistCount = getBlocklist().length;
  const reportsCount = getReports().length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-vt-text flex items-center gap-2 mb-6">
        <SettingsIcon size={20} className="text-vt-accent-light" />
        Settings
      </h1>

      {/* Filter Mode */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-vt-text mb-3 flex items-center gap-2">
          <Shield size={14} className="text-vt-accent-light" />
          Content Filtering
        </h2>
        <FilterSelector />
      </section>

      {/* Education Mode */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-vt-text mb-3 flex items-center gap-2">
          <GraduationCap size={14} className="text-vt-accent-light" />
          Education Mode
        </h2>
        <div className="p-4 bg-vt-surface rounded-xl border border-vt-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-vt-text font-medium">Education Mode</p>
              <p className="text-xs text-vt-text-muted mt-0.5">
                Strict filtering, no comments, no recommendations, minimal interface.
              </p>
            </div>
            <button
              onClick={() => {
                const newSettings = { ...settings, educationMode: !settings.educationMode };
                setSettingsState(newSettings);
                saveSettings(newSettings);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.educationMode ? 'bg-vt-success' : 'bg-vt-border'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                settings.educationMode ? 'left-[22px]' : 'left-[2px]'
              }`} />
            </button>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-vt-text mb-3 flex items-center gap-2">
          <Eye size={14} className="text-vt-accent-light" />
          History & Privacy
        </h2>
        <div className="space-y-3">
          <div className="p-4 bg-vt-surface rounded-xl border border-vt-border flex items-center justify-between">
            <div>
              <p className="text-sm text-vt-text font-medium">Watch History</p>
              <p className="text-xs text-vt-text-muted mt-0.5">
                Save your watch history locally.
              </p>
            </div>
            <button
              onClick={toggleHistory}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                historyEnabled ? 'bg-vt-accent' : 'bg-vt-border'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                historyEnabled ? 'left-[22px]' : 'left-[2px]'
              }`} />
            </button>
          </div>
          <button
            onClick={handleClearHistory}
            className="w-full p-3 bg-vt-danger/10 hover:bg-vt-danger/20 text-vt-danger rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            Clear Watch History
          </button>
        </div>
      </section>

      {/* Server Selection */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-vt-text mb-3 flex items-center gap-2">
          <Server size={14} className="text-vt-accent-light" />
          Server Selection
        </h2>
        <div className="space-y-2">
          {SERVERS.map(server => (
            <button
              key={server.id}
              onClick={() => server.status === 'online' && handleServerChange(server.id)}
              disabled={server.status !== 'online'}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                settings.activeServer === server.id
                  ? 'bg-vt-accent/10 border-vt-accent/30'
                  : server.status === 'online'
                    ? 'bg-vt-surface border-vt-border hover:bg-vt-surface-2'
                    : 'bg-vt-surface/50 border-vt-border/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  server.status === 'online' ? 'bg-vt-success' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-sm text-vt-text font-medium">{server.name}</p>
                  <p className="text-xs text-vt-text-muted">
                    {server.status === 'online' ? `Online — ${server.latency}ms` : 'Maintenance'}
                  </p>
                </div>
              </div>
              {settings.activeServer === server.id && (
                <span className="text-xs text-vt-accent-light font-medium">Active</span>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-vt-text-muted mt-2">
          Server selection is used for load balancing, redundancy, and availability.
        </p>
      </section>

      {/* Stats */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-vt-text mb-3 flex items-center gap-2">
          <Database size={14} className="text-vt-accent-light" />
          Local Data
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-vt-surface rounded-xl border border-vt-border text-center">
            <p className="text-lg font-semibold text-vt-text">{blocklistCount}</p>
            <p className="text-xs text-vt-text-muted">Blocked Videos</p>
          </div>
          <div className="p-3 bg-vt-surface rounded-xl border border-vt-border text-center">
            <p className="text-lg font-semibold text-vt-text">{reportsCount}</p>
            <p className="text-xs text-vt-text-muted">Reports Filed</p>
          </div>
        </div>
      </section>

      {/* Version */}
      <div className="text-center py-4">
        <p className="text-xs text-vt-text-muted">VibeTube V1 • Build 2024</p>
      </div>
    </div>
  );
}
