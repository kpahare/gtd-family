import { useEffect } from 'react';
import { useItemsStore, useContextsStore, useFamilyStore } from '../../store';
import { Header } from '../../components/layout';
import { ItemList } from '../../components/items';

export function NextActionsPage() {
  const { items, isLoading, fetchItems, completeItem, deleteItem } = useItemsStore();
  const { contexts, fetchContexts } = useContextsStore();
  const { families, members, fetchFamilies, fetchMembers } = useFamilyStore();

  useEffect(() => {
    fetchItems('next_action');
    fetchContexts();
    fetchFamilies();
  }, [fetchItems, fetchContexts, fetchFamilies]);

  useEffect(() => {
    if (families.length > 0) {
      fetchMembers(families[0].id);
    }
  }, [families, fetchMembers]);

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
        members={members}
        isLoading={isLoading}
        emptyMessage="No next actions. Process your inbox!"
        onComplete={completeItem}
        onDelete={deleteItem}
      />
    </div>
  );
}
