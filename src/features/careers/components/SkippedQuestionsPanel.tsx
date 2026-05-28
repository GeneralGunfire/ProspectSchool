import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ChevronDown } from 'lucide-react';

interface SkippedQuestionsPanelProps {
  isOpen: boolean;
  skippedQuestions: { id: string; question: string; index: number }[];
  onClose: () => void;
  onSelectQuestion: (questionIndex: number) => void;
}

export function SkippedQuestionsPanel({
  isOpen,
  skippedQuestions,
  onClose,
  onSelectQuestion,
}: SkippedQuestionsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white z-50 flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                Skipped Questions
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-slate-900" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {skippedQuestions.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {skippedQuestions.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Q{item.index + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-700 line-clamp-2">
                            {item.question}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            onSelectQuestion(item.index);
                            onClose();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/10 hover:bg-slate-900/20 text-slate-500 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                        >
                          Go to Question
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No skipped questions</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                {skippedQuestions.length} Question{skippedQuestions.length !== 1 ? 's' : ''} Skipped
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
