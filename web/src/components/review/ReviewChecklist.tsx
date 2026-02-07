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
      <div className="text-center py-12 text-gray-500">
        <p>No checklist items</p>
      </div>
    );
  }

  const progress = (completedSteps.size / items.length) * 100;

  return (
    <div className="space-y-4">
      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 text-center">
        {completedSteps.size} of {items.length} steps completed
      </p>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isCompleted = completedSteps.has(item.id);

          return (
            <Card
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={isCompleted ? 'bg-green-50 border-green-200' : ''}
            >
              <CardContent className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                    {isCompleted && (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${isCompleted ? 'text-green-700' : 'text-gray-500'}`}>
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
