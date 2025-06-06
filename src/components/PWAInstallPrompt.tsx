import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showIOSInstruction, setShowIOSInstruction] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      // Chrome에서 기본 설치 배너를 숨김
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // iOS Safari에서 PWA 설치 가능 여부 확인
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && !isInStandaloneMode) {
      setShowIOSInstruction(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleIOSInstructionClose = () => {
    setShowIOSInstruction(false);
  };

  if (!showInstallButton && !showIOSInstruction) {
    return null;
  }

  return (
    <>
      {/* Android/Chrome PWA 설치 버튼 */}
      {showInstallButton && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<InstallMobileIcon />}
            onClick={handleInstallClick}
            sx={{
              borderRadius: 25,
              px: 3,
              py: 1.5,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            앱 설치
          </Button>
        </Box>
      )}

      {/* iOS Safari PWA 설치 안내 */}
      <Snackbar
        open={showIOSInstruction}
        onClose={handleIOSInstructionClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 10 }}
      >
        <Alert
          onClose={handleIOSInstructionClose}
          severity="info"
          sx={{ width: '100%' }}
        >
          <Typography variant="body2">
            📱 홈 화면에 추가하려면 공유 버튼을 누르고 "홈 화면에 추가"를 선택하세요!
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};
