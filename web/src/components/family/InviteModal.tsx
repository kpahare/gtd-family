import { useState } from 'react';
import { Modal, Button, Input } from '../ui';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
  onGenerateNew: () => Promise<void>;
}

export function InviteModal({ isOpen, onClose, inviteCode, onGenerateNew }: InviteModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink = `${window.location.origin}/join?code=${inviteCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateNew = async () => {
    setIsGenerating(true);
    try {
      await onGenerateNew();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Family Members">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Share this link with family members to invite them to join your family group.
        </p>

        <div className="flex gap-2">
          <Input value={inviteLink} readOnly className="flex-1" />
          <Button onClick={handleCopy} variant={copied ? 'secondary' : 'primary'}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500 mb-2">
            Invite code: <code className="bg-gray-100 px-2 py-1 rounded">{inviteCode}</code>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateNew}
            isLoading={isGenerating}
          >
            Generate new code
          </Button>
        </div>
      </div>
    </Modal>
  );
}
