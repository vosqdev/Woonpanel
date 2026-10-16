import React, { useState } from 'react';
import {
  Question,
  QuestionType,
  Survey,
  QuestionOption,
} from '../../types/survey';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit2,
  Eye,
  Check,
  Settings,
  HelpCircle,
  FileQuestion,
  Sliders,
  Star,
  ListOrdered,
  MapPin,
  LayoutTemplate,
} from 'lucide-react';

interface Props {
  survey: Survey;
  onUpdateSurveyQuestions: (surveyId: string, updatedQuestions: Question[]) => void;
  canEdit: boolean;
}

export const SurveyBuilder: React.FC<Props> = ({
  survey,
  onUpdateSurveyQuestions,
  canEdit,
}) => {
  const [questions, setQuestions] = useState<Question[]>(survey.questions);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    questions[0]?.id || null
  );
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New question draft form
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newStepTitle, setNewStepTitle] = useState('Nieuwe stap');
  const [newType, setNewType] = useState<QuestionType>('single_choice');
  const [newRequired, setNewRequired] = useState(true);
  const [newOptionsText, setNewOptionsText] = useState('Optie 1\nOptie 2\nOptie 3');

  const activeQuestion = questions.find((q) => q.id === editingQuestionId);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (!canEdit) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= questions.length) return;

    const updated = [...questions];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setQuestions(updated);
    onUpdateSurveyQuestions(survey.id, updated);
  };

  const handleDelete = (id: string) => {
    if (!canEdit) return;
    if (confirm('Weet je zeker dat je deze vraag wilt verwijderen?')) {
      const updated = questions.filter((q) => q.id !== id);
      setQuestions(updated);
      onUpdateSurveyQuestions(survey.id, updated);
      if (editingQuestionId === id) {
        setEditingQuestionId(updated[0]?.id || null);
      }
    }
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    const parsedOptions: QuestionOption[] = newOptionsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((label, idx) => ({
        id: `opt_${Date.now()}_${idx}`,
        label,
      }));

    const newQ: Question = {
      id: `q_${Date.now()}`,
      stepTitle: newStepTitle || 'Vraag',
      title: newTitle || 'Nieuwe vraag',
      subtitle: newSubtitle || undefined,
      type: newType,
      required: newRequired,
      options:
        newType === 'single_choice' || newType === 'multiple_choice'
          ? parsedOptions
          : undefined,
      min: newType === 'slider' ? 0 : undefined,
      max: newType === 'slider' ? 100 : undefined,
      step: newType === 'slider' ? 5 : undefined,
      unit: newType === 'slider' ? 'm²' : undefined,
      ratingMax: newType === 'rating' ? 5 : undefined,
      ratingType: newType === 'rating' ? 'stars' : undefined,
      rankingItems:
        newType === 'ranking'
          ? [
              { id: 'item_1', label: 'Eerste prioriteit' },
              { id: 'item_2', label: 'Tweede prioriteit' },
              { id: 'item_3', label: 'Derde prioriteit' },
            ]
          : undefined,
    };

    const updated = [...questions, newQ];
    setQuestions(updated);
    onUpdateSurveyQuestions(survey.id, updated);
    setEditingQuestionId(newQ.id);
    setShowAddModal(false);

    // Reset draft form
    setNewTitle('');
    setNewSubtitle('');
    setNewOptionsText('Optie 1\nOptie 2\nOptie 3');
  };

  const updateActiveField = (field: keyof Question, value: any) => {
    if (!canEdit || !editingQuestionId) return;
    const updated = questions.map((q) => {
      if (q.id === editingQuestionId) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setQuestions(updated);
    onUpdateSurveyQuestions(survey.id, updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
            Vragenlijst configurator
          </span>
          <h2 className="text-xl font-bold text-[#171717] mt-0.5">
            {survey.title}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {questions.length} actieve vragen · Categorie:{' '}
            <strong className="capitalize">{survey.category}</strong>
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#171717] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C4F000]" />
            <span>Nieuwe vraag toevoegen</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Questions List / Reordering */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider px-1">
            Volgorde & Overzicht ({questions.length})
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isActive = q.id === editingQuestionId;
              return (
                <div
                  key={q.id}
                  onClick={() => setEditingQuestionId(q.id)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-stone-50 border-[#171717] ring-1 ring-[#171717]'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="font-mono text-xs text-stone-400 font-semibold shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {q.title}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="capitalize">{q.type.replace('_', ' ')}</span>
                        <span>·</span>
                        <span>{q.required ? 'Verplicht' : 'Optioneel'}</span>
                      </div>
                    </div>
                  </div>

                  {canEdit && (
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-stone-200 rounded text-stone-600 disabled:opacity-20 cursor-pointer"
                        title="Omhoog verplaatsen"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === questions.length - 1}
                        className="p-1 hover:bg-stone-200 rounded text-stone-600 disabled:opacity-20 cursor-pointer"
                        title="Omlaag verplaatsen"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded cursor-pointer ml-1"
                        title="Verwijderen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Question Editor & Live Preview */}
        <div className="lg:col-span-7 space-y-6">
          {activeQuestion ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-stone-700" />
                  <h3 className="text-sm font-bold text-stone-900">
                    Vraag eigenschappen wijzigen
                  </h3>
                </div>
                {!canEdit && (
                  <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Alleen-lezen weergave
                  </span>
                )}
              </div>

              {/* Form fields */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Stapnaam / Rubriek
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={activeQuestion.stepTitle}
                    onChange={(e) => updateActiveField('stepTitle', e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#171717] disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Hoofdvraag
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={activeQuestion.title}
                    onChange={(e) => updateActiveField('title', e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#171717] disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Toelichting / Subtitel (optioneel)
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={activeQuestion.subtitle || ''}
                    onChange={(e) => updateActiveField('subtitle', e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#171717] disabled:opacity-75"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Type vraag
                    </label>
                    <select
                      disabled={!canEdit}
                      value={activeQuestion.type}
                      onChange={(e) => updateActiveField('type', e.target.value as QuestionType)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#171717] disabled:opacity-75"
                    >
                      <option value="single_choice">Enkele keuze (Radio)</option>
                      <option value="multiple_choice">Meerdere keuzes (Checkbox)</option>
                      <option value="slider">Schuifregelaar (Slider)</option>
                      <option value="rating">Waardering (Sterren / Cijfer)</option>
                      <option value="ranking">Rangschikking (Prioriteiten)</option>
                      <option value="scenario">Scenariovergelijking</option>
                      <option value="map">Kaartparticipatie (Pin)</option>
                      <option value="text">Open tekstveld</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={!canEdit}
                        checked={activeQuestion.required}
                        onChange={(e) => updateActiveField('required', e.target.checked)}
                        className="w-4 h-4 rounded text-[#171717] accent-[#171717]"
                      />
                      <span className="font-semibold text-stone-800">Verplichte vraag</span>
                    </label>
                  </div>
                </div>

                {/* Options list for choice questions */}
                {(activeQuestion.type === 'single_choice' || activeQuestion.type === 'multiple_choice') && (
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Antwoordopties ({activeQuestion.options?.length || 0})
                    </label>
                    <div className="space-y-2">
                      {activeQuestion.options?.map((opt, optIdx) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            disabled={!canEdit}
                            value={opt.label}
                            onChange={(e) => {
                              const newOpts = [...(activeQuestion.options || [])];
                              newOpts[optIdx] = { ...newOpts[optIdx], label: e.target.value };
                              updateActiveField('options', newOpts);
                            }}
                            className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 disabled:opacity-75"
                          />
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => {
                                const newOpts = (activeQuestion.options || []).filter((_, i) => i !== optIdx);
                                updateActiveField('options', newOpts);
                              }}
                              className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => {
                            const newOpts = [
                              ...(activeQuestion.options || []),
                              { id: `opt_${Date.now()}`, label: 'Nieuwe optie' },
                            ];
                            updateActiveField('options', newOpts);
                          }}
                          className="text-xs font-semibold text-[#171717] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Optie toevoegen</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Preview Box */}
              <div className="pt-6 border-t border-stone-100">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 mb-3">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live voorbeeld (Hoe de inwoner het ziet)</span>
                </div>
                <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-3">
                  <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                    {activeQuestion.stepTitle}
                  </div>
                  <div className="text-base font-bold text-stone-900">
                    {activeQuestion.title}
                  </div>
                  {activeQuestion.subtitle && (
                    <div className="text-xs text-stone-600">
                      {activeQuestion.subtitle}
                    </div>
                  )}

                  <div className="pt-2 text-xs text-stone-500">
                    {activeQuestion.type === 'single_choice' && (
                      <div className="space-y-1.5">
                        {activeQuestion.options?.slice(0, 3).map((o) => (
                          <div key={o.id} className="p-2.5 bg-white rounded-lg border border-stone-200">
                            {o.label}
                          </div>
                        ))}
                      </div>
                    )}
                    {activeQuestion.type === 'slider' && (
                      <div className="p-3 bg-white rounded-lg border border-stone-200 text-center font-mono">
                        Schuifregelaar: 0 t/m 100 {activeQuestion.unit || ''}
                      </div>
                    )}
                    {activeQuestion.type === 'rating' && (
                      <div className="p-3 bg-white rounded-lg border border-stone-200 text-center">
                        ★★★★★ 5-sterren waardering
                      </div>
                    )}
                    {activeQuestion.type === 'ranking' && (
                      <div className="p-3 bg-white rounded-lg border border-stone-200 text-center font-mono">
                        #1 t/m #5 Prioriteiten rangschikken
                      </div>
                    )}
                    {activeQuestion.type === 'scenario' && (
                      <div className="p-3 bg-white rounded-lg border border-stone-200 text-center">
                        3 Ontwikkelscenario kaarten
                      </div>
                    )}
                    {activeQuestion.type === 'map' && (
                      <div className="p-3 bg-white rounded-lg border border-stone-200 text-center">
                        Interactieve buurtkaart met pin placement
                      </div>
                    )}
                    {activeQuestion.type === 'text' && (
                      <div className="p-3 bg-white rounded-lg border border-stone-200 text-stone-400 italic">
                        Open tekstinvoer...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 text-xs">
              Selecteer links een vraag om eigenschappen te bewerken.
            </div>
          )}
        </div>
      </div>

      {/* Add New Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-stone-200 shadow-2xl">
            <h3 className="text-lg font-bold text-[#171717]">
              Nieuwe vraag toevoegen
            </h3>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Stapnaam / Rubriek
                </label>
                <input
                  type="text"
                  required
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  placeholder="Bijv. Stap 3: Betaalbaarheid"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Hoofdvraag
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Wat is jouw mening over...?"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Vraagtype
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as QuestionType)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                >
                  <option value="single_choice">Enkele keuze (Radio)</option>
                  <option value="multiple_choice">Meerdere keuzes (Checkbox)</option>
                  <option value="slider">Schuifregelaar (Slider)</option>
                  <option value="rating">Waardering (Sterren)</option>
                  <option value="ranking">Prioriteiten rangschikken</option>
                  <option value="text">Open tekstveld</option>
                </select>
              </div>

              {(newType === 'single_choice' || newType === 'multiple_choice') && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Antwoordopties (één per regel)
                  </label>
                  <textarea
                    rows={4}
                    value={newOptionsText}
                    onChange={(e) => setNewOptionsText(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="req_check"
                  checked={newRequired}
                  onChange={(e) => setNewRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-[#171717] accent-[#171717]"
                />
                <label htmlFor="req_check" className="font-semibold text-stone-800">
                  Verplichte vraag voor afronding
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#171717] hover:bg-black text-white font-bold rounded-xl"
                >
                  Vraag toevoegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
