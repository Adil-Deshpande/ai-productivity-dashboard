'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Loader2, Plus, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotes();
  }, []);

  const handleSave = async () => {
    try {
      if (isCreating) {
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: editTitle, content: editContent })
        });
        if (res.ok) {
          const newNote = await res.json();
          setNotes([newNote, ...notes]);
        }
      } else if (editingNote) {
        const res = await fetch(`/api/notes/${editingNote.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: editTitle, content: editContent })
        });
        if (res.ok) {
          setNotes(notes.map(n => n.id === editingNote.id ? { ...n, title: editTitle, content: editContent, updatedAt: new Date().toISOString() } : n));
        }
      }
      closeEditor();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes(notes.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const openEditor = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setEditTitle(note.title);
      setEditContent(note.content);
      setIsCreating(false);
    } else {
      setEditingNote(null);
      setEditTitle('');
      setEditContent('');
      setIsCreating(true);
    }
  };

  const closeEditor = () => {
    setEditingNote(null);
    setIsCreating(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto w-full relative">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <StickyNote className="w-8 h-8 text-amber-500" />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Notes</h1>
          </div>
          <p className="mt-2 text-gray-500 text-lg">Jot down quick thoughts and ideas.</p>
        </div>
        {!isCreating && !editingNote && (
          <Button onClick={() => openEditor()} className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md">
            <Plus className="w-4 h-4 mr-2" /> New Note
          </Button>
        )}
      </motion.div>

      {/* Editor Modal / Inline */}
      <AnimatePresence>
        {(isCreating || editingNote) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-10 bg-white rounded-3xl p-6 shadow-xl border border-amber-100 ring-4 ring-amber-50/50"
          >
            <div className="flex justify-between items-center mb-4">
              <input 
                type="text" 
                placeholder="Note Title" 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-2xl font-bold text-gray-900 placeholder:text-gray-300 w-full outline-none bg-transparent"
              />
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={closeEditor} className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <textarea 
              placeholder="Write your note here..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-40 resize-none outline-none text-gray-600 bg-transparent placeholder:text-gray-300"
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md">
                <Save className="w-4 h-4 mr-2" /> Save Note
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      ) : notes.length === 0 && !isCreating ? (
        <div className="text-center py-20 bg-white/50 rounded-3xl border border-gray-100 border-dashed">
          <StickyNote className="w-12 h-12 text-amber-200 mx-auto mb-4" />
          <p className="text-gray-500 italic">No notes yet. Start jotting!</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div 
                key={note.id} 
                variants={item} 
                layout
                className="bg-[#fef9c3] p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow relative group border border-amber-100/50"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => openEditor(note)} className="p-1.5 bg-white/50 hover:bg-white text-gray-600 rounded-full transition-colors shadow-sm">
                    <StickyNote className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-1.5 bg-white/50 hover:bg-white text-rose-500 rounded-full transition-colors shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2 pr-16">{note.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed mb-6">{note.content}</p>
                <div className="text-xs text-amber-700/60 font-medium absolute bottom-5 left-6">
                  {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
