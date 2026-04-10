import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { signal as signalApi, SignalResponse } from '../lib/api';

export default function SignalBanner() {
  const [signalData, setSignalData] = useState<SignalResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        setLoading(true);
        const data = await signalApi.check('default');
        setSignalData(data);
      } catch (error) {
        console.error('Failed to fetch signal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignal();
    const interval = setInterval(fetchSignal, 30000); // Refetch every 30s
    return () => clearInterval(interval);
  }, []);

  if (!signalData) {
    return null;
  }

  const signalClass = signalData.signal.toLowerCase();
  const IconComponent =
    signalData.signal === 'CLEAR'
      ? CheckCircle
      : signalData.signal === 'CAUTION'
        ? AlertTriangle
        : AlertCircle;

  return (
    <div className={`banner ${signalClass}`}>
      <div className="banner-icon">
        <IconComponent size={20} />
      </div>
      <div className="banner-content">
        <div className="banner-title">{signalData.signal}</div>
        <div className="banner-message">
          {signalData.reason}
          {signalData.etaToLimitMinutes && ` - ETA: ${signalData.etaToLimitMinutes}m`}
        </div>
      </div>
    </div>
  );
}
