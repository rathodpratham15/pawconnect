import React, { useState, useEffect } from 'react';

const NetworkStatusHandler: React.FC = () => {
  const [connectionType, setConnectionType] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    if ('connection' in navigator) {
      const nav = navigator as Navigator & {
        connection?: { effectiveType?: string };
        mozConnection?: { effectiveType?: string };
        webkitConnection?: { effectiveType?: string };
      };
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      setConnectionType(connection?.effectiveType ?? '');

      const updateNetworkStatus = () => {
        setIsOnline(navigator.onLine);
      };

      window.addEventListener('online', updateNetworkStatus);
      window.addEventListener('offline', updateNetworkStatus);

      return () => {
        window.removeEventListener('online', updateNetworkStatus);
        window.removeEventListener('offline', updateNetworkStatus);
      };
    }
  }, []);

  return (
    <div>
      <h3>Network Information API</h3>
      <p>Connection Type: {connectionType || 'Unknown'}</p>
      <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
    </div>
  );
};

export default NetworkStatusHandler;
