import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Truck, X } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

interface Toast {
  id: string;
  message: string;
  type: 'resolved' | 'dispatched' | 'verified';
  icon: typeof CheckCircle;
}

export default function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const issues = useMapStore(s => s.issues);
  const previousIssuesRef = useState<Map<string, string>>(new Map())[0];

  // Poll for status changes and show toasts
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const res = await fetch(`${API_URL}/api/issues?size=50`);
        const data = await res.json();
        if (!data?.content) return;

        for (const issue of data.content) {
          const prevStatus = previousIssuesRef.get(issue.id);
          if (prevStatus && prevStatus !== issue.status) {
            // Status changed! Show toast
            const typeLabel = issue.type?.replace('_', ' ') || 'Issue';
            let toast: Toast | null = null;

            if (issue.status === 'dispatched') {
              toast = {
                id: `${issue.id}-${Date.now()}`,
                message: `A repair team has been dispatched for the ${typeLabel} you reported nearby.`,
                type: 'dispatched',
                icon: Truck,
              };
            } else if (issue.status === 'resolved') {
              toast = {
                id: `${issue.id}-${Date.now()}`,
                message: `The ${typeLabel} near you has been resolved. Thank you for reporting!`,
                type: 'resolved',
                icon: CheckCircle,
              };
            } else if (issue.status === 'verified') {
              toast = {
                id: `${issue.id}-${Date.now()}`,
                message: `The ${typeLabel} you reported has been community verified.`,
                type: 'verified',
                icon: AlertTriangle,
              };
            }

            if (toast) {
              setToasts(prev => [...prev, toast!]);
              // Auto-dismiss after 5 seconds
              setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast!.id));
              }, 5000);
            }
          }
          previousIssuesRef.set(issue.id, issue.status);
        }
      } catch {
        // Backend offline, silently skip
      }
    }, 6000);

    // Seed the initial statuses on first load
    (async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const res = await fetch(`${API_URL}/api/issues?size=50`);
        const data = await res.json();
        if (data?.content) {
          for (const issue of data.content) {
            previousIssuesRef.set(issue.id, issue.status);
          }
        }
      } catch { /* noop */ }
    })();

    return () => clearInterval(interval);
  }, []);

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  const colors = {
    resolved: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-500' },
    dispatched: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' },
    verified: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-500' },
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((toast) => {
        const c = colors[toast.type];
        const Icon = toast.icon;
        return (
          <div
            key={toast.id}
            className={`${c.bg} ${c.border} border rounded-2xl shadow-lg px-4 py-3 flex items-start gap-3 w-full max-w-md pointer-events-auto animate-slide-down`}
          >
            <Icon size={22} className={`${c.icon} shrink-0 mt-0.5`} />
            <p className={`${c.text} text-[13px] font-medium leading-snug flex-1`}>{toast.message}</p>
            <button onClick={() => dismiss(toast.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
