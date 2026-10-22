import React, { useState, useEffect } from 'react';
import { Question } from '../../types/survey';
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';

interface Props {
  question: Question;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

export const RankingQuestion: React.FC<Props> = ({ question, value, onChange }) => {
  const initialItems = question.rankingItems ?? [];
  const [orderedIds, setOrderedIds] = useState<string[]>(() => {
    if (value && value.length === initialItems.length) return value;
    return initialItems.map((i) => i.id);
  });

  useEffect(() => {
    if (value && value.length === initialItems.length) {
      setOrderedIds(value);
    } else if (!value || value.length === 0) {
      const defaultIds = initialItems.map((i) => i.id);
      setOrderedIds(defaultIds);
      onChange(defaultIds);
    }
  }, [value, initialItems]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedIds.length) return;

    const newOrder = [...orderedIds];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    setOrderedIds(newOrder);
    onChange(newOrder);
  };

  const getItemLabel = (id: string) => {
    const found = initialItems.find((i) => i.id === id);
    return found ? found.label : id;
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-stone-500 font-medium">
        Gebruik de pijltjes om jouw belangrijkste prioriteit op positie 1 te zetten.
      </div>

      <div className="space-y-2.5">
        {orderedIds.map((id, index) => {
          const isTop = index === 0;
          return (
            <div
              key={id}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                isTop
                  ? 'bg-stone-50 border-[#171717] ring-1 ring-[#171717]'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank number badge */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isTop
                      ? 'bg-[#171717] text-[#C4F000]'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  #{index + 1}
                </div>

                <div className="text-sm font-semibold text-stone-900 leading-snug">
                  {getItemLabel(id)}
                </div>
              </div>

              {/* Up / Down Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-md hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent text-stone-700 cursor-pointer"
                  title="Omhoog verplaatsen"
                  aria-label="Omhoog verplaatsen"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === orderedIds.length - 1}
                  className="p-1.5 rounded-md hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent text-stone-700 cursor-pointer"
                  title="Omlaag verplaatsen"
                  aria-label="Omlaag verplaatsen"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
