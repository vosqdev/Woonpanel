import React, { useState } from 'react';
import {
  X,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Mail,
  MapPin,
  Home,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';

export interface PanelMemberRegistration {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  postalCode: string;
  city: string;
  neighborhood?: string;
  housingType: string;
  ageCategory: string;
  householdType: string;
  interests: string[];
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
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('Dronten');
  const [neighborhood, setNeighborhood] = useState('Dronten-Zuid');
  const [housingType, setHousingType] = useState('koop');
  const [ageCategory, setAgeCategory] = useState('30-44');
  const [householdType, setHouseholdType] = useState('gezin_met_kinderen');
  const [interests, setInterests] = useState<string[]>([
    'woonwensen',
    'woonscan',
    'woonopinie',
  ]);
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Vul alsjeblieft je naam in.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Vul een geldig e-mailadres in.');
      return;
    }
    if (!postalCode.trim()) {
      setErrorMessage('Vul je postcode in (bijv. 8251 KL).');
      return;
    }
    if (!privacyAgreed) {
      setErrorMessage('Ga akkoord met het privacyprotocol om deel te nemen.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newMember: PanelMemberRegistration = {
        id: 'member_' + Date.now(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        postalCode: postalCode.trim().toUpperCase(),
        city: city.trim() || 'Dronten',
        neighborhood: neighborhood.trim() || undefined,
        housingType,
        ageCategory,
        householdType,
        interests,
        newsletterOptIn,
        registeredAt: new Date().toISOString(),
      };

      // Save to localStorage
      try {
        const stored = localStorage.getItem('woondata_panel_members');
        const list: PanelMemberRegistration[] = stored ? JSON.parse(stored) : [];
        list.push(newMember);
        localStorage.setItem('woondata_panel_members', JSON.stringify(list));
      } catch (err) {
        console.error('Failed to save panel member locally', err);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccessRegistered) {
        onSuccessRegistered(newMember);
      }
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
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
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {isSuccess ? (
            /* Success State */
            <div className="py-8 px-4 text-center space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700">
                  Aanmelding Succesvol
                </div>
                <h3 className="text-2xl font-extrabold text-[#171717]">
                  Welkom bij het panel, {fullName}!
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Je bent officieel aangemeld voor het Woondata Woonpanel in <span className="font-semibold text-stone-900">{city}</span>. We hebben een bevestigingsmail gestuurd naar <span className="font-mono text-xs font-semibold text-stone-800">{email}</span>.
                </p>
              </div>

              {/* Impact Banner */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#171717]">
                  <Sparkles className="w-4 h-4 text-[#C4F000]" />
                  <span>Wat gebeurt er nu?</span>
                </div>
                <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
                  <li>Zodra er een onderzoek voor jouw buurt of gemeente start, ontvang je een korte uitnodiging per mail (~5 min).</li>
                  <li>Deelname is altijd vrijwillig en 100% anoniem conform AVG.</li>
                  <li>Je ontvangt na afloop samenvattingen van de geaggregeerde woonresultaten.</li>
                </ul>
              </div>

              {/* Action Buttons in Success */}
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
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Trust & Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-stone-200 text-emerald-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs text-stone-600 leading-relaxed">
                  <span className="font-semibold text-stone-900 block mb-0.5">
                    100% Anoniem & Vrijwillig
                  </span>
                  Jouw privacy is gewaarborgd. Gegevens worden uitsluitend gebruikt om je uit te nodigen voor relevante onderzoeken in jouw regio en worden nooit gekoppeld aan je antwoorden of verkocht aan derden.
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Sectie 1: Persoonlijke gegevens */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>1. Contactgegevens (voor uitnodigingen)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Voor- en achternaam <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="bijv. Jan Jansen"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4F000] focus:border-stone-400 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      E-mailadres <span className="text-rose-500">*</span>
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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Telefoonnummer <span className="text-stone-400 font-normal">(optioneel, voor SMS bij urgente gebiedsconsultaties)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 - 12345678"
                    className="w-full sm:w-1/2 px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4F000] focus:border-stone-400 bg-white"
                  />
                </div>
              </div>

              {/* Sectie 2: Locatie & Postcode */}
              <div className="space-y-3.5 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>2. Woonplaats & Buurt</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Postcode <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="bijv. 8251 KL"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4F000] focus:border-stone-400 bg-white uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Woonplaats / Gemeente <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="bijv. Dronten"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4F000] focus:border-stone-400 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Wijk / Gebied <span className="text-stone-400 font-normal">(optioneel)</span>
                    </label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="bijv. Dronten-Zuid"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4F000] focus:border-stone-400 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sectie 3: Demografie & Woonsituatie */}
              <div className="space-y-3.5 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-stone-400" />
                  <span>3. Huidige Woonsituatie (voor representativiteit)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Type woning
                    </label>
                    <select
                      value={housingType}
                      onChange={(e) => setHousingType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4F000] bg-white cursor-pointer"
                    >
                      <option value="koop">Koopwoning (eengezinswoning / app.)</option>
                      <option value="huur_sociaal">Sociale huurwoning (corporatie)</option>
                      <option value="huur_vrij">Vrije sector huurwoning</option>
                      <option value="thuiswonend">Thuiswonend bij ouders / student</option>
                      <option value="overig">Overig</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Leeftijdscategorie
                    </label>
                    <select
                      value={ageCategory}
                      onChange={(e) => setAgeCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4F000] bg-white cursor-pointer"
                    >
                      <option value="18-29">18 - 29 jaar</option>
                      <option value="30-44">30 - 44 jaar</option>
                      <option value="45-64">45 - 64 jaar</option>
                      <option value="65+">65 jaar of ouder</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Huishouden
                    </label>
                    <select
                      value={householdType}
                      onChange={(e) => setHouseholdType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4F000] bg-white cursor-pointer"
                    >
                      <option value="gezin_met_kinderen">Gezin met kind(eren)</option>
                      <option value="samenwonend">Samenwonend zonder kinderen</option>
                      <option value="alleenstaand">Alleenstaand</option>
                      <option value="overig">Woongroep / Overig</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sectie 4: Voorkeursthema's */}
              <div className="space-y-3.5 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                  <span>4. Onderzoeksthema's waarin je geïnteresseerd bent</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label
                    onClick={() => toggleInterest('woonwensen')}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                      interests.includes('woonwensen')
                        ? 'border-[#171717] bg-stone-50 font-semibold text-[#171717]'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={interests.includes('woonwensen')}
                      onChange={() => {}}
                      className="mt-0.5 accent-[#171717]"
                    />
                    <div>
                      <div className="font-bold text-stone-900">Woonwensen</div>
                      <div className="text-[11px] text-stone-500 font-normal mt-0.5">Nieuwbouw & verhuisplannen</div>
                    </div>
                  </label>

                  <label
                    onClick={() => toggleInterest('woonscan')}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                      interests.includes('woonscan')
                        ? 'border-[#171717] bg-stone-50 font-semibold text-[#171717]'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={interests.includes('woonscan')}
                      onChange={() => {}}
                      className="mt-0.5 accent-[#171717]"
                    />
                    <div>
                      <div className="font-bold text-stone-900">Woonscan</div>
                      <div className="text-[11px] text-stone-500 font-normal mt-0.5">Kwaliteit, comfort & energie</div>
                    </div>
                  </label>

                  <label
                    onClick={() => toggleInterest('woonopinie')}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                      interests.includes('woonopinie')
                        ? 'border-[#171717] bg-stone-50 font-semibold text-[#171717]'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={interests.includes('woonopinie')}
                      onChange={() => {}}
                      className="mt-0.5 accent-[#171717]"
                    />
                    <div>
                      <div className="font-bold text-stone-900">Woonopinie</div>
                      <div className="text-[11px] text-stone-500 font-normal mt-0.5">Gebieds- en omgevingsvisies</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sectie 5: Privacy & Toestemming */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-0.5 accent-[#171717] rounded"
                  />
                  <span>
                    Ik meld mij vrijwillig aan voor het Woondata Woonpanel en ga akkoord met de verwerking van mijn gegevens conform het{' '}
                    <span className="font-semibold text-stone-900 underline">Privacyprotocol (AVG)</span>. Mijn antwoorden blijven anoniem. <span className="text-rose-500">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletterOptIn}
                    onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    className="mt-0.5 accent-[#171717] rounded"
                  />
                  <span>
                    Houd mij op de hoogte van geaggregeerde woonresultaten en trends in mijn gemeente.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-stone-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Beveiligde SSL-verbinding · Geen dataverkoop</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-[#171717] bg-[#C4F000] hover:bg-[#b5de00] active:scale-[0.99] rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Verwerken...</span>
                    ) : (
                      <>
                        <span>Aanmelding voltooien</span>
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
