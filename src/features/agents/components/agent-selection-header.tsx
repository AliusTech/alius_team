import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface AgentSelectionHeaderProps {
  onClose: () => void;
  currentStep: number;
}

export function AgentSelectionHeader({ onClose, currentStep }: AgentSelectionHeaderProps) {
  const { t } = useTranslation('agents');

  const stepHeaders: Record<number, { title: string; subtitle: string }> = {
    1: { title: t('headers.selectTitle'), subtitle: t('headers.selectSubtitle') },
    2: { title: t('headers.configureTitle'), subtitle: t('headers.configureSubtitle') },
    3: { title: t('headers.confirmTitle'), subtitle: t('headers.confirmSubtitle') },
  };

  const { title, subtitle } = stepHeaders[currentStep] ?? stepHeaders[1];

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}
