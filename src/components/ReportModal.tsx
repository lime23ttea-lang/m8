import { useState } from 'react';
import { Flag, X, Send } from 'lucide-react';
import { addReport, getBlocklist, addToBlocklist } from '../services/storage';

const REPORT_REASONS = [
  'Inappropriate content',
  'Dangerous content',
  'Sexual content',
  'Violence',
  'Spam',
  'Misleading information',
  'Other',
];

interface ReportModalProps {
  videoId: string;
  onClose: () => void;
}

export default function ReportModal({ videoId, onClose }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) return;

    // Add report
    addReport({
      videoId,
      reason: selectedReason,
      createdAt: new Date().toISOString(),
      status: 'REPORTED',
    });

    // Check if enough reports to flag (threshold: 3 for local demo)
    const reports = JSON.parse(localStorage.getItem('vibetube_reports') || '[]');
    const count = reports.filter((r: any) => r.videoId === videoId).length;

    if (count >= 3) {
      // Auto-flag for review
      const blocklist = getBlocklist();
      if (!blocklist.some(v => v.videoId === videoId)) {
        addToBlocklist({
          videoId,
          reason: `Auto-flagged: ${count} reports`,
          status: 'UNDER_REVIEW',
          createdAt: new Date().toISOString(),
        });
      }
    }

    setSubmitted(true);
    setTimeout(onClose, 1500);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-vt-surface border border-vt-border rounded-2xl p-6 max-w-sm w-full text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-vt-success/20 flex items-center justify-center mx-auto mb-3">
            <Send size={20} className="text-vt-success" />
          </div>
          <h3 className="font-semibold text-vt-text">Report Submitted</h3>
          <p className="text-sm text-vt-text-muted mt-1">
            Thank you. Your report will be reviewed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-vt-surface border border-vt-border rounded-2xl p-6 max-w-md w-full animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-vt-text flex items-center gap-2">
            <Flag size={18} className="text-vt-danger" />
            Report Video
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-vt-surface-2 rounded-lg transition-colors">
            <X size={18} className="text-vt-text-muted" />
          </button>
        </div>

        <p className="text-sm text-vt-text-muted mb-4">
          Video ID: <code className="text-vt-accent-light">{videoId}</code>
        </p>

        <div className="space-y-2 mb-5">
          {REPORT_REASONS.map(reason => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedReason === reason
                  ? 'bg-vt-accent/15 text-vt-accent-light border border-vt-accent/30'
                  : 'bg-vt-surface-2 text-vt-text-muted hover:text-vt-text hover:bg-vt-border'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedReason}
          className="w-full py-2.5 bg-vt-danger/90 hover:bg-vt-danger disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Flag size={14} />
          Submit Report
        </button>
      </div>
    </div>
  );
}
