import { useEffect } from 'react';
import { useItemsStore, useContextsStore } from '../../store';
import { Header } from '../../components/layout';
import { ItemList } from '../../components/items';

export function ScheduledPage() {
  const { items, isLoading, fetchItems, completeItem, deleteItem } = useItemsStore();
  const { contexts, fetchContexts } = useContextsStore();

  useEffect(() => {
    fetchItems('scheduled');
    fetchContexts();
  }, [fetchItems, fetchContexts]);

  const activeItems = items
    .filter((i) => i.type === 'scheduled' && !i.completed_at)
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

  return (
    <div>
      <Header
        title="Scheduled"
        subtitle={`${activeItems.length} scheduled item${activeItems.length !== 1 ? 's' : ''}`}
      />

      <ItemList
        items={activeItems}
        contexts={contexts}
        isLoading={isLoading}
        emptyMessage="Nothing scheduled"
        onComplete={completeItem}
        onDelete={deleteItem}
      />
    </div>
  );
}
