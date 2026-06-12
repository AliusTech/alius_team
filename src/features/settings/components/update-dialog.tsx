import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X, RefreshCw } from 'lucide-react';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { Button } from '@/design-system/primitives/button';
import { useUpdateStore } from '@/stores/update-store';

export function UpdateDialog() {
  const { t } = useTranslation('settings');
  const {
    status, updateInfo, downloadProgress,
    setDownloading, setDownloaded, setError,
  } = useUpdateStore();

  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (dismissed) return null;
  if (status !== 'available' && status !== 'downloading' && status !== 'downloaded') return null;

  const handleDownload = async () => {
    try {
      const update = await check();
      if (!update) return;

      let downloaded = 0;
      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            downloaded = 0;
            setDownloading(0);
            break;
          case 'Progress':
            downloaded += event.data.chunkLength;
            setDownloading(downloaded);
            break;
          case 'Finished':
            setDownloaded();
            break;
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleRestart = async () => {
    setInstalling(true);
    await relaunch();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative bg-card border border-border rounded-[14px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-[420px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <Download className="size-5 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              {t('update.dialog.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="w-7 h-7 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-2 space-y-3">
          {updateInfo && (
            <>
              <p className="text-xs text-muted-foreground">
                {t('update.dialog.newVersion')}:
                <span className="text-foreground font-medium ml-1">v{updateInfo.version}</span>
              </p>
              {updateInfo.body && (
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {updateInfo.body}
                </div>
              )}
            </>
          )}

          {status === 'downloading' && (
            <div className="space-y-1.5">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(downloadProgress / 10000, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {t('update.dialog.downloading', { percent: Math.min(Math.round(downloadProgress / 10000), 100) })}
              </p>
            </div>
          )}

          {status === 'downloaded' && (
            <p className="text-xs text-primary font-medium">
              {t('update.downloaded')}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4">
          {status === 'available' && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
                {t('update.dialog.skip')}
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="size-3.5 mr-1.5" />
                {t('update.dialog.downloadInstall')}
              </Button>
            </>
          )}
          {status === 'downloading' && (
            <Button size="sm" disabled loading>
              {t('update.downloading')}
            </Button>
          )}
          {status === 'downloaded' && (
            <Button size="sm" onClick={handleRestart} loading={installing}>
              <RefreshCw className="size-3.5 mr-1.5" />
              {t('update.dialog.restart')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
