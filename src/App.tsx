import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryCards } from './components/CategoryCards';
import { SurveyList } from './components/SurveyList';
import { SurveyRunner } from './components/SurveyRunner';
import { WoonscanReport } from './components/WoonscanReport';
import { HowItWorksPage } from './components/HowItWorksPage';
import { ModuleInfoPage } from './components/ModuleInfoPage';
import { RegisterModal, PanelMemberRegistration } from './components/RegisterModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { PrivacyModal } from './components/PrivacyModal';
import { Footer } from './components/Footer';
import { INITIAL_SURVEYS } from './data/mockSurveys';
import {
  Survey,
  SurveyCategory,
  SurveySubmission,
  WoonscanSummary,
  AdminUser,
  Question,
} from './types/survey';

export default function App() {
  const [surveys, setSurveys] = useState<Survey[]>(INITIAL_SURVEYS);
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [woonscanSummary, setWoonscanSummary] = useState<WoonscanSummary | null>(null);

  // Admin session state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser>({
    id: 'usr_super_1',
    name: 'Drs. Maarten van Leeuwen',
    email: 'm.vanleeuwen@woondata.com',
    role: 'super_admin',
    organization: 'Woondata Kennisnetwerk Nederland',
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [registeredMembersCount, setRegisteredMembersCount] = useState<number>(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('woondata_panel_members');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRegisteredMembersCount(parsed.length);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartSurvey = (survey: Survey) => {
    // If survey has no questions yet, supply the default template questions
    if (!survey.questions || survey.questions.length === 0) {
      const template = surveys.find((s) => s.category === survey.category && s.questions.length > 0);
      setActiveSurvey({
        ...survey,
        questions: template ? template.questions : surveys[0].questions,
      });
    } else {
      setActiveSurvey(survey);
    }
    navigateTo('survey_runner');
  };

  const handleStartCategorySurvey = (category: SurveyCategory) => {
    const found = surveys.find((s) => s.category === category && s.status === 'active' && s.questions.length > 0) ||
      surveys.find((s) => s.category === category);
    if (found) {
      handleStartSurvey(found);
    } else {
      navigateTo('home');
      setTimeout(() => {
        const el = document.getElementById('onderzoeken-overzicht');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleFinishSubmission = (submission: SurveySubmission, summary?: WoonscanSummary) => {
    // Increment participant count in active surveys
    setSurveys((prev) =>
      prev.map((s) => {
        if (s.id === submission.surveyId) {
          return { ...s, participantCount: s.participantCount + 1 };
        }
        return s;
      })
    );

    if (summary) {
      setWoonscanSummary(summary);
    }
  };

  const handleViewWoonscanReport = (summary: WoonscanSummary) => {
    setWoonscanSummary(summary);
    navigateTo('woonscan_report');
  };

  const handleUpdateSurveyQuestions = (surveyId: string, updatedQuestions: Question[]) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, questions: updatedQuestions } : s))
    );
  };

  const handleCreateSurvey = (newSurvey: Survey) => {
    setSurveys((prev) => [newSurvey, ...prev]);
  };

  const handleLogin = (user: AdminUser) => {
    setAdminUser(user);
    setIsAdminLoggedIn(true);
    navigateTo('admin');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#1F2937] flex flex-col font-sans selection:bg-[#C4F000] selection:text-[#171717]">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        isAdminLoggedIn={isAdminLoggedIn}
        adminRole={adminUser.role}
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <>
            <Hero
              onStartSurveyClick={() => {
                const el = document.getElementById('onderzoeksthemas');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreThemesClick={() => {
                const el = document.getElementById('onderzoeksthemas');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              additionalMemberCount={registeredMembersCount}
            />

            <CategoryCards onSelectCategory={handleStartCategorySurvey} />
          </>
        )}

        {/* VIEW 2: ACTIVE SURVEY RUNNER */}
        {currentView === 'survey_runner' && activeSurvey && (
          <SurveyRunner
            survey={activeSurvey}
            onBackToHome={() => navigateTo('home')}
            onFinishSubmission={handleFinishSubmission}
            onViewWoonscanReport={handleViewWoonscanReport}
          />
        )}

        {/* VIEW 3: WOONSCAN PERSONAL REPORT */}
        {currentView === 'woonscan_report' && woonscanSummary && (
          <WoonscanReport
            summary={woonscanSummary}
            onBackToHome={() => navigateTo('home')}
            onExploreSurveys={() => {
              navigateTo('home');
              setTimeout(() => {
                const el = document.getElementById('onderzoeken-overzicht');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        )}

        {/* VIEW 4: HOE HET PANEL WERKT */}
        {currentView === 'hoe-het-werkt' && (
          <HowItWorksPage
            onBackToHome={() => navigateTo('home')}
            onStartSurvey={() => {
              navigateTo('home');
              setTimeout(() => {
                const el = document.getElementById('onderzoeken-overzicht');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            onOpenAdminLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {/* VIEW: ADMIN SURVEILLANCE / CATALOG (BEHIND LOGIN - AFBEELDING 1) */}
        {currentView === 'admin_surveys' && (
          isAdminLoggedIn ? (
            <AdminDashboard
              surveys={surveys}
              adminUser={adminUser}
              initialTab="catalog"
              onStartSurvey={handleStartSurvey}
              onLogout={handleLogout}
              onBackToSite={() => navigateTo('home')}
              onUpdateSurveyQuestions={handleUpdateSurveyQuestions}
              onCreateSurvey={handleCreateSurvey}
            />
          ) : (
            <main className="max-w-xl mx-auto py-24 px-4 text-center">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 space-y-5 shadow-xs">
                <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto text-[#171717]">
                  <span className="font-mono text-sm font-bold">🔒</span>
                </div>
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
                    Beveiligde Omgeving
                  </div>
                  <h2 className="text-2xl font-bold text-[#171717]">Onderzoeken Catalogus</h2>
                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    De dynamische onderzoeken catalogus en het filtersysteem zijn uitsluitend inzichtelijk via de beheeromgeving voor aangesloten gemeenten en corporaties.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-6 py-2.5 bg-[#171717] hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
                  >
                    <span>Inloggen beheerportaal</span>
                  </button>
                </div>
              </div>
            </main>
          )
        )}

        {/* VIEW: ADMIN RESULTS (BEHIND LOGIN - PUNT 5) */}
        {currentView === 'admin_results' && (
          isAdminLoggedIn ? (
            <AdminDashboard
              surveys={surveys}
              adminUser={adminUser}
              initialTab="analytics"
              onStartSurvey={handleStartSurvey}
              onLogout={handleLogout}
              onBackToSite={() => navigateTo('home')}
              onUpdateSurveyQuestions={handleUpdateSurveyQuestions}
              onCreateSurvey={handleCreateSurvey}
            />
          ) : (
            <main className="max-w-xl mx-auto py-24 px-4 text-center">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 space-y-5 shadow-xs">
                <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto text-[#171717]">
                  <span className="font-mono text-sm font-bold">📊</span>
                </div>
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
                    Beveiligde Onderzoeksdata
                  </div>
                  <h2 className="text-2xl font-bold text-[#171717]">Onderzoeksresultaten & Statistieken</h2>
                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    De geaggregeerde onderzoeksresultaten, analyses en geografische uitsplitsingen zijn conform privacywaarborgen uitsluitend toegankelijk achter de beheerlogin.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-6 py-2.5 bg-[#171717] hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
                  >
                    <span>Inloggen beheerportaal</span>
                  </button>
                </div>
              </div>
            </main>
          )
        )}

        {/* VIEW 5, 6, 7: MODULE EXPLAINER PAGES */}
        {currentView === 'woonwensen-info' && (
          <ModuleInfoPage
            category="woonwensen"
            onStartCategorySurvey={handleStartCategorySurvey}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {currentView === 'woonscan-info' && (
          <ModuleInfoPage
            category="woonscan"
            onStartCategorySurvey={handleStartCategorySurvey}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {currentView === 'woonopinie-info' && (
          <ModuleInfoPage
            category="woonopinie"
            onStartCategorySurvey={handleStartCategorySurvey}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {/* VIEW 8: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard
            surveys={surveys}
            adminUser={adminUser}
            onLogout={handleLogout}
            onBackToSite={() => navigateTo('home')}
            onUpdateSurveyQuestions={handleUpdateSurveyQuestions}
            onCreateSurvey={handleCreateSurvey}
          />
        )}
      </div>

      {/* Footer */}
      {currentView !== 'admin' && currentView !== 'survey_runner' && (
        <Footer
          onNavigate={navigateTo}
          onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
          onOpenAdminLogin={() => setIsLoginModalOpen(true)}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        />
      )}

      {/* Panel Registration Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccessRegistered={(newMember) => {
          setRegisteredMembersCount((prev) => prev + 1);
        }}
        onStartActiveSurvey={() => {
          const defaultSurvey = surveys.find((s) => s.id === 'dronten_zuid_2026' || s.category === 'woonopinie') || surveys[0];
          if (defaultSurvey) {
            handleStartSurvey(defaultSurvey);
          } else {
            navigateTo('home');
          }
        }}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Privacy & AVG Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}
