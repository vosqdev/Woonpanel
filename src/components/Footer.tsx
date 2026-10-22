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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4">
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

          {/* Col 2: Onderzoeksmodules */}
          <div>
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
                  Hoe het panel werkt
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
            </ul>
          </div>

          {/* Col 3: Beheer & Partners */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Voor Partners & Beheerders</h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Onderzoeksresultaten, buurtanalyses en data-exports zijn uitsluitend beveiligd inzichtelijk voor bevoegde gemeenten en woningcorporaties.
            </p>
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#C4F000]" />
              <span>Inloggen beheerportaal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
