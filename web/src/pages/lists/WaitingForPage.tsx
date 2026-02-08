import { useEffect } from 'react';
import { useItemsStore, useContextsStore, useFamilyStore } from '../../store';
import { Header } from '../../components/layout';
import { ItemList } from '../../components/items';

export function WaitingForPage() {
  const { items, isLoading, fetchItems, completeItem, deleteItem } = useItemsStore();
  const { contexts, fetchContexts } = useContextsStore();
  const { families, members, fetchFamilies, fetchMembers } = useFamilyStore();

  useEffect(() => {
    fetchItems('waiting_for');
    fetchContexts();
    fetchFamilies();
  }, [fetchItems, fetchContexts, fetchFamilies]);

  useEffect(() => {
    if (families.length > 0) {
      fetchMembers(families[0].id);
    }
  }, [families, fetchMembers]);

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
        members={members}
        isLoading={isLoading}
        emptyMessage="Nothing to wait for"
        onComplete={completeItem}
        onDelete={deleteItem}
      />
    </div>
  );
}
