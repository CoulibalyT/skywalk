import { useTranslation } from 'react-i18next';
import { AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-react';
import { isVisaExempt } from '../data/freeMovement';
import { useCountryName, useCountryNameIn } from '../hooks/useCountryName';

interface Props {
  nationality?: string | null;
  destinationIso?: string | null;
  destinationName?: string | null;
  /** Portail visa officiel de la destination (gov-links). */
  sourceUrl?: string | null;
  className?: string;
}

/**
 * Bandeau « conditions d'entrée » orienté INSTALLATION (long séjour, pas tourisme).
 * On n'affirme que le fait vérifié — la libre circulation UE/EEE/CH ; sinon on renvoie
 * à la source officielle sans rien inventer. Prend donc vraiment en compte la nationalité.
 */
export default function VisaNotice({
  nationality,
  destinationIso,
  destinationName,
  sourceUrl,
  className = '',
}: Props) {
  const { t } = useTranslation();
  const localized = useCountryName();
  const countryIn = useCountryNameIn();
  // La base stocke le nom anglais (« Switzerland ») : la phrase disait
  // « installer en Switzerland ». On passe par la forme avec préposition
  // (« en Suisse », « au Japon », « aux États-Unis ») ; si le pays est inconnu
  // du registre, on garde un « en » générique devant le nom traduit.
  const country = (() => {
    if (!destinationName) return t('visaNotice.thisCountry', { defaultValue: 'dans ce pays' });
    const withPreposition = countryIn(destinationName);
    const bare = localized(destinationName);
    if (withPreposition !== bare && withPreposition !== destinationName) return withPreposition;
    return t('visaNotice.inCountry', { country: bare, defaultValue: 'en {{country}}' });
  })();

  // Fait vérifié (droit de libre circulation) → aucune démarche visa.
  if (isVisaExempt(nationality, destinationIso)) {
    return (
      <div
        className={`rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-start gap-2.5 ${className}`}
      >
        <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-emerald-800 leading-relaxed">
          {t('visaNotice.exempt', {
            country,
            defaultValue:
              'Libre circulation — aucun visa n’est requis pour vous installer {{country}} (ressortissant·e UE/EEE/CH).',
          })}
        </p>
      </div>
    );
  }

  // Non exempté (ou nationalité inconnue) → on ne devine pas, on renvoie à l'officiel.
  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2.5 ${className}`}
    >
      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-sm text-amber-900 leading-relaxed">
          {nationality
            ? t('visaNotice.required', {
                country,
                defaultValue:
                  'Installation : un visa long séjour est requis pour vous installer {{country}} (≠ un simple séjour touristique).',
              })
            : t('visaNotice.check', {
                country,
                defaultValue:
                  'Selon votre nationalité, un visa long séjour peut être requis pour vous installer {{country}}.',
              })}
        </p>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-amber-700 hover:text-amber-900"
          >
            {t('visaNotice.officialSource', { defaultValue: 'Vérifier sur la source officielle' })}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
