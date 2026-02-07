import { useEffect, useState } from 'react';
import { useItemsStore, useContextsStore, useProjectsStore } from '../../store';
import { Item } from '../../types';
import { Header } from '../../components/layout';
import { ItemList, ItemForm, ProcessItemModal } from '../../components/items';

export function InboxPage() {
  const { items, isLoading, fetchItems, addItem, completeItem, deleteItem, processItem } = useItemsStore();
  const { contexts, fetchContexts } = useContextsStore();
  const { projects, fetchProjects } = useProjectsStore();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchItems('inbox');
    fetchContexts();
    fetchProjects();
  }, [fetchItems, fetchContexts, fetchProjects]);

  const inboxItems = items.filter((i) => i.type === 'inbox' && !i.completed_at);

  const handleProcess = async (
    id: string,
    type: import('../../types').ItemType,
    contextId?: string,
    projectId?: string,
    dueDate?: string
  ) => {
    await processItem(id, type, contextId, projectId, dueDate);
    fetchItems('inbox');
  };

  return (
    <div>
      <Header
        title="Inbox"
        subtitle={`${inboxItems.length} item${inboxItems.length !== 1 ? 's' : ''} to process`}
      />

      <div className="mb-6">
        <ItemForm
          onSubmit={(title) => addItem(title, 'inbox')}
          placeholder="What's on your mind?"
          buttonText="Capture"
        />
      </div>

      <ItemList
        items={inboxItems}
        contexts={contexts}
        isLoading={isLoading}
        emptyMessage="Inbox is empty. Capture something!"
        onComplete={completeItem}
        onDelete={deleteItem}
        onProcess={setSelectedItem}
        showProcessButton
      />

      <ProcessItemModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onProcess={handleProcess}
        contexts={contexts}
        projects={projects.filter((p) => p.status === 'active')}
      />
    </div>
  );
}
