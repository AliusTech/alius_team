import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useBreakpoint } from '@/shared/hooks/use-breakpoint';
import { agentTemplates, type AgentTemplate } from '@/shared/mocks/agent-templates';
import { AgentSelectionHeader } from './agent-selection-header';
import { StepIndicator } from './step-indicator';
import { AgentTemplateCard } from './agent-template-card';
import { ConfigureTeamStep, DEFAULT_FORM_DATA, type TaskFormData } from './configure-team-step';
import { ConfirmLaunchStep } from './confirm-launch-step';

interface SelectAgentsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SelectAgentsDialog({ open, onClose }: SelectAgentsDialogProps) {
  const { t } = useTranslation(['agents', 'common']);
  const { isPhone } = useBreakpoint();
  const [currentStep, setCurrentStep] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<TaskFormData>(DEFAULT_FORM_DATA);

  const STEPS = [
    t('agents:dialog.steps.select'),
    t('agents:dialog.steps.configure'),
    t('agents:dialog.steps.confirm'),
  ];

  const filtered = useMemo(() => {
    if (!search.trim()) return agentTemplates;
    const q = search.toLowerCase();
    return agentTemplates.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.specialty.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [search]);

  const selectedAgents = useMemo(
    () => agentTemplates.filter((a) => selectedIds.has(a.id)),
    [selectedIds]
  );

  const toggleAgent = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeAgent = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const updateForm = (updates: Partial<TaskFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleClose = () => {
    onClose();
    setCurrentStep(1);
    setSelectedIds(new Set());
    setFormData(DEFAULT_FORM_DATA);
    setSearch('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Dialog container */}
      <div
        className={cn(
          'relative bg-card border border-border rounded-[14px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden',
          isPhone ? 'inset-0 rounded-none' : 'w-[900px] max-h-[85vh]'
        )}
      >
        {/* Header */}
        <AgentSelectionHeader onClose={handleClose} currentStep={currentStep} />

        {/* Step indicator */}
        <div className="px-4 pb-3">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Step content */}
        {currentStep === 1 && (
          <div className="flex-1 min-h-0 flex flex-col">
          <Step1Content
            search={search}
            onSearchChange={setSearch}
            filtered={filtered}
            selectedIds={selectedIds}
            selectedAgents={selectedAgents}
            toggleAgent={toggleAgent}
            removeAgent={removeAgent}
            isPhone={isPhone}
            onNext={() => setCurrentStep(2)}
            onClose={handleClose}
          />
          </div>
        )}
        {currentStep === 2 && (
          <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
            <ConfigureTeamStep
              selectedAgents={selectedAgents}
              onRemoveAgent={removeAgent}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
              formData={formData}
              onUpdateForm={updateForm}
            />
          </div>
        )}
        {currentStep === 3 && (
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <ConfirmLaunchStep
              selectedAgents={selectedAgents}
              formData={formData}
              onLaunch={handleClose}
              onBack={() => setCurrentStep(2)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Step 1: Select Agents ---------- */

interface Step1ContentProps {
  search: string;
  onSearchChange: (v: string) => void;
  filtered: AgentTemplate[];
  selectedIds: Set<string>;
  selectedAgents: AgentTemplate[];
  toggleAgent: (id: string) => void;
  removeAgent: (id: string) => void;
  isPhone: boolean;
  onNext: () => void;
  onClose: () => void;
}

function Step1Content({
  search,
  onSearchChange,
  filtered,
  selectedIds,
  selectedAgents,
  toggleAgent,
  removeAgent,
  isPhone,
  onNext,
  onClose,
}: Step1ContentProps) {
  const { t } = useTranslation(['agents', 'common']);

  return (
    <>
      {/* Search + selected count */}
      <div className="px-4 pb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('agents:dialog.searchPlaceholder')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-[46px] pl-9 pr-3 rounded-[7px] bg-muted border-none text-[10.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        {selectedIds.size > 0 && (
          <span className="text-[10.5px] text-primary bg-primary/10 rounded-full px-2 py-0.5 whitespace-nowrap">
            {t('agents:dialog.selectedCount', { count: selectedIds.size })}
          </span>
        )}
      </div>

      {/* Content area: cards + right panel */}
      <div className="flex-1 min-h-0 overflow-hidden flex">
        {/* Agent cards grid */}
        <div className="flex-1 overflow-y-auto px-3.5 pb-2">
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((agent) => (
              <AgentTemplateCard
                key={agent.id}
                agent={agent}
                selected={selectedIds.has(agent.id)}
                onToggle={() => toggleAgent(agent.id)}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-12">
              {t('agents:dialog.noMatching')}
            </div>
          )}
        </div>

        {/* Right panel: selected team */}
        {selectedIds.size > 0 && !isPhone && (
          <div className="w-[180px] border-l border-border shrink-0 flex flex-col">
            <div className="px-3 pt-2.5 pb-1">
              <p className="text-[12px] font-medium text-foreground">{t('agents:dialog.selectedTeam')}</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {selectedAgents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-2 px-3 py-2 hover:bg-accent">
                  <div
                    className="w-[17px] h-[17px] rounded flex items-center justify-center text-[8px] shrink-0"
                    style={{ backgroundColor: agent.iconBgColor }}
                  >
                    {agent.iconEmoji}
                  </div>
                  <span className="text-[10.5px] text-foreground flex-1 truncate">{agent.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAgent(agent.id)}
                    className="w-[11px] h-[11px] flex items-center justify-center shrink-0"
                  >
                    <X className="w-[9px] h-[9px] text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-border bg-card px-5 py-3 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="h-[33px] px-4 rounded-[7px] border border-border text-[12px] text-muted-foreground hover:bg-accent transition-colors"
        >
          {t('common:actions.cancel')}
        </button>

        <div className="flex items-center gap-[5px]">
          <div className="w-[14px] h-[5px] rounded-full bg-primary" />
          <div className="w-[5px] h-[5px] rounded-full bg-border" />
          <div className="w-[5px] h-[5px] rounded-full bg-border" />
        </div>

        <button
          type="button"
          disabled={selectedIds.size === 0}
          onClick={selectedIds.size > 0 ? onNext : undefined}
          className={cn(
            'h-8 px-4 rounded-[7px] text-[12px] font-medium flex items-center gap-1.5 transition-colors',
            selectedIds.size > 0
              ? 'bg-[#2d6ff2] text-white hover:bg-[#2563eb]'
              : 'bg-[#2d6ff2]/40 text-white cursor-not-allowed'
          )}
        >
          {t('common:actions.next')}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  );
}
