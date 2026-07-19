import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { gameApi } from '@/services/api';
import { HistoryItem } from '@/types';
import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await gameApi.getHistory();
        setHistory(response.data.history || []);
      } catch (error) {
        setHistory([
          { id: '1', action: 'Added Money', status: 'success', time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), result: '+$50,000' },
          { id: '2', action: 'Unlocked Car', status: 'success', time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), result: 'Pegassi Zentorno' },
          { id: '3', action: 'Added Coins', status: 'success', time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), result: '+5,000 Coins' },
          { id: '4', action: 'API Login', status: 'success', time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), result: '192.168.1.1' },
          { id: '5', action: 'Unlock Feature', status: 'failed', time: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), result: 'Insufficient Funds' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Activity History</h1>
        <p className="text-neutral-400">View your recent account actions and transactions.</p>
      </header>

      <Card className="p-0 overflow-hidden border-neutral-800/80">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-neutral-400 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p>Loading activity history...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900/80 border-b border-neutral-800">
                  <th className="py-4 px-6 font-medium text-neutral-400 text-sm whitespace-nowrap">Action</th>
                  <th className="py-4 px-6 font-medium text-neutral-400 text-sm whitespace-nowrap">Result/Details</th>
                  <th className="py-4 px-6 font-medium text-neutral-400 text-sm whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 font-medium text-neutral-400 text-sm text-right whitespace-nowrap">Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors"
                  >
                    <td className="py-4 px-6 text-white font-medium whitespace-nowrap">{item.action}</td>
                    <td className="py-4 px-6 text-neutral-300 whitespace-nowrap">{item.result}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {item.status === 'success' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Success
                        </span>
                      ) : item.status === 'failed' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-neutral-500 text-sm text-right whitespace-nowrap">
                      {formatDate(item.time)}
                    </td>
                  </motion.tr>
                ))}
                
                {history.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-neutral-500">
                      No activity found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
