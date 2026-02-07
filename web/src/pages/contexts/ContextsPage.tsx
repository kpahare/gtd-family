import { useEffect, useState, FormEvent } from 'react';
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
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Context
          </Button>
        }
      />

      {isLoading ? (
        <Spinner className="py-12" />
      ) : contexts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
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
                  <span className="font-medium text-gray-900">@{context.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(context)}>
                    <svg className="w-4 h-4 text-gray-400 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(context.id)}>
                    <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {defaultColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
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
