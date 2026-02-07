import { useEffect } from 'react';
import { useItemsStore, useContextsStore } from '../../store';
import { Header } from '../../components/layout';
import { ItemList } from '../../components/items';

export function WaitingForPage() {
  const { items, isLoading, fetchItems, completeItem, deleteItem } = useItemsStore();
  const { contexts, fetchContexts } = useContextsStore();

  useEffect(() => {
    fetchItems('waiting_for');
    fetchContexts();
  }, [fetchItems, fetchContexts]);

  const activeItems = items.filter((i) => i.type === 'waiting_for' && !i.completed_at);

  return (
    <div>
      <Header
        title="Waiting For"
        subtitle={`${activeItems.length} item${activeItems.length !== 1 ? 's' : ''} pending`}
      />

      <ItemList
        items={activeItems}
        contexts={contexts}
        isLoading={isLoading}
        emptyMessage="Nothing to wait for"
        onComplete={completeItem}
        onDelete={deleteItem}
      />
    </div>
  );
}
