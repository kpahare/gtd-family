import { useState } from 'react';
import { Item, ItemType, Context, Project } from '../../types';
import { Modal, Button, Select, Input } from '../ui';

interface ProcessItemModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onProcess: (
    id: string,
    type: ItemType,
    contextId?: string,
    projectId?: string,
    dueDate?: string
  ) => Promise<void>;
  contexts: Context[];
  projects: Project[];
}

const itemTypes: { value: ItemType; label: string }[] = [
  { value: 'next_action', label: 'Next Action' },
  { value: 'waiting_for', label: 'Waiting For' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'someday', label: 'Someday/Maybe' },
  { value: 'reference', label: 'Reference' },
];

export function ProcessItemModal({
  item,
  isOpen,
  onClose,
  onProcess,
  contexts,
  projects,
}: ProcessItemModalProps) {
  const [type, setType] = useState<ItemType>('next_action');
  const [contextId, setContextId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!item) return;

    setIsSubmitting(true);
    try {
      await onProcess(
        item.id,
        type,
        contextId || undefined,
        projectId || undefined,
        dueDate || undefined
      );
      onClose();
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setType('next_action');
    setContextId('');
    setProjectId('');
    setDueDate('');
  };

  const contextOptions = [
    { value: '', label: 'No context' },
    ...contexts.map((c) => ({ value: c.id, label: `@${c.name}` })),
  ];

  const projectOptions = [
    { value: '', label: 'No project' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Process Item"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Process
          </Button>
        </>
      }
    >
      {item && (
        <div className="space-y-4">
          <div className="p-3 bg-stone-50 rounded-lg">
            <p className="font-medium text-stone-900">{item.title}</p>
            {item.notes && <p className="text-sm text-stone-500 mt-1">{item.notes}</p>}
          </div>

          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as ItemType)}
            options={itemTypes}
          />

          <Select
            label="Context"
            value={contextId}
            onChange={(e) => setContextId(e.target.value)}
            options={contextOptions}
          />

          <Select
            label="Project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            options={projectOptions}
          />

          {(type === 'scheduled' || type === 'waiting_for') && (
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          )}
        </div>
      )}
    </Modal>
  );
}
