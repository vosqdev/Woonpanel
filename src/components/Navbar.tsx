import React from 'react';
import { UserCheck, UserPlus } from 'lucide-react';
import { AdminRole } from '../types/survey';
import { WoonpanelLogo } from './WoonpanelLogo';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAdminLoggedIn: boolean;
  adminRole: AdminRole;
  onOpenAdminLogin: () => void;
  onOpenPrivacyModal: () => void;
  onOpenRegisterModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdminLoggedIn,
  adminRole,
  onOpenAdminLogin,
  onOpenPrivacyModal,
  onOpenRegisterModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E5E7EB]">
      {/* Woondata Network Header Stripe */}
      <div className="bg-[#171717] text-[#FFFFFF] text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Onderdeel van</span>
            <a
              href="https://www.woondata.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#C4F000] hover:underline"
            >
              www.woondata.com
            </a>
            <span className="text-stone-500 hidden sm:inline">·</span>
            <span className="text-stone-400 hidden sm:inline">
              Onafhankelijk dataplatform voor woningmarkt en leefomgeving
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left cursor-pointer group shrink-0 transition-opacity hover:opacity-90"
          aria-label="Woonpanel Home"
        >
          <WoonpanelLogo badge={true} size="sm" />
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentView === 'home'
                ? 'text-[#171717] font-semibold border-b-2 border-[#171717]'
                : 'hover:text-[#171717]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('woonwensen-info')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentView === 'woonwensen-info'
                ? 'text-[#171717] font-semibold border-b-2 border-[#171717]'
                : 'hover:text-[#171717]'
            }`}
          >
            Woonwensen
          </button>
          {isAdminLoggedIn ? (
            <>
              <button
                onClick={() => onNavigate('admin_surveys')}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                  currentView === 'admin_surveys'
                    ? 'text-[#171717] font-semibold border-b-2 border-[#171717]'
                    : 'hover:text-[#171717]'
                }`}
              >
                Onderzoeken (Beheer)
              </button>
              <button
                onClick={() => onNavigate('admin_results')}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                  currentView === 'admin_results'
                    ? 'text-[#171717] font-semibold border-b-2 border-[#171717]'
                    : 'hover:text-[#171717]'
                }`}
              >
                Resultaten (Beheer)
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('hoe-het-werkt')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                currentView === 'hoe-het-werkt'
                  ? 'text-[#171717] font-semibold border-b-2 border-[#171717]'
                  : 'hover:text-[#171717]'
              }`}
            >
              Hoe het werkt
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenRegisterModal && (
            <button
              onClick={onOpenRegisterModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#171717] bg-[#C4F000] hover:bg-[#b5de00] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Aanmelden</span>
            </button>
          )}

          {isAdminLoggedIn ? (
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 text-xs font-semibold text-[#171717] bg-[#C4F000] hover:bg-[#b5de00] rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Beheeromgeving ({adminRole === 'super_admin' ? 'Super Admin' : adminRole === 'research_admin' ? 'Onderzoeker' : 'Kijker'})</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#171717] hover:bg-black rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              Beheer Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
