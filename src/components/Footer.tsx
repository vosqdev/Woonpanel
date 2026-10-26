import React from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import { WoonpanelLogo } from './WoonpanelLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenPrivacyModal: () => void;
  onOpenAdminLogin: () => void;
  onOpenRegisterModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacyModal,
  onOpenAdminLogin,
  onOpenRegisterModal,
}) => {
  return (
    <footer className="bg-[#171717] text-stone-300 border-t border-stone-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          {/* Brand & Purpose */}
          <div className="max-w-md space-y-4">
            <WoonpanelLogo variant="dark" size="sm" />
            <p className="text-sm text-stone-400 leading-relaxed">
              Het onafhankelijke bewonerspanel binnen de gemeente Dronten. Wij verzamelen woonwensen,
              woonervaringen en buurtmeningen om volkshuisvesting en leefomgeving te verbeteren.
            </p>
            <div className="pt-2">
              <a
                href="https://www.woondata.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#C4F000] hover:underline font-medium"
              >
                <span>Bezoek www.woondata.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Menu naar rechts */}
          <div className="md:min-w-[240px]">
            <h4 className="text-white font-semibold text-sm mb-4">Onderzoeksmodules</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('woonwensen-info')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Woonwensen (Toekomstig wonen)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hoe-het-werkt')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Hoe Woonpanel werkt
                </button>
              </li>
              {onOpenRegisterModal && (
                <li>
                  <button
                    onClick={onOpenRegisterModal}
                    className="text-[#C4F000] hover:underline font-semibold transition-colors cursor-pointer text-left"
                  >
                    Aanmelden als panellid &rarr;
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenPrivacyModal}
                  className="hover:text-white transition-colors cursor-pointer text-left text-xs text-stone-400 pt-1"
                >
                  Privacybeleid & AVG
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-left text-xs text-stone-400 pt-1.5"
                >
                  <Lock className="w-3 h-3 text-stone-500" />
                  <span>Inloggen beheerportaal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
