import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Calendar, ArrowRight, CheckCircle2, Building2, Lock } from 'lucide-react';
import { Survey, SurveyCategory, SurveyStatus } from '../types/survey';

interface SurveyListProps {
  surveys: Survey[];
  onStartSurvey: (survey: Survey) => void;
  onOpenAdminLogin?: () => void;
  selectedCategoryFilter?: SurveyCategory | 'all';
}

export const SurveyList: React.FC<SurveyListProps> = ({
  surveys,
  onStartSurvey,
  onOpenAdminLogin,
  selectedCategoryFilter = 'all',
}) => {
  const [categoryFilter, setCategoryFilter] = useState<SurveyCategory | 'all'>(selectedCategoryFilter);
  const [municipalityFilter, setMunicipalityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<SurveyStatus | 'all'>('all');
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique municipalities for filter
  const municipalities = useMemo(() => {
    const list = new Set<string>();
    surveys.forEach((s) => {
      if (s.location.municipality) list.add(s.location.municipality);
    });
    return Array.from(list);
  }, [surveys]);

  const filteredSurveys = useMemo(() => {
    return surveys.filter((s) => {
      // Category filter
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      // Municipality filter
      if (municipalityFilter !== 'all' && s.location.municipality !== municipalityFilter) return false;
      // Status filter
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      // Duration filter
      if (durationFilter === '<5' && s.durationMinutes > 5) return false;
      if (durationFilter === '5-10' && (s.durationMinutes < 5 || s.durationMinutes > 10)) return false;
      if (durationFilter === '>10' && s.durationMinutes <= 10) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(query);
        const matchesDesc = s.description.toLowerCase().includes(query);
        const matchesLoc =
          s.location.city.toLowerCase().includes(query) ||
          s.location.municipality.toLowerCase().includes(query) ||
          (s.location.cbsCode && s.location.cbsCode.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }
      return true;
    });
  }, [surveys, categoryFilter, municipalityFilter, statusFilter, durationFilter, searchQuery]);

  return (
    <section id="onderzoeken-overzicht" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Actueel aanbod · Bewonersparticipatie
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            Onderzoeken bij jou in de buurt
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Vind actieve onderzoeken voor jouw gemeente, wijk of postcodegebied. Jouw bijdrage wordt direct verwerkt in gemeentelijke beleidsanalyses.
          </p>
        </div>

        {/* Demo environment pill */}
        <div className="text-xs text-stone-500 flex items-center gap-1.5 self-start md:self-auto bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-md font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Database live · Voorbeeldonderzoeken gemarkeerd</span>
        </div>
      </div>

      {/* Filter Bar Controls */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-8 space-y-4 shadow-2xs">
        {/* Top search & quick category tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Zoek op gemeente, wijk, CBS-code of onderwerp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#171717] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                Wis
              </button>
            )}
          </div>

          {/* Category Filter Buttons (Functional Tabs) */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg overflow-x-auto shrink-0">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === 'all'
                  ? 'bg-white text-[#171717] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Alle Categorieën
            </button>
            <button
              onClick={() => setCategoryFilter('woonwensen')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === 'woonwensen'
                  ? 'bg-white text-[#171717] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Woonwensen
            </button>
            <button
              onClick={() => setCategoryFilter('woonscan')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === 'woonscan'
                  ? 'bg-white text-[#171717] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Woonscan
            </button>
            <button
              onClick={() => setCategoryFilter('woonopinie')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === 'woonopinie'
                  ? 'bg-white text-[#171717] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Woonopinie
            </button>
          </div>
        </div>

        {/* Detailed Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-100 text-xs">
          {/* Municipality filter */}
          <div>
            <label className="block text-stone-500 font-medium mb-1">Gemeente / Regio</label>
            <select
              value={municipalityFilter}
              onChange={(e) => setMunicipalityFilter(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-2.5 text-stone-800 text-xs focus:ring-1 focus:ring-[#171717] focus:outline-none"
            >
              <option value="all">Alle gemeenten & regio's</option>
              {municipalities.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-stone-500 font-medium mb-1">Status onderzoek</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-2.5 text-stone-800 text-xs focus:ring-1 focus:ring-[#171717] focus:outline-none"
            >
              <option value="all">Alle statussen</option>
              <option value="active">Actief geopend</option>
              <option value="upcoming">Binnenkort open</option>
              <option value="completed">Afgerond / Rapportage</option>
            </select>
          </div>

          {/* Duration filter */}
          <div>
            <label className="block text-stone-500 font-medium mb-1">Verwachte invulduur</label>
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-2.5 text-stone-800 text-xs focus:ring-1 focus:ring-[#171717] focus:outline-none"
            >
              <option value="all">Alle tijdsduren</option>
              <option value="<5">Kort (&lt; 5 minuten)</option>
              <option value="5-10">Middellang (5 – 10 minuten)</option>
              <option value=">10">Uitgebreid (&gt; 10 minuten)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Filter Reset */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-6">
        <span>
          <strong className="text-stone-900 font-mono font-semibold">{filteredSurveys.length}</strong> onderzoeken gevonden
        </span>
        {(categoryFilter !== 'all' ||
          municipalityFilter !== 'all' ||
          statusFilter !== 'all' ||
          durationFilter !== 'all' ||
          searchQuery) && (
          <button
            onClick={() => {
              setCategoryFilter('all');
              setMunicipalityFilter('all');
              setStatusFilter('all');
              setDurationFilter('all');
              setSearchQuery('');
            }}
            className="text-stone-900 underline hover:text-black cursor-pointer font-medium"
          >
            Filters herstellen
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {filteredSurveys.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <p className="text-stone-700 font-semibold text-base mb-1">
            Geen onderzoeken gevonden met de huidige filters.
          </p>
          <p className="text-stone-500 text-xs mb-4">
            Probeer een andere gemeente, categorie of wis de zoekopdracht.
          </p>
          <button
            onClick={() => {
              setCategoryFilter('all');
              setMunicipalityFilter('all');
              setStatusFilter('all');
              setDurationFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#171717] text-white text-xs font-semibold rounded-lg hover:bg-black cursor-pointer"
          >
            Alle onderzoeken tonen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurveys.map((survey) => {
            const isCompleted = survey.status === 'completed';
            const isUpcoming = survey.status === 'upcoming';

            return (
              <div
                key={survey.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:border-stone-400 hover:shadow-xs transition-all duration-150"
              >
                <div>
                  {/* Category & Location Header (Unboxed text with · separators) */}
                  <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-3">
                    <div className="flex items-center gap-1.5 font-medium text-stone-700">
                      <span className="capitalize font-semibold text-[#171717]">
                        {survey.category === 'woonwensen'
                          ? 'Woonwensen'
                          : survey.category === 'woonscan'
                          ? 'Woonscan'
                          : 'Woonopinie'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{survey.location.city}</span>
                      </span>
                    </div>

                    {/* Status marker */}
                    <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
                      {isCompleted ? 'Afgerond' : isUpcoming ? 'Binnenkort' : 'Actief'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#171717] mb-2 leading-snug">
                    {survey.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                    {survey.description}
                  </p>

                  {/* Location & CBS Code Info */}
                  <div className="space-y-1.5 text-xs text-stone-500 mb-5 pb-5 border-b border-stone-100">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Gebied:</span>
                      <span className="font-medium text-stone-800 text-right truncate max-w-[200px]">
                        {survey.location.neighborhood || survey.location.district || survey.location.municipality}
                      </span>
                    </div>
                    {survey.location.cbsCode && (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">CBS-code:</span>
                        <span className="font-mono text-[11px] text-stone-700 font-medium">
                          {survey.location.cbsCode}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Periode:</span>
                      <span className="font-mono text-[11px] text-stone-700">
                        {survey.startDate} t/m {survey.endDate}
                      </span>
                    </div>
                    {survey.commissioner && (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Opdrachtgever:</span>
                        <span className="text-stone-700 truncate max-w-[190px]">
                          {survey.commissioner}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-4 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{survey.durationMinutes} min</span>
                    </span>
                    <span className="font-mono tabular-nums text-stone-700">
                      {survey.participantCount.toLocaleString('nl-NL')} reacties
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (isCompleted && onOpenAdminLogin) {
                        onOpenAdminLogin();
                      } else {
                        onStartSurvey(survey);
                      }
                    }}
                    disabled={isUpcoming}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isUpcoming
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : isCompleted
                        ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        : 'bg-[#171717] hover:bg-black text-white hover:shadow-xs'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-stone-500" />
                        <span>Afgerond (Inloggen voor resultaten)</span>
                      </>
                    ) : isUpcoming ? (
                      <span>Binnenkort beschikbaar</span>
                    ) : (
                      <>
                        <span>Deelname starten</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C4F000]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
