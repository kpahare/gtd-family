import { useEffect, useState, FormEvent } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useContextsStore } from '../../store';
import { Context } from '../../types';
import { Header } from '../../components/layout';
import { Button, Input, Card, CardContent, Modal, Spinner } from '../../components/ui';

const defaultColors = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];

export function ContextsPage() {
  const { contexts, isLoading, fetchContexts, addContext, updateContext, deleteContext } = useContextsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingContext, setEditingContext] = useState<Context | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(defaultColors[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchContexts();
  }, [fetchContexts]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingContext) {
        await updateContext(editingContext.id, { name: name.trim(), color });
      } else {
        await addContext(name.trim(), color);
      }
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (context: Context) => {
    setEditingContext(context);
    setName(context.name);
    setColor(context.color);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this context?')) {
      await deleteContext(id);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingContext(null);
    setName('');
    setColor(defaultColors[0]);
  };

  return (
    <div>
      <Header
        title="Contexts"
        subtitle={`${contexts.length} context${contexts.length !== 1 ? 's' : ''}`}
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Context
          </Button>
        }
      />

      {isLoading ? (
        <Spinner className="py-12" />
      ) : contexts.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          <p>No contexts yet</p>
          <p className="text-sm mt-1">Create contexts to organize your actions by location or tool</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contexts.map((context) => (
            <Card key={context.id}>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: context.color }}
                  />
                  <span className="font-medium text-stone-900">@{context.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(context)}>
                    <Pencil className="w-4 h-4 text-stone-400 hover:text-amber-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(context.id)}>
                    <Trash2 className="w-4 h-4 text-stone-400 hover:text-rose-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingContext ? 'Edit Context' : 'New Context'}
        footer={
          <>
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!name.trim()}>
              {editingContext ? 'Save' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., home, office, phone"
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {defaultColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-amber-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
