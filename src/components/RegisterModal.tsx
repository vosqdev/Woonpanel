import React, { useState } from 'react';
import {
  X,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Mail,
  User,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { savePanelMember } from '../services/surveyService';

export interface PanelMemberRegistration {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  privacyAgreed: boolean;
  newsletterOptIn: boolean;
  registeredAt: string;
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRegistered?: (member: PanelMemberRegistration) => void;
  onStartActiveSurvey?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccessRegistered,
  onStartActiveSurvey,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName.trim()) {
      setErrorMessage('Vul alsjeblieft je voornaam in.');
      return;
    }
    if (!lastName.trim()) {
      setErrorMessage('Vul alsjeblieft je achternaam in.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Vul een geldig email-adres in.');
      return;
    }
    if (!privacyAgreed) {
      setErrorMessage(
        'Ga akkoord met het privacy- en gegevensverwerkingsbeleid om je aan te melden.'
      );
      return;
    }

    setIsSubmitting(true);

    const newMember: PanelMemberRegistration = {
      id: 'member_' + Date.now(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim().toLowerCase(),
      privacyAgreed,
      newsletterOptIn,
      registeredAt: new Date().toISOString(),
    };

    // Save to Firebase Firestore and local cache
    savePanelMember(newMember)
      .then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        if (onSuccessRegistered) {
          onSuccessRegistered(newMember);
        }
      })
      .catch((err) => {
        console.error('Error saving panel member:', err);
        setIsSubmitting(false);
        setIsSuccess(true); // Still proceed as cached
        if (onSuccessRegistered) {
          onSuccessRegistered(newMember);
        }
      });
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full flex flex-col border border-stone-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-start justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C4F000] text-[#171717] flex items-center justify-center font-bold shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Woondata Woonpanel</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
                Aanmelden als panellid
              </h2>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Sluit formulier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7">
          {isSuccess ? (
            /* Success State */
            <div className="py-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700">
                  Aanmelding voltooid
                </div>
                <h3 className="text-2xl font-extrabold text-[#171717]">
                  Welkom bij het panel, {firstName}!
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
                  Je aanmelding voor het Woondata Woonpanel is succesvol ontvangen. We hebben een bevestigingsmail gestuurd naar{' '}
                  <span className="font-mono text-xs font-semibold text-stone-800">
                    {email}
                  </span>
                  .
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Wat kun je verwachten?</span>
                </div>
                <p>
                  Je ontvangt uitnodigingen voor relevante onderzoeken over woonwensen en gebiedsontwikkeling. Deelname is altijd vrijwillig en 100% anoniem.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {onStartActiveSurvey && (
                  <button
                    onClick={() => {
                      handleResetAndClose();
                      onStartActiveSurvey();
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#C4F000] hover:bg-[#b5de00] text-[#171717] rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Direct meedoen aan onderzoek</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleResetAndClose}
                  className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-[#171717] rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Sluiten
                </button>
              </div>
            </div>
          ) : (
            /* Simplified Registration Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Voornaam & Achternaam */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Voornaam</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="bijv. Jan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4F000] focus:border-stone-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Achternaam</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="bijv. Jansen"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4F000] focus:border-stone-400 bg-white"
                  />
                </div>
              </div>

              {/* Email-adres */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>Email-adres</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="naam@voorbeeld.nl"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4F000] focus:border-stone-400 bg-white"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <label className="flex items-start gap-3 text-xs text-stone-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#171717] accent-[#171717] cursor-pointer"
                  />
                  <span className="leading-relaxed">
                    Ik meld mij vrijwillig aan voor het Woondata Woonpanel en ga akkoord met de privacy en gegevensverwerkingsbeleid. <span className="text-rose-500">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 text-xs text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newsletterOptIn}
                    onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#171717] accent-[#171717] cursor-pointer"
                  />
                  <span className="leading-relaxed">
                    Houd mij op de hoogte van onderzoeken en trends in mijn gemeente.
                  </span>
                </label>
              </div>

              {/* Security note & Buttons */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gegevens worden niet verkocht of gedeeld met andere partijen.</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-5 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                  >
                    annuleren
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-[#171717] bg-[#C4F000] hover:bg-[#b5de00] active:scale-[0.99] rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Verwerken...</span>
                    ) : (
                      <>
                        <span>aanmelden voltooien</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
