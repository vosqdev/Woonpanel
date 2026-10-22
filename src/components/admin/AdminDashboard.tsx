import React, { useState, useEffect } from 'react';
import {
  Survey,
  SurveyCategory,
  SurveyStatus,
  AdminUser,
  Question,
} from '../../types/survey';
import { SurveyBuilder } from './SurveyBuilder';
import { AnalyticsView } from './AnalyticsView';
import { WoondataSyncView } from './WoondataSyncView';
import { SurveyList } from '../SurveyList';
import { WoonpanelLogo } from '../WoonpanelLogo';
import {
  LayoutDashboard,
  FileQuestion,
  BarChart3,
  Database,
  Plus,
  Users,
  LogOut,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';

interface Props {
  surveys: Survey[];
  adminUser: AdminUser;
  initialTab?: 'overview' | 'catalog' | 'builder' | 'analytics' | 'sync';
  onLogout: () => void;
  onBackToSite: () => void;
  onUpdateSurveyQuestions: (surveyId: string, updatedQuestions: Question[]) => void;
  onCreateSurvey: (newSurvey: Survey) => void;
  onStartSurvey?: (survey: Survey) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  surveys,
  adminUser,
  initialTab = 'overview',
  onLogout,
  onBackToSite,
  onUpdateSurveyQuestions,
  onCreateSurvey,
  onStartSurvey,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'builder' | 'analytics' | 'sync'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [panelMembers, setPanelMembers] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('woondata_panel_members');
      if (stored) {
        setPanelMembers(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, [activeTab]);

  const [selectedBuilderSurveyId, setSelectedBuilderSurveyId] = useState<string>(
    surveys[0]?.id || ''
  );
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Survey Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SurveyCategory>('woonwensen');
  const [newDescription, setNewDescription] = useState('');
  const [newMunicipality, setNewMunicipality] = useState('Gemeente Utrecht');
  const [newCity, setNewCity] = useState('Utrecht');
  const [newCbsCode, setNewCbsCode] = useState('GM0344');
  const [newDistrict, setNewDistrict] = useState('');
  const [newDuration, setNewDuration] = useState(5);
  const [newTargetAudience, setNewTargetAudience] = useState('Inwoners en woningzoekenden');
  const [newStartDate, setNewStartDate] = useState('2026-04-01');
  const [newEndDate, setNewEndDate] = useState('2026-10-31');
  const [newIsOfficial, setNewIsOfficial] = useState(false);
  const [newCommissioner, setNewCommissioner] = useState('');

  const canEdit = adminUser.role === 'super_admin' || adminUser.role === 'research_admin';

  const builderSurvey = surveys.find((s) => s.id === selectedBuilderSurveyId) || surveys[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    const created: Survey = {
      id: `survey-${newCategory}-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: newCategory,
      description: newDescription,
      durationMinutes: Number(newDuration),
      targetAudience: newTargetAudience,
      location: {
        municipality: newMunicipality,
        city: newCity,
        district: newDistrict || undefined,
        cbsCode: newCbsCode,
      },
      startDate: newStartDate,
      endDate: newEndDate,
      status: 'active',
      participantCount: 0,
      isOfficialParticipation: newIsOfficial,
      commissioner: newCommissioner || undefined,
      questions: [
        {
          id: `q_${Date.now()}_1`,
          stepTitle: 'Stap 1: Algemeen',
          title: 'Wat is jouw woonsituatie?',
          type: 'single_choice',
          required: true,
          options: [
            { id: 'huur', label: 'Huurwoning' },
            { id: 'koop', label: 'Koopwoning' },
          ],
        },
      ],
    };

    onCreateSurvey(created);
    setShowCreateModal(false);
    setSelectedBuilderSurveyId(created.id);
    setActiveTab('builder');

    // Reset
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-stone-900 pb-20">
      {/* Top Admin Navigation Header */}
      <div className="bg-[#171717] text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <WoonpanelLogo variant="dark" size="sm" subtitleText="BEHEEROMGEVING" />
            <div className="flex items-center gap-2">
              <span className="text-stone-500 hidden sm:inline">·</span>
              <span className="text-xs text-[#C4F000] font-mono hidden sm:inline">
                {adminUser.role === 'super_admin'
                  ? 'Super Admin Rechten'
                  : adminUser.role === 'research_admin'
                  ? 'Onderzoeksbeheerder'
                  : 'Kijkersrol (Alleen-Lezen)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden md:flex flex-col text-right">
              <span className="font-semibold text-white">{adminUser.name}</span>
              <span className="text-[11px] text-stone-400">{adminUser.organization}</span>
            </div>

            <button
              onClick={onBackToSite}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg cursor-pointer"
            >
              Publiekswebsite
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
              title="Uitloggen"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#C4F000] text-white'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overzicht</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-[#C4F000] text-white'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Onderzoeken Catalogus & Filters</span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'builder'
                ? 'border-[#C4F000] text-white'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileQuestion className="w-4 h-4" />
            <span>Vragenlijstbouwer</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-[#C4F000] text-white'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Resultaten & Statistieken</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sync'
                ? 'border-[#C4F000] text-white'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Database className="w-4 h-4 text-[#C4F000]" />
            <span>Woondata.com Koppeling</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top metrics summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
                <div className="text-xs text-stone-500 font-medium">Actieve Onderzoeken</div>
                <div className="text-3xl font-extrabold font-mono text-[#171717] tabular-nums mt-1">
                  {surveys.filter((s) => s.status === 'active').length}
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  {surveys.length} totaal in beheer
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
                <div className="text-xs text-stone-500 font-medium">Totaal Ingevulde Enquêtes</div>
                <div className="text-3xl font-extrabold font-mono text-[#171717] tabular-nums mt-1">
                  {surveys.reduce((acc, s) => acc + s.participantCount, 0).toLocaleString('nl-NL')}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-1">
                  +1.420 afgelopen 30 dagen
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
                <div className="text-xs text-stone-500 font-medium">Gemiddeld Responspercentage</div>
                <div className="text-3xl font-extrabold font-mono text-[#171717] tabular-nums mt-1">
                  88.6%
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  Afronding na start
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
                <div className="text-xs text-stone-500 font-medium">Gegevenskwaliteit & Privacy</div>
                <div className="text-base font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
                  <Shield className="w-5 h-5" />
                  <span>100% AVG Compliant</span>
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  K-anonimiteit actief
                </div>
              </div>
            </div>

            {/* Surveys Management Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#171717]">
                    Alle Onderzoeken in de Database
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Beheer publicatiestatus, doelgroepen en configuraties
                  </p>
                </div>

                {canEdit && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2.5 bg-[#171717] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4 text-[#C4F000]" />
                    <span>Nieuw onderzoek aanmaken</span>
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-mono border-b border-stone-200">
                    <tr>
                      <th className="py-3.5 px-6">Titel & Gebied</th>
                      <th className="py-3.5 px-4">Categorie</th>
                      <th className="py-3.5 px-4">Onderzoeksperiode</th>
                      <th className="py-3.5 px-4">Respons</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-6 text-right">Acties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {surveys.map((survey) => (
                      <tr key={survey.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-stone-900 text-sm">
                            {survey.title}
                          </div>
                          <div className="text-stone-500 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{survey.location.municipality}</span>
                            {survey.location.cbsCode && (
                              <span className="font-mono text-stone-400">({survey.location.cbsCode})</span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-semibold capitalize text-stone-900">
                            {survey.category}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-mono text-[11px] text-stone-600">
                          {survey.startDate} t/m {survey.endDate}
                        </td>

                        <td className="py-4 px-4 font-mono font-semibold tabular-nums text-stone-900">
                          {survey.participantCount.toLocaleString('nl-NL')}
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-700 font-semibold">
                            {survey.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedBuilderSurveyId(survey.id);
                                setActiveTab('builder');
                              }}
                              className="px-2.5 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md cursor-pointer"
                            >
                              Vragenlijst ({survey.questions.length})
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab('analytics');
                              }}
                              className="px-2.5 py-1.5 text-xs font-semibold bg-[#171717] hover:bg-black text-white rounded-md cursor-pointer"
                            >
                              Resultaten
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Panel Members Submissions Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#171717]">
                      Nieuwe Panelaanmeldingen (Woondata Woonpanel)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#C4F000] text-[#171717]">
                      {panelMembers.length} aangemeld
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Overzicht van recente registraties via het aanmeldformulier op de website
                  </p>
                </div>
              </div>

              {panelMembers.length === 0 ? (
                <div className="p-8 text-center text-stone-500 text-xs">
                  Er zijn nog geen nieuwe aanmeldingen opgeslagen in deze browsersessie. Meld je aan via de knop op de homepage om hier direct je registratie te zien verschijnen.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-mono border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-6">Panellid</th>
                        <th className="py-3 px-6">Locatie</th>
                        <th className="py-3 px-6">Woonsituatie</th>
                        <th className="py-3 px-6">Thema's</th>
                        <th className="py-3 px-6">Datum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {panelMembers.map((m, idx) => (
                        <tr key={m.id || idx} className="hover:bg-stone-50/70">
                          <td className="py-3.5 px-6 font-medium text-[#171717]">
                            <div className="font-bold">{m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'Panellid'}</div>
                            <div className="text-[11px] text-stone-500 font-mono">{m.email}</div>
                          </td>
                          <td className="py-3.5 px-6 text-stone-600">
                            <div>{m.city ? `${m.city} ${m.postalCode ? `(${m.postalCode})` : ''}` : 'Gemeente Dronten'}</div>
                            {m.neighborhood && <div className="text-[11px] text-stone-400">{m.neighborhood}</div>}
                          </td>
                          <td className="py-3.5 px-6 text-stone-600">
                            {m.housingType ? (
                              <><span className="capitalize">{m.housingType?.replace('_', ' ')}</span> · {m.ageCategory} jr</>
                            ) : (
                              <span className="text-stone-400">Inwoner / Panellid</span>
                            )}
                          </td>
                          <td className="py-3.5 px-6 text-stone-600">
                            {m.newsletterOptIn !== false ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-semibold">
                                Updates actief
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-mono">
                                Geen updates
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-6 text-stone-500 font-mono text-[11px]">
                            {m.registeredAt ? new Date(m.registeredAt).toLocaleDateString('nl-NL') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CATALOG / ONDERZOEKEN MET FILTERS */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <SurveyList
              surveys={surveys}
              onStartSurvey={(s) => {
                if (onStartSurvey) {
                  onStartSurvey(s);
                } else {
                  setSelectedBuilderSurveyId(s.id);
                  setActiveTab('builder');
                }
              }}
            />
          </div>
        )}

        {/* TAB 3: BUILDER */}
        {activeTab === 'builder' && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <label className="text-xs font-semibold text-stone-600">Selecteer onderzoek om te bewerken:</label>
              <select
                value={selectedBuilderSurveyId}
                onChange={(e) => setSelectedBuilderSurveyId(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-stone-900"
              >
                {surveys.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.location.city})
                  </option>
                ))}
              </select>
            </div>

            <SurveyBuilder
              survey={builderSurvey}
              onUpdateSurveyQuestions={onUpdateSurveyQuestions}
              canEdit={canEdit}
            />
          </div>
        )}

        {/* TAB 3: ANALYTICS */}
        {activeTab === 'analytics' && <AnalyticsView surveys={surveys} />}

        {/* TAB 4: WOONDATA SYNC */}
        {activeTab === 'sync' && <WoondataSyncView />}
      </main>

      {/* Create Survey Modal (Section I requirement) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-stone-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
                Nieuw onderzoek inrichten
              </span>
              <h3 className="text-xl font-bold text-[#171717] mt-1">
                Onderzoek Aanmaken
              </h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Titel van het onderzoek
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Bijv. Woonvisie Participatie 2026-2035"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Categorie
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as SurveyCategory)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold"
                  >
                    <option value="woonwensen">Woonwensen (Toekomstig wonen)</option>
                    <option value="woonscan">Woonscan (Huidige situatie)</option>
                    <option value="woonopinie">Woonopinie (Gebiedsontwikkeling)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Geschatte invulduur (minuten)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Korte omschrijving & doelstelling
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Beschrijf waarom dit onderzoek wordt gehouden en wat er met de uitkomsten gebeurt..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              {/* Geographic specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Gemeente
                  </label>
                  <input
                    type="text"
                    required
                    value={newMunicipality}
                    onChange={(e) => setNewMunicipality(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Woonplaats / Stad
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    CBS Gemeente- of Buurtcode
                  </label>
                  <input
                    type="text"
                    required
                    value={newCbsCode}
                    onChange={(e) => setNewCbsCode(e.target.value)}
                    placeholder="Bijv. GM0344 of BU03440810"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Startdatum
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Einddatum
                  </label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsOfficial}
                    onChange={(e) => setNewIsOfficial(e.target.checked)}
                    className="w-4 h-4 rounded text-[#171717] accent-[#171717]"
                  />
                  <span className="font-semibold text-stone-800">
                    Officieel gemeentelijk participatietraject (formeel inspraakverslag)
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#171717] hover:bg-black text-white font-bold rounded-xl cursor-pointer"
                >
                  Onderzoek publiceren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
