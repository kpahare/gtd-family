import { Item, Context } from '../../types';
import { Card, CardContent, Button } from '../ui';

interface ItemCardProps {
  item: Item;
  context?: Context;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onProcess?: (item: Item) => void;
  showProcessButton?: boolean;
}

export function ItemCard({
  item,
  context,
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
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
            isCompleted
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          {isCompleted && (
            <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-gray-900 ${isCompleted ? 'line-through' : ''}`}>
            {item.title}
          </p>
          {item.notes && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.notes}</p>
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
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                {new Date(item.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {showProcessButton && !isCompleted && (
            <Button variant="ghost" size="sm" onClick={() => onProcess?.(item)}>
              Process
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onDelete?.(item.id)}>
            <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
