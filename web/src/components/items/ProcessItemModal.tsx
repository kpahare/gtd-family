import { useState } from 'react';
import { Item, ItemType, Context, Project, FamilyMember } from '../../types';
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
    dueDate?: string,
    assignedTo?: string,
    priority?: string
  ) => Promise<void>;
  contexts: Context[];
  projects: Project[];
  members?: FamilyMember[];
}

const itemTypes: { value: ItemType; label: string }[] = [
  { value: 'next_action', label: 'Next Action' },
  { value: 'waiting_for', label: 'Waiting For' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'someday', label: 'Someday/Maybe' },
  { value: 'reference', label: 'Reference' },
];

const priorityOptions = [
  { value: '', label: 'No priority' },
  { value: 'p1', label: '🔴 P1 — Urgent' },
  { value: 'p2', label: '🟠 P2 — High' },
  { value: 'p3', label: '🔵 P3 — Medium' },
  { value: 'p4', label: '⚪ P4 — Low' },
];

export function ProcessItemModal({
  item,
  isOpen,
  onClose,
  onProcess,
  contexts,
  projects,
  members = [],
}: ProcessItemModalProps) {
  const [type, setType] = useState<ItemType>('next_action');
  const [contextId, setContextId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('');
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
        dueDate || undefined,
        assignedTo || undefined,
        priority || undefined
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
    setAssignedTo('');
    setPriority('');
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

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={priorityOptions}
          />

          {members.length > 0 && (
            <Select
              label="Assign to"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              options={[
                { value: '', label: 'Unassigned' },
                ...members.map((m) => ({ value: m.user_id, label: m.user_name })),
              ]}
            />
          )}

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
