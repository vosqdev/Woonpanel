import React, { useState } from 'react';
import { X, Lock, ShieldCheck, UserCheck, KeyRound } from 'lucide-react';
import { AdminRole, AdminUser } from '../../types/survey';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<Props> = ({ isOpen, onClose, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<AdminRole>('super_admin');
  const [password, setPassword] = useState('woondata2026');

  if (!isOpen) return null;

  const handleRoleSelect = (role: AdminRole) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userProfiles: Record<AdminRole, AdminUser> = {
      super_admin: {
        id: 'usr_super_1',
        name: 'Drs. Maarten van Leeuwen',
        email: 'm.vanleeuwen@woondata.com',
        role: 'super_admin',
        organization: 'Woondata Kennisnetwerk Nederland',
      },
      research_admin: {
        id: 'usr_research_2',
        name: 'Sanne de Boer, MSc',
        email: 's.deboer@utrecht.nl',
        role: 'research_admin',
        organization: 'Gemeente Utrecht (Ruimte & Wonen)',
      },
      viewer: {
        id: 'usr_viewer_3',
        name: 'Raadscommissie Wonen',
        email: 'raad@amersfoort.nl',
        role: 'viewer',
        organization: 'Gemeenteraad & Klankbordgroep',
      },
    };

    onLogin(userProfiles[selectedRole]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#171717] text-[#C4F000] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171717]">
                Beheeromgeving & Resultaten
              </h3>
              <p className="text-[11px] text-stone-500 font-mono">
                Toegang tot onderzoeksdata en analyses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
          Onderzoeksresultaten en analyses zijn uitsluitend inzichtelijk voor geautoriseerde gemeenten, woningcorporaties en onderzoekers via dit beheerportaal.
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Kies een beheerrol voor deze sessie:
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'super_admin' as AdminRole,
                  title: 'Hoofdbeheerder (Super Admin)',
                  desc: 'Volledige rechten: onderzoeken, API-koppeling Woondata, gebruikersbeheer.',
                },
                {
                  id: 'research_admin' as AdminRole,
                  title: 'Onderzoekbeheerder (Research Admin)',
                  desc: 'Onderzoeken aanmaken, vragenlijsten bouwen en analyses inzien.',
                },
                {
                  id: 'viewer' as AdminRole,
                  title: 'Kijkersrol (Read-Only Viewer)',
                  desc: 'Uitsluitend inzien en exporteren van rapportages en grafieken.',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleRoleSelect(item.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedRole === item.id
                      ? 'bg-stone-50 border-[#171717] ring-1 ring-[#171717]'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-900">{item.title}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              Beveiligde toegangssleutel (Demo ingevuld)
            </label>
            <div className="relative">
              <KeyRound className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#171717]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#171717] hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#C4F000]" />
              <span>Inloggen als {selectedRole === 'super_admin' ? 'Hoofdbeheerder' : selectedRole === 'research_admin' ? 'Onderzoeker' : 'Kijker'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
