import { Check, Trash2, Flag } from 'lucide-react';
import { Item, Context, FamilyMember, ItemPriority } from '../../types';
import { Card, CardContent, Button } from '../ui';

const priorityConfig: Record<ItemPriority, { label: string; classes: string }> = {
  p1: { label: 'P1', classes: 'bg-rose-50 text-rose-700' },
  p2: { label: 'P2', classes: 'bg-amber-50 text-amber-700' },
  p3: { label: 'P3', classes: 'bg-sky-50 text-sky-700' },
  p4: { label: 'P4', classes: 'bg-stone-100 text-stone-500' },
};

interface ItemCardProps {
  item: Item;
  context?: Context;
  members?: FamilyMember[];
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onProcess?: (item: Item) => void;
  showProcessButton?: boolean;
}

export function ItemCard({
  item,
  context,
  members = [],
  onComplete,
  onDelete,
  onProcess,
  showProcessButton = false,
}: ItemCardProps) {
  const isCompleted = !!item.completed_at;

  return (
    <Card className={isCompleted ? 'opacity-60' : ''}>
      <CardContent className="flex items-start gap-3">
        <button
          onClick={() => onComplete?.(item.id)}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors flex items-center justify-center ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-stone-300 hover:border-amber-500'
          }`}
        >
          {isCompleted && (
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-stone-900 ${isCompleted ? 'line-through' : ''}`}>
            {item.title}
          </p>
          {item.notes && (
            <p className="text-sm text-stone-500 mt-1 line-clamp-2">{item.notes}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {context && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                style={{ backgroundColor: context.color + '20', color: context.color }}
              >
                @{context.name}
              </span>
            )}
            {item.due_date && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                {new Date(item.due_date).toLocaleDateString()}
              </span>
            )}
            {item.priority && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${priorityConfig[item.priority].classes}`}>
                <Flag className="w-3 h-3" />
                {priorityConfig[item.priority].label}
              </span>
            )}
            {item.assigned_to && (() => {
              const member = members.find((m) => m.user_id === item.assigned_to);
              const name = member?.user_name || 'Unknown';
              return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-violet-50 text-violet-700">
                  <span className="w-4 h-4 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {name.charAt(0).toUpperCase()}
                  </span>
                  {name}
                </span>
              );
            })()}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {showProcessButton && !isCompleted && (
            <Button variant="ghost" size="sm" onClick={() => onProcess?.(item)}>
              Process
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onDelete?.(item.id)}>
            <Trash2 className="w-4 h-4 text-stone-400 hover:text-rose-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
