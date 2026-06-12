import { useTranslation } from 'react-i18next';
import { Minus, Plus, ArrowDown, ArrowRight, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import type { AgentTemplate } from '@/shared/mocks/agent-templates';

export interface TaskFormData {
  name: string;
  objective: string;
  priority: 'high' | 'medium' | 'low';
  maxRounds: number;
  executionMode: 'sequential' | 'parallel';
}

export const DEFAULT_FORM_DATA: TaskFormData = {
  name: '',
  objective: '',
  priority: 'medium',
  maxRounds: 10,
  executionMode: 'sequential',
};

interface ConfigureTeamStepProps {
  selectedAgents: AgentTemplate[];
  onRemoveAgent: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  formData: TaskFormData;
  onUpdateForm: (updates: Partial<TaskFormData>) => void;
}

const PRIORITIES = [
  { value: 'high' as const, labelKey: 'form.priorityHigh', color: 'bg-[#ef4444] text-white' },
  { value: 'medium' as const, labelKey: 'form.priorityMedium', color: 'bg-[#2d6ff2] text-white' },
  { value: 'low' as const, labelKey: 'form.priorityLow', color: 'bg-[#22c55e] text-white' },
];

export function ConfigureTeamStep({
  selectedAgents,
  onRemoveAgent,
  onNext,
  onBack,
  formData,
  onUpdateForm,
}: ConfigureTeamStepProps) {
  const { t } = useTranslation(['agents', 'common']);
  const canNext = formData.name.trim().length > 0;

  return (
    <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
      {/* Main area: Form + Sidebar */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
      {/* Left: Form */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4">
        {/* Task Name */}
        <div>
          <label className="block text-[12px] font-medium text-foreground mb-1.5">
            {t('agents:form.taskName')} <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            placeholder={t('agents:form.taskNamePlaceholder')}
            value={formData.name}
            onChange={(e) => onUpdateForm({ name: e.target.value })}
            className="w-full h-[38px] px-3 rounded-[7px] bg-card border border-border text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Objective */}
        <div>
          <label className="block text-[12px] font-medium text-foreground mb-1.5">
            {t('agents:form.objective')}
          </label>
          <textarea
            placeholder={t('agents:form.objectivePlaceholder')}
            rows={4}
            value={formData.objective}
            onChange={(e) => onUpdateForm({ objective: e.target.value })}
            className="w-full px-3 py-2 rounded-[7px] bg-card border border-border text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[12px] font-medium text-foreground mb-1.5">
            {t('agents:form.priority')}
          </label>
          <div className="flex items-center gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => onUpdateForm({ priority: p.value })}
                className={cn(
                  'h-[32px] px-4 rounded-[7px] text-[12px] font-medium transition-all border',
                  formData.priority === p.value
                    ? `${p.color} border-transparent`
                    : 'bg-card border-border text-muted-foreground hover:border-border'
                )}
              >
                {t(`agents:${p.labelKey}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Max Rounds */}
        <div>
          <label className="block text-[12px] font-medium text-foreground mb-1.5">
            {t('agents:form.maxRounds')}
          </label>
          <div className="flex items-center gap-0">
            <button
              type="button"
              onClick={() => onUpdateForm({ maxRounds: Math.max(1, formData.maxRounds - 1) })}
              className="w-[32px] h-[32px] rounded-l-[7px] border border-border flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Minus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <div className="h-[32px] min-w-[52px] px-3 flex items-center justify-center border-t border-b border-border text-[12px] font-medium text-foreground">
              {formData.maxRounds}
            </div>
            <button
              type="button"
              onClick={() => onUpdateForm({ maxRounds: Math.min(50, formData.maxRounds + 1) })}
              className="w-[32px] h-[32px] rounded-r-[7px] border border-border flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Execution Mode */}
        <div>
          <label className="block text-[12px] font-medium text-foreground mb-1.5">
            {t('agents:form.executionMode')}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onUpdateForm({ executionMode: 'sequential' })}
              className={cn(
                'flex-1 text-left rounded-[11px] border p-3 transition-all',
                formData.executionMode === 'sequential'
                  ? 'border-primary shadow-[0_0_0_1px_var(--color-primary)] bg-primary/5'
                  : 'border-border bg-card hover:border-border'
              )}
            >
              <div className="flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-primary" />
                <span className={cn(
                  'text-[12px] font-medium',
                  formData.executionMode === 'sequential' ? 'text-primary' : 'text-foreground'
                )}>
                  {t('agents:form.sequential')}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 ml-6">{t('agents:form.sequentialDesc')}</p>
            </button>
            <button
              type="button"
              onClick={() => onUpdateForm({ executionMode: 'parallel' })}
              className={cn(
                'flex-1 text-left rounded-[11px] border p-3 transition-all',
                formData.executionMode === 'parallel'
                  ? 'border-primary shadow-[0_0_0_1px_var(--color-primary)] bg-primary/5'
                  : 'border-border bg-card hover:border-border'
              )}
            >
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                <span className={cn(
                  'text-[12px] font-medium',
                  formData.executionMode === 'parallel' ? 'text-primary' : 'text-foreground'
                )}>
                  {t('agents:form.parallel')}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 ml-6">{t('agents:form.parallelDesc')}</p>
            </button>
          </div>
        </div>
      </div>

      {/* Right: Team Members */}
      <div className="w-[220px] border-l border-border shrink-0 flex flex-col min-h-0">
        <div className="px-3 pt-3 pb-1.5 flex items-center justify-between">
          <p className="text-[12px] font-medium text-foreground">{t('agents:teamMembers.title')}</p>
          <span className="text-[10px] text-primary bg-primary/10 rounded-full px-1.5 py-0.5">
            {t('common:units.members', { count: selectedAgents.length })}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {selectedAgents.length === 0 ? (
            <div className="text-center text-[11px] text-muted-foreground py-8">
              {t('agents:teamMembers.noMembers')}
            </div>
          ) : (
            selectedAgents.map((agent) => (
              <div key={agent.id} className="flex items-center gap-2 px-3 py-2 hover:bg-accent group">
                <div
                  className="w-[22px] h-[22px] rounded flex items-center justify-center text-[10px] shrink-0"
                  style={{ backgroundColor: agent.iconBgColor }}
                >
                  {agent.iconEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-foreground truncate">{agent.name}</p>
                  <p className="text-[10px] text-muted-foreground">{agent.model}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveAgent(agent.id)}
                  className="w-[16px] h-[16px] flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-[10px] h-[10px] text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-border bg-card px-5 py-3 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="h-[33px] px-4 rounded-[7px] border border-border text-[12px] text-muted-foreground hover:bg-accent transition-colors"
        >
          {t('common:actions.previous')}
        </button>
        <div className="flex items-center gap-[5px]">
          <div className="w-[5px] h-[5px] rounded-full bg-primary" />
          <div className="w-[14px] h-[5px] rounded-full bg-primary" />
          <div className="w-[5px] h-[5px] rounded-full bg-border" />
        </div>
        <button
          type="button"
          disabled={!canNext}
          onClick={canNext ? onNext : undefined}
          className={cn(
            'h-8 px-4 rounded-[7px] text-[12px] font-medium flex items-center gap-1.5 transition-colors',
            canNext
              ? 'bg-[#2d6ff2] text-white hover:bg-[#2563eb]'
              : 'bg-[#2d6ff2]/40 text-white cursor-not-allowed'
          )}
        >
          {t('common:actions.next')}
        </button>
      </div>
    </div>
  );
}
