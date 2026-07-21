'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type AIGeneratorDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function AIGeneratorDialog({ isOpen, onClose, onSuccess }: AIGeneratorDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/goals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate goal');
      }

      setPrompt('');
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Ensure your API key is configured correctly and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>✨</span> Generate Goal with AI
          </DialogTitle>
          <DialogDescription>
            Describe what you want to achieve. The AI will intelligently break it down into a structured goal with a timeline and actionable sub-tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Your Ambition</Label>
            <Textarea
              id="prompt"
              placeholder="e.g. I want to run a half marathon in 6 months, starting from zero."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px]"
              disabled={loading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={!prompt.trim() || loading} className="bg-purple-600 hover:bg-purple-700 text-white">
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Generating...
                </>
              ) : (
                'Generate Goal'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
