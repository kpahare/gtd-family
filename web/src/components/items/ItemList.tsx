import { Item, Context, FamilyMember } from '../../types';
import { ItemCard } from './ItemCard';
import { Spinner } from '../ui';

interface ItemListProps {
  items: Item[];
  contexts?: Context[];
  members?: FamilyMember[];
  isLoading?: boolean;
  emptyMessage?: string;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onProcess?: (item: Item) => void;
  showProcessButton?: boolean;
}

export function ItemList({
  items,
  contexts = [],
  members = [],
  isLoading,
  emptyMessage = 'No items',
  onComplete,
  onDelete,
  onProcess,
  showProcessButton = false,
}: ItemListProps) {
  if (isLoading) {
    return <Spinner className="py-12" />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const getContext = (contextId: string | null) => {
    if (!contextId) return undefined;
    return contexts.find((c) => c.id === contextId);
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          context={getContext(item.context_id)}
          members={members}
          onComplete={onComplete}
          onDelete={onDelete}
          onProcess={onProcess}
          showProcessButton={showProcessButton}
        />
      ))}
    </div>
  );
}
