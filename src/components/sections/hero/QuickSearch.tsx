import React, { useId, useMemo, useState } from 'react';
import { m } from 'framer-motion';
import { CalendarIcon, MapPinIcon, SearchIcon, ShapesIcon } from 'lucide-react';
import { useBooking } from '../../../contexts/BookingContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { destinations } from '../../../data/destinations';
import { europeDestinations, europeOnRequest, gulfCountries, gulfPrograms } from '../../../data/international';
import type { Localized } from '../../../types/i18n';
import { scrollToSection } from '../../../utils/scroll';
import type { InquiryServiceId } from '../../../types/booking';
import { EASE_OUT } from '../../../utils/motion';
import { Button } from '../../ui/Button';
import { Combobox } from '../../ui/Combobox';
import { Select } from '../../ui/Select';

type SearchService = 'domestic' | 'international' | 'umrah' | 'visa';
const serviceOrder: SearchService[] = ['domestic', 'international', 'umrah', 'visa'];
const toInquiryService: Record<SearchService, InquiryServiceId | ''> = {
  domestic: 'domestic',
  international: 'international',
  umrah: 'umrah',
  visa: ''
};

/** Loose text match: ignores case, extra spaces, the Arabic article and hamza/taa-marbuta variants. */
const normalize = (s: string) =>
s.
toLowerCase().
replace(/[أإآ]/g, 'ا').
replace(/ة/g, 'ه').
replace(/ى/g, 'ي').
replace(/(^|\s)ال/g, '$1').
replace(/\s+/g, ' ').
trim();

const matches = (query: string, name: Localized) => {
  const q = normalize(query);
  if (!q) return false;
  return [name.ar, name.en].some((n) => {
    const v = normalize(n);
    return v.includes(q) || q.includes(v);
  });
};

const holyCities: Localized[] = [{ ar: 'مكة المكرمة', en: 'Makkah' }, { ar: 'المدينة المنورة', en: 'Madinah' }, { ar: 'عمرة', en: 'Umrah' }, { ar: 'حج', en: 'Hajj' }];

export function QuickSearch() {
  const { t, pick } = useLanguage();
  const { openInquiry, goToTrips, openDestination } = useBooking();
  const uid = useId();
  const [service, setService] = useState<SearchService | ''>('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const today = new Date().toISOString().slice(0, 10);

  const suggestions = useMemo(() => {
    const domestic = destinations.map((d) => pick(d.name));
    const abroad = [...gulfCountries, ...europeDestinations].map((c) => pick(c.name));
    if (service === 'domestic') return domestic;
    if (service === 'international' || service === 'visa') return abroad;
    if (service === 'umrah') return [pick({ ar: 'مكة المكرمة', en: 'Makkah' }), pick({ ar: 'المدينة المنورة', en: 'Madinah' })];
    return [...domestic, ...abroad];
  }, [service, pick]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = destination.trim();

    // 1) A known destination wins over the service picked, so "Kuwait" always lands on the Gulf section.
    if (q) {
      const domestic = destinations.find((d) => matches(q, d.name));
      if (domestic) return openDestination(domestic.id);
      if (holyCities.some((c) => matches(q, c))) return goToTrips('umrah');
      const isGulf = gulfCountries.some((c) => matches(q, c.name)) || gulfPrograms.some((p) => matches(q, p.title));
      const isEurope = [...europeDestinations, ...europeOnRequest].some((c) => matches(q, c.name));
      if (isGulf || isEurope) {
        if (service === 'visa') return scrollToSection('visas');
        return goToTrips('international', isGulf ? 'gulf' : 'europe');
      }
    }

    // 2) No destination typed: go to the section for the chosen service.
    if (!q && service) {
      if (service === 'visa') return scrollToSection('visas');
      return goToTrips(service);
    }

    // 3) Unknown destination (or nothing chosen): send it to the inquiry form so the team can reply.
    const visaPrefix = service === 'visa' ? `${t.search.options.visa}: ` : '';
    openInquiry({
      service: service ? toInquiryService[service] : '',
      destination: destination ? `${visaPrefix}${destination}` : visaPrefix.replace(': ', ''),
      date
    });
  };

  const fieldWrap =
  'group relative flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 ring-1 ring-ink/5 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-gold';
  const labelCls = 'block text-[11px] font-bold text-primary-dark';
  const inputCls = 'w-full bg-transparent text-[15px] font-semibold text-ink placeholder:text-ink/40 focus:outline-none';

  return (
    <m.form
      onSubmit={onSubmit}
      aria-label={t.search.label}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.55 }}
      className="grid gap-2 rounded-3xl border border-white/30 bg-white/15 p-2 shadow-glass backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-[1fr_1.2fr_1fr_auto]">
      
      <div className={fieldWrap}>
        <ShapesIcon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <span id={`${uid}-service-label`} className={labelCls}>
            {t.search.service}
          </span>
          <Select
            id={`${uid}-service`}
            labelledBy={`${uid}-service-label`}
            value={service}
            onChange={setService}
            placeholder={t.search.servicePlaceholder}
            options={serviceOrder.map((s) => ({ value: s, label: t.search.options[s] }))}
            placement="top" />
        </div>
      </div>

      <div className={fieldWrap}>
        <MapPinIcon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <label htmlFor={`${uid}-dest`} className={labelCls}>
            {t.search.destination}
          </label>
          <Combobox
            id={`${uid}-dest`}
            value={destination}
            onChange={setDestination}
            suggestions={suggestions}
            placeholder={t.search.destinationPlaceholder}
            placement="top" />
        </div>
      </div>

      <div className={fieldWrap}>
        <CalendarIcon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <label htmlFor={`${uid}-date`} className={labelCls}>
            {t.search.date}
          </label>
          <input
            id={`${uid}-date`}
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputCls} min-h-[24px]`} />
          
        </div>
      </div>

      <Button type="submit" variant="gold" size="lg" fullWidth className="!h-full min-h-[56px] !rounded-2xl" icon={<SearchIcon className="h-5 w-5" aria-hidden="true" />}>
        {t.search.submit}
      </Button>
    </m.form>);

}