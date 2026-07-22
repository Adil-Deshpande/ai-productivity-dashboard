'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Cpu, ArrowRight } from 'lucide-react';

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
      setError('Generation request failed. Check API key configuration or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white border border-[#E8E6DF] p-6 text-[#141413]">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#73726D] uppercase tracking-widest mb-1">
            <Cpu className="w-4 h-4 text-[#141413]" />
            <span>LLM DECOMPOSITION ENGINE</span>
          </div>
          <DialogTitle className="text-xl font-bold text-[#141413] tracking-tight">
            Structure an Ambition
          </DialogTitle>
          <DialogDescription className="text-xs text-[#52514D]">
            Describe any high-level project or goal. The system will parse your request into a prioritized, multi-stage task tree.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="font-mono text-[10px] font-bold text-[#73726D] uppercase tracking-wider">
              YOUR PROMPT / AMBITION
            </Label>
            <Textarea
              id="prompt"
              placeholder="e.g. Build and launch a full-stack SaaS product MVP with user auth and billing in 4 weeks."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] bg-[#FAF9F5] border-[#E8E6DF] text-sm text-[#141413] focus:border-[#141413] focus:ring-0 placeholder-[#A3A199] resize-none"
              disabled={loading}
            />
            {error && <p className="text-xs text-red-600 font-mono">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-[#E8E6DF] text-xs font-semibold text-[#52514D] hover:bg-[#FAF9F5]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="bg-[#141413] hover:bg-[#2A2927] text-[#FAF9F5] text-xs font-semibold px-4 py-2 rounded-md shadow-sm tactile-btn disabled:opacity-60"
            >
              {loading ? (
                <span className="font-mono text-xs">Parsing Task Tree...</span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span>Decompose Goal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
