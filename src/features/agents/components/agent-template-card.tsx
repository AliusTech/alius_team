import { cn } from '@/shared/utils/cn';
import { Check } from 'lucide-react';
import type { AgentTemplate } from '@/shared/mocks/agent-templates';

/** Props for the AgentTemplateCard component. */
interface AgentTemplateCardProps {
  agent: AgentTemplate;
  selected: boolean;
  onToggle: () => void;
}

/** Selectable card displaying an agent template with capabilities and tags. */
export function AgentTemplateCard({ agent, selected, onToggle }: AgentTemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'w-full text-left rounded-[11px] border bg-card p-3 transition-all',
        selected
          ? 'border-primary shadow-[0_0_0_1px_var(--color-primary)]'
          : 'border-border hover:border-border'
      )}
    >
      {/* Top row: icon, name+checkbox, specialty */}
      <div className="flex items-start gap-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
          style={{ backgroundColor: agent.iconBgColor }}
        >
          {agent.iconEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-foreground truncate">
              {agent.name}
            </span>
            <div
              className={cn(
                'w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                selected
                  ? 'bg-primary border-primary'
                  : 'border-border bg-card'
              )}
            >
              {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">{agent.specialty}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed line-clamp-2">
        {agent.description}
      </p>

      {/* Separator */}
      <div className="border-t border-border my-2" />

      {/* Bottom row: model + tags */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground font-medium">{agent.model}</span>
        <div className="flex items-center gap-1">
          {agent.capabilities.map((cap) => (
            <span
              key={cap}
              className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-2">
        {agent.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
