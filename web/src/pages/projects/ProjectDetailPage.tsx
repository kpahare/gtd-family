import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useProjectsStore, useItemsStore, useContextsStore } from '../../store';
import { Header } from '../../components/layout';
import { ItemList, ItemForm } from '../../components/items';
import { Button, Select, Spinner } from '../../components/ui';
import { ProjectStatus } from '../../types';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'someday', label: 'Someday/Maybe' },
];

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProject, isLoading: projectLoading, fetchProject, updateProject, deleteProject } = useProjectsStore();
  const { items, isLoading: itemsLoading, fetchItems, addItem, completeItem, deleteItem } = useItemsStore();
  const { contexts, fetchContexts } = useContextsStore();
  const [status, setStatus] = useState<ProjectStatus>('active');

  useEffect(() => {
    if (id) {
      fetchProject(id);
      fetchItems(undefined, id);
      fetchContexts();
    }
  }, [id, fetchProject, fetchItems, fetchContexts]);

  useEffect(() => {
    if (currentProject) {
      setStatus(currentProject.status);
    }
  }, [currentProject]);

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    if (!id) return;
    setStatus(newStatus);
    await updateProject(id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      navigate('/projects');
    }
  };

  const handleAddItem = async (title: string) => {
    if (!id) return;
    await addItem(title, 'next_action', id);
  };

  const projectItems = items.filter((i) => i.project_id === id && !i.completed_at);

  if (projectLoading && !currentProject) {
    return <Spinner className="py-12" />;
  }

  if (!currentProject) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-500">Project not found</p>
        <Button variant="ghost" onClick={() => navigate('/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center text-sm text-stone-500 hover:text-stone-700 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </button>
      </div>

      <Header
        title={currentProject.name}
        subtitle={currentProject.description || undefined}
        action={
          <div className="flex items-center gap-3">
            <Select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
              options={statusOptions}
            />
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        }
      />

      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight text-stone-900 mb-4">Project Items</h2>

        <div className="mb-6">
          <ItemForm
            onSubmit={handleAddItem}
            placeholder="Add a new item to this project"
            buttonText="Add"
          />
        </div>

        <ItemList
          items={projectItems}
          contexts={contexts}
          isLoading={itemsLoading}
          emptyMessage="No items in this project"
          onComplete={completeItem}
          onDelete={deleteItem}
        />
      </div>
    </div>
  );
}
