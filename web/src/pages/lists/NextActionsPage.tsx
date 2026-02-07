import { useEffect } from 'react';
import { useItemsStore, useContextsStore } from '../../store';
import { Header } from '../../components/layout';
import { ItemList } from '../../components/items';

export function NextActionsPage() {
  const { items, isLoading, fetchItems, completeItem, deleteItem } = useItemsStore();
  const { contexts, fetchContexts } = useContextsStore();

  useEffect(() => {
    fetchItems('next_action');
    fetchContexts();
  }, [fetchItems, fetchContexts]);

  const activeItems = items.filter((i) => i.type === 'next_action' && !i.completed_at);

  return (
    <div>
      <Header
        title="Next Actions"
        subtitle={`${activeItems.length} action${activeItems.length !== 1 ? 's' : ''} to do`}
      />

      <ItemList
        items={activeItems}
        contexts={contexts}
        isLoading={isLoading}
        emptyMessage="No next actions. Process your inbox!"
        onComplete={completeItem}
        onDelete={deleteItem}
      />
    </div>
  );
}
