import { useState, FormEvent } from 'react';
import { Input, Button } from '../ui';

interface ItemFormProps {
  onSubmit: (title: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
}

export function ItemForm({
  onSubmit,
  placeholder = 'What needs to be done?',
  buttonText = 'Add',
}: ItemFormProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim());
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" isLoading={isSubmitting} disabled={!title.trim()}>
        {buttonText}
      </Button>
    </form>
  );
}
