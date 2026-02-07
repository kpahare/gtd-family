import { useState, FormEvent } from 'react';
import { ProjectHorizon } from '../../types';
import { Input, Button, Select, Modal } from '../ui';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string, horizon?: ProjectHorizon) => Promise<void>;
}

const horizonOptions = [
  { value: 'project', label: 'Project' },
  { value: 'area', label: 'Area of Focus' },
  { value: 'goal', label: 'Goal' },
  { value: 'vision', label: 'Vision' },
  { value: 'purpose', label: 'Purpose' },
];

export function ProjectForm({ isOpen, onClose, onSubmit }: ProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [horizon, setHorizon] = useState<ProjectHorizon>('project');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), description.trim() || undefined, horizon);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setHorizon('project');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Project"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!name.trim()}>
            Create
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          autoFocus
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
        <Select
          label="Horizon"
          value={horizon}
          onChange={(e) => setHorizon(e.target.value as ProjectHorizon)}
          options={horizonOptions}
        />
      </form>
    </Modal>
  );
}
