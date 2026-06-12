import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Users, Layers, Repeat } from 'lucide-react';
import type { AgentTemplate } from '@/shared/mocks/agent-templates';
import type { TaskFormData } from './configure-team-step';
import { LoadingOverlay } from '@/design-system/components/loading-overlay';

interface ConfirmLaunchStepProps {
  selectedAgents: AgentTemplate[];
  formData: TaskFormData;
  onLaunch: () => void;
  onBack: () => void;
}

/** Step 3 of the agent selection flow: review task configuration and launch. */
export function ConfirmLaunchStep({
  selectedAgents,
  formData,
  onLaunch,
  onBack,
}: ConfirmLaunchStepProps) {
  const { t } = useTranslation(['agents', 'common']);
  const [isLaunching, setIsLaunching] = useState(false);

  const priorityKey = `confirm.priority${formData.priority.charAt(0).toUpperCase()}${formData.priority.slice(1)}` as const;
  const modeKey = `confirm.mode${formData.executionMode.charAt(0).toUpperCase()}${formData.executionMode.slice(1)}` as const;

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      onLaunch();
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
      <LoadingOverlay visible={isLaunching} message={t('agents:confirm.launching', '正在启动任务...')} />
      {/* Task summary card */}
      <div className="rounded-[11px] border border-border bg-card p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h2 className="text-[14px] font-semibold text-foreground">
            {formData.name || t('agents:confirm.unnamedTask')}
          </h2>
          <span className="text-[10px] text-primary bg-primary/10 rounded-full px-2 py-0.5 whitespace-nowrap">
            {t(`agents:${priorityKey}`)}
          </span>
        </div>
        {formData.objective && (
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            {formData.objective}
          </p>
        )}

        {/* Info boxes */}
        <div className="flex items-stretch gap-0 rounded-[7px] border border-border overflow-hidden">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border-r border-border">
            <Users className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">{t('agents:confirm.agentCount')}</p>
              <p className="text-[12px] font-medium text-foreground">{t('common:units.people', { count: selectedAgents.length })}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border-r border-border">
            <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">{t('agents:confirm.executionMethod')}</p>
              <p className="text-[12px] font-medium text-foreground">{t(`agents:${modeKey}`)}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5">
            <Repeat className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">{t('agents:confirm.maxRounds')}</p>
              <p className="text-[12px] font-medium text-foreground">{t('common:units.rounds', { count: formData.maxRounds })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team members section */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <p className="text-[12px] font-medium text-foreground">{t('agents:confirm.participatingTeam')}</p>
          <span className="text-[10px] text-primary bg-primary/10 rounded-full px-1.5 py-0.5">
            {t('common:units.people', { count: selectedAgents.length })}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {selectedAgents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-[11px] border border-border bg-card p-3 flex items-start gap-2.5"
            >
              <div
                className="w-[28px] h-[28px] rounded-lg flex items-center justify-center text-[12px] shrink-0"
                style={{ backgroundColor: agent.iconBgColor }}
              >
                {agent.iconEmoji}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-foreground truncate">{agent.name}</p>
                <p className="text-[10px] text-muted-foreground">{agent.model}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning banner */}
      <div className="rounded-[7px] bg-amber-50 border border-amber-200 px-3 py-2.5 flex items-start gap-2 dark:bg-amber-900/20 dark:border-amber-800/40">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 dark:text-amber-400" />
        <p className="text-[11px] text-amber-800 leading-relaxed dark:text-amber-200">
          {t('agents:confirm.warning')}
        </p>
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-border bg-card -mx-5 -mb-4 px-5 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="h-[33px] px-4 rounded-[7px] border border-border text-[12px] text-muted-foreground hover:bg-accent transition-colors"
        >
          {t('common:actions.previous')}
        </button>
        <div className="flex items-center gap-[5px]">
          <div className="w-[5px] h-[5px] rounded-full bg-primary" />
          <div className="w-[5px] h-[5px] rounded-full bg-primary" />
          <div className="w-[14px] h-[5px] rounded-full bg-primary" />
        </div>
        <button
          type="button"
          onClick={handleLaunch}
          disabled={isLaunching}
          className="h-8 px-5 rounded-[7px] text-[12px] font-medium bg-[#2d6ff2] text-white hover:bg-[#2563eb] transition-colors disabled:opacity-50"
        >
          {t('common:actions.launch')}
        </button>
      </div>
    </div>
  );
}
