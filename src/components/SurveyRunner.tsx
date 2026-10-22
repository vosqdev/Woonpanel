import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Survey,
  Question,
  SurveySubmission,
  WoonscanSummary,
} from '../types/survey';
import { SingleChoiceQuestion } from './questions/SingleChoiceQuestion';
import { MultipleChoiceQuestion } from './questions/MultipleChoiceQuestion';
import { SliderQuestion } from './questions/SliderQuestion';
import { RatingQuestion } from './questions/RatingQuestion';
import { RankingQuestion } from './questions/RankingQuestion';
import { ScenarioQuestion } from './questions/ScenarioQuestion';
import { MapQuestion } from './questions/MapQuestion';
import { TextQuestion } from './questions/TextQuestion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Save,
  ShieldCheck,
  Sparkles,
  BarChart3,
  RotateCcw,
} from 'lucide-react';

interface SurveyRunnerProps {
  survey: Survey;
  onBackToHome: () => void;
  onFinishSubmission: (submission: SurveySubmission, woonscanSummary?: WoonscanSummary) => void;
  onViewWoonscanReport?: (summary: WoonscanSummary) => void;
}

export const SurveyRunner: React.FC<SurveyRunnerProps> = ({
  survey,
  onBackToHome,
  onFinishSubmission,
  onViewWoonscanReport,
}) => {
  const storageKey = `woondata_survey_${survey.id}`;

  // State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {};
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [calculatedSummary, setCalculatedSummary] = useState<WoonscanSummary | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('Opgeslagen');

  // Filter questions based on conditional logic
  const activeQuestions = useMemo(() => {
    return survey.questions.filter((q) => {
      if (!q.condition) return true;
      const { questionId, operator, value } = q.condition;
      const answeredVal = answers[questionId];

      if (operator === 'equals') return answeredVal === value;
      if (operator === 'not_equals') return answeredVal !== value;
      if (operator === 'contains') {
        if (Array.isArray(answeredVal)) return answeredVal.includes(value);
        return String(answeredVal).includes(String(value));
      }
      return true;
    });
  }, [survey.questions, answers]);

  // Current active question
  const currentQuestion: Question | undefined = activeQuestions[currentIndex];

  // Save to local storage on answer change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(answers));
      setSaveStatus('Voortgang bewaard');
      const timer = setTimeout(() => setSaveStatus('Opgeslagen'), 1500);
      return () => clearTimeout(timer);
    } catch (e) {
      // ignore
    }
  }, [answers, storageKey]);

  // Progress percentage
  const total = activeQuestions.length;
  const progressPercent = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;
  const estimatedMinutesRemaining = Math.max(
    1,
    Math.ceil(((total - currentIndex) / total) * survey.durationMinutes)
  );

  const handleAnswerChange = (val: any) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete survey
      handleSubmitSurvey();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const calculateWoonscanScores = (ans: Record<string, any>): WoonscanSummary => {
    // Generate nuanced indicative scores from answers
    const comfortRating = ((ans['ws_2_comfort_geluid'] || 3) + (ans['ws_2_comfort_temperatuur'] || 3) + (ans['ws_2_comfort_onderhoud'] || 3)) / 15 * 100;
    
    // Betaalbaarheid
    const betaalbaarheidRating = ans['ws_3_maandlasten_ervaring'] === 'goed_betaalbaar' ? 90 :
      ans['ws_3_maandlasten_ervaring'] === 'redelijk_betaalbaar' ? 74 :
      ans['ws_3_maandlasten_ervaring'] === 'zwaar' ? 45 : 30;

    // Energie
    const label = ans['ws_3_energielabel'];
    const energieRating = label === 'label_a_plus' ? 95 :
      label === 'label_a' ? 82 :
      label === 'label_b_c' ? 68 :
      label === 'label_d_e' ? 48 :
      label === 'label_f_g' ? 28 : 55;

    // Leefomgeving
    const leefomgevingRating = ((ans['ws_4_buurt_veiligheid'] || 4) + (ans['ws_4_buurt_groen_voorzieningen'] || 4)) / 10 * 100;

    // Toekomstbestendigheid
    const toekomst = ans['ws_5_toekomstbestendigheid'];
    const toekomstRating = toekomst === 'ja_volledig' ? 92 :
      toekomst === 'met_kleine_aanpassingen' ? 68 : 38;

    const overall = Math.round((comfortRating + betaalbaarheidRating + energieRating + leefomgevingRating + toekomstRating) / 5);

    return {
      overallScore: overall,
      categories: {
        comfort: {
          category: 'Wooncomfort',
          score: Math.round(comfortRating),
          label: comfortRating > 75 ? 'Uitstekend' : comfortRating > 55 ? 'Voldoende' : 'Aandachtspunt',
          benchmarkScore: 74,
          insight: 'Geluids- en temperatuurregulering bepalen het dagelijkse welzijn in de woning.',
          tips: ['Controleer kierdichting rond ramen', 'Overweeg ventilatieroosters met geluidsdemping'],
        },
        betaalbaarheid: {
          category: 'Betaalbaarheid',
          score: Math.round(betaalbaarheidRating),
          label: betaalbaarheidRating > 75 ? 'Gezond' : betaalbaarheidRating > 50 ? 'Gemiddeld' : 'Hoge lastendruk',
          benchmarkScore: 68,
          insight: 'Verhouding tussen inkomen, woonlasten en energiekosten.',
          tips: ['Bekijk gemeentelijke energietoeslagen en isolatiesubsidies', 'Vergelijk vaste energiecontracten'],
        },
        energie: {
          category: 'Energie & Duurzaamheid',
          score: Math.round(energieRating),
          label: energieRating > 75 ? 'Duurzaam / A-klasse' : energieRating > 50 ? 'Matig' : 'Verbeterpotentieel',
          benchmarkScore: 62,
          insight: 'Isolatiewaarde en installatietype bepalen het energieverbruik.',
          tips: ['ISDE-subsidie voor glasisolatie en warmtepomp beschikbaar', 'Laat een warmtescan uitvoeren'],
        },
        leefomgeving: {
          category: 'Buurt & Leefomgeving',
          score: Math.round(leefomgevingRating),
          label: leefomgevingRating > 75 ? 'Zeer prettig' : leefomgevingRating > 55 ? 'Goed' : 'Verbetering gewenst',
          benchmarkScore: 76,
          insight: 'Veiligheid, groenvoorzieningen en bereikbaarheid in jouw directe woonomgeving.',
          tips: ['Neem deel aan buurtparticipatie', 'Sluit aan bij buurtpreventie of groeninitiatieven'],
        },
        toekomstbestendigheid: {
          category: 'Toekomstbestendigheid',
          score: Math.round(toekomstRating),
          label: toekomstRating > 75 ? 'Klaar voor later' : toekomstRating > 50 ? 'Aanpassingen nodig' : 'Minder geschikt',
          benchmarkScore: 64,
          insight: 'Toegankelijkheid bij verminderde mobiliteit en aanpasbaarheid van ruimtes.',
          tips: ['Bekijk drempelhulp en inloopdouche mogelijkheden', 'Informeer naar Blijverslening bij jouw gemeente'],
        },
      },
      keyFindings: [
        'Jouw leefomgeving en veiligheidsgevoel scoren positief.',
        energieRating < 60 ? 'Energielasten en isolatie vormen het belangrijkste verbeterpunt.' : 'Energie-efficiëntie is bovengemiddeld goed op orde.',
        toekomstRating < 60 ? 'Woning heeft aanpassingen nodig voor langdurig zelfstandig wonen.' : 'Woning is goed toegankelijk ingericht.',
      ],
    };
  };

  const handleSubmitSurvey = () => {
    let summary: WoonscanSummary | undefined;
    if (survey.category === 'woonscan') {
      summary = calculateWoonscanScores(answers);
      setCalculatedSummary(summary);
    }

    const submission: SurveySubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      surveyId: survey.id,
      category: survey.category,
      submittedAt: new Date().toISOString(),
      anonymousRespondentId: `resp_hash_${Math.random().toString(36).substring(2, 9)}`,
      cbsBuurtCode: survey.location.cbsCode,
      answers,
    };

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C4F000', '#171717', '#10B981', '#3B82F6'],
      });
    } catch (e) {
      // ignore
    }

    setIsCompleted(true);
    onFinishSubmission(submission, summary);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      // ignore
    }
  };

  // Has answered current question
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isAnswered = useMemo(() => {
    if (currentAnswer === undefined || currentAnswer === null || currentAnswer === '') {
      return false;
    }
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.length > 0;
    }
    if (currentQuestion?.type === 'scenario') {
      return Boolean(currentAnswer?.selectedScenarioId);
    }
    if (currentQuestion?.type === 'map') {
      return currentAnswer?.x !== undefined;
    }
    if (typeof currentAnswer === 'object') {
      if ('choice' in currentAnswer) {
        return Boolean(currentAnswer.choice);
      }
      return Object.keys(currentAnswer).length > 0;
    }
    return true;
  }, [currentAnswer, currentQuestion?.type]);

  const canProceed = !currentQuestion?.required || isAnswered;

  // Completion View (Required by prompt D)
  if (isCompleted) {
    return (
      <main className="min-h-[75vh] py-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-[#C4F000] text-[#171717] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          {/* Required Exact Title */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight mb-4">
            Bedankt! Jouw mening helpt wonen vooruit.
          </h2>

          {/* Required Exact Subtitle */}
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Dankzij jouw bijdrage krijgen we beter inzicht in hoe inwoners willen wonen en wat zij belangrijk vinden in hun leefomgeving.
          </p>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 mb-8 max-w-md mx-auto flex items-center gap-2.5 text-left">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Jouw antwoorden zijn anoniem opgeslagen conform de AVG en gekoppeld aan regio <strong>{survey.location.city}</strong>.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {survey.category === 'woonscan' && calculatedSummary && onViewWoonscanReport && (
              <button
                onClick={() => onViewWoonscanReport(calculatedSummary)}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#C4F000] hover:bg-[#b5de00] text-[#171717] font-bold text-sm rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bekijk jouw persoonlijke Woonscan rapport</span>
              </button>
            )}

            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#171717] hover:bg-black text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Bekijk andere onderzoeken
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="max-w-2xl mx-auto py-20 px-4 text-center">
        <p className="text-stone-600">Vragenlijst laden...</p>
        <button
          onClick={onBackToHome}
          className="mt-4 px-4 py-2 bg-[#171717] text-white rounded-lg text-xs"
        >
          Terug naar overzicht
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Top Header: Navigation back & Title */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Onderzoek verlaten</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-stone-500 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Nog circa {estimatedMinutesRemaining} min</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-stone-500">
              <Save className="w-3 h-3 text-emerald-600" />
              <span>{saveStatus}</span>
            </span>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem(storageKey);
                } catch (e) {}
                setAnswers({});
                setCurrentIndex(0);
              }}
              className="flex items-center gap-1 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
              title="Vragenlijst opnieuw starten"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Herstarten</span>
            </button>
          </div>
        </div>

        {/* Survey Title & Step Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1 font-medium">
            <span className="uppercase tracking-wider font-semibold text-stone-700">
              {currentQuestion.stepTitle}
            </span>
            <span className="font-mono tabular-nums">
              Vraag {currentIndex + 1} van {total} ({progressPercent}%)
            </span>
          </div>

          {/* Progress Bar (Required in #C4F000 lime green) */}
          <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#171717] transition-all duration-300 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-[#C4F000]"></div>
            </div>
          </div>
        </div>

        {/* Question Card Box */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs mb-8 transition-all">
          <div className="mb-8">
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717] leading-snug tracking-tight">
                {currentQuestion.title}
              </h2>
              {!currentQuestion.required && (
                <span className="text-xs font-medium text-stone-400 shrink-0">
                  (Optioneel)
                </span>
              )}
            </div>

            {currentQuestion.subtitle && (
              <p className="text-sm text-stone-600 leading-relaxed">
                {currentQuestion.subtitle}
              </p>
            )}
          </div>

          {/* Question Dynamic Widget Component */}
          <div className="py-2">
            {currentQuestion.type === 'single_choice' && (
              <SingleChoiceQuestion
                question={currentQuestion}
                value={currentAnswer}
                onChange={handleAnswerChange}
              />
            )}

            {currentQuestion.type === 'multiple_choice' && (
              <MultipleChoiceQuestion
                question={currentQuestion}
                value={currentAnswer}
                onChange={handleAnswerChange}
              />
            )}

            {currentQuestion.type === 'slider' && (
              <SliderQuestion
                question={currentQuestion}
                value={currentAnswer}
                onChange={handleAnswerChange}
              />
            )}

            {currentQuestion.type === 'rating' && (
              <RatingQuestion
                question={currentQuestion}
                value={currentAnswer}
                onChange={handleAnswerChange}
              />
            )}

            {currentQuestion.type === 'ranking' && (
              <RankingQuestion
                question={currentQuestion}
                value={currentAnswer}
                onChange={handleAnswerChange}
              />
            )}

            {currentQuestion.type === 'scenario' && (
              <ScenarioQuestion
                question={currentQuestion}
                value={currentAnswer}
                onChange={handleAnswerChange}
              />
            )}

            {currentQuestion.type === 'map' && (
              <MapQuestion
                question={currentQuestion}
                value={currentAnswer}
                onChange={handleAnswerChange}
              />
            )}

            {currentQuestion.type === 'text' && (
              <TextQuestion
                question={currentQuestion}
                value={currentAnswer}
                onChange={handleAnswerChange}
              />
            )}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              currentIndex === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Vorige vraag</span>
          </button>

          <div className="flex items-center gap-3">
            {!currentQuestion.required && !isAnswered && (
              <button
                type="button"
                onClick={handleSkip}
                className="px-4 py-3 text-sm font-medium text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Vraag overslaan
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                canProceed
                  ? 'bg-[#171717] hover:bg-black text-white shadow-xs active:scale-[0.99]'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>
                {currentIndex === activeQuestions.length - 1
                  ? 'Afronden & versturen'
                  : 'Volgende vraag'}
              </span>
              <ArrowRight
                className={`w-4 h-4 ${canProceed ? 'text-[#C4F000]' : 'text-stone-400'}`}
              />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
