import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Button, Box } from '@mui/material';

interface PWAUpdatePromptProps {
  registration?: ServiceWorkerRegistration | null;
}

export const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({ registration }) => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [newWorker, setNewWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!registration) return;

    const handleUpdateFound = () => {
      const installing = registration.installing;
      if (installing) {
        setNewWorker(installing);
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            setShowUpdate(true);
          }
        });
      }
    };

    registration.addEventListener('updatefound', handleUpdateFound);

    return () => {
      registration.removeEventListener('updatefound', handleUpdateFound);
    };
  }, [registration]);

  const handleUpdate = () => {
    if (newWorker) {
      newWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdate(false);
      window.location.reload();
    }
  };

  const handleLater = () => {
    setShowUpdate(false);
  };

  return (
    <Snackbar
      open={showUpdate}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ mb: 8 }} // 하단 네비게이션 위에 표시
    >
      <Alert
        severity="info"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" size="small" onClick={handleLater}>
              나중에
            </Button>
            <Button color="inherit" size="small" onClick={handleUpdate}>
              업데이트
            </Button>
          </Box>
        }
      >
        새 버전이 사용 가능합니다!
      </Alert>
    </Snackbar>
  );
};
