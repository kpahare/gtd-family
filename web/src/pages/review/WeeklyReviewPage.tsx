import { useEffect, useState } from 'react';
import { useReviewStore } from '../../store';
import { Header } from '../../components/layout';
import { ReviewChecklist } from '../../components/review';
import { Button, Card, CardContent, Modal } from '../../components/ui';

export function WeeklyReviewPage() {
  const {
    checklist,
    completedSteps,
    reviews,
    isLoading,
    fetchChecklist,
    fetchReviews,
    toggleStep,
    completeReview,
    resetChecklist,
  } = useReviewStore();

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchChecklist();
    fetchReviews();
  }, [fetchChecklist, fetchReviews]);

  const allStepsCompleted = checklist.length > 0 && completedSteps.size === checklist.length;
  const lastReview = reviews[0];

  const handleCompleteReview = async () => {
    setIsSubmitting(true);
    try {
      await completeReview(notes.trim() || undefined);
      setShowCompleteModal(false);
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <Header
        title="Weekly Review"
        subtitle="Review and organize your system"
        action={
          <div className="flex gap-2">
            {completedSteps.size > 0 && (
              <Button variant="secondary" onClick={resetChecklist}>
                Reset
              </Button>
            )}
            <Button
              onClick={() => setShowCompleteModal(true)}
              disabled={!allStepsCompleted}
            >
              Complete Review
            </Button>
          </div>
        }
      />

      {lastReview && (
        <Card className="mb-6 bg-sky-50 border-sky-200">
          <CardContent>
            <p className="text-sm text-sky-800">
              Last review completed: <strong>{formatDate(lastReview.created_at)}</strong>
            </p>
          </CardContent>
        </Card>
      )}

      <ReviewChecklist
        items={checklist}
        completedSteps={completedSteps}
        isLoading={isLoading}
        onToggle={toggleStep}
      />

      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Weekly Review"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCompleteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteReview} isLoading={isSubmitting}>
              Complete
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-stone-600">
            Great job completing all the review steps! Add any notes from your review session.
          </p>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              rows={4}
              placeholder="Any insights or observations from your review..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
