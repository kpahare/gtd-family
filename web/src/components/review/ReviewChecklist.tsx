import { CheckCircle2 } from 'lucide-react';
import { ReviewChecklistItem } from '../../types';
import { Card, CardContent, Spinner } from '../ui';

interface ReviewChecklistProps {
  items: ReviewChecklistItem[];
  completedSteps: Set<string>;
  isLoading?: boolean;
  onToggle: (stepId: string) => void;
}

export function ReviewChecklist({
  items,
  completedSteps,
  isLoading,
  onToggle,
}: ReviewChecklistProps) {
  if (isLoading) {
    return <Spinner className="py-12" />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <p>No checklist items</p>
      </div>
    );
  }

  const progress = (completedSteps.size / items.length) * 100;

  return (
    <div className="space-y-4">
      <div className="bg-stone-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-amber-600 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-stone-500 text-center">
        {completedSteps.size} of {items.length} steps completed
      </p>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isCompleted = completedSteps.has(item.id);

          return (
            <Card
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={isCompleted ? 'bg-emerald-50 border-emerald-200' : ''}
            >
              <CardContent className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-600 font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${isCompleted ? 'text-emerald-800' : 'text-stone-900'}`}>
                      {item.title}
                    </h3>
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${isCompleted ? 'text-emerald-700' : 'text-stone-500'}`}>
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
