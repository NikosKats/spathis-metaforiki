import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AnnouncementBar } from '@/components/site/AnnouncementBar';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { routing } from '@/i18n/routing';

const CONTENT = {
  el: {
    title: 'Όροι Χρήσης',
    paragraphs: [
      'Καλώς ήλθατε στον ιστότοπο της ΣΠΑΘΗΣ Μεταφορική Κεφαλονιάς. Με τη χρήση αυτού του site αποδέχεστε τους ακόλουθους όρους.',
      'Οι πληροφορίες που εμφανίζονται στο site (υπηρεσίες, δρομολόγια, στατιστικά) έχουν ενημερωτικό χαρακτήρα και μπορεί να αλλάξουν χωρίς προειδοποίηση. Για επίσημη προσφορά μεταφοράς, απαιτείται γραπτή επιβεβαίωση μέσω email ή υπογεγραμμένης φόρμας.',
      'Κάθε αίτημα προσφοράς που υποβάλλετε δεν αποτελεί δεσμευτική σύμβαση μεταφοράς. Η σύμβαση συνάπτεται με την αποδοχή της προσφοράς από την πλευρά σας και την επιβεβαίωση των λεπτομερειών (φορτίο, διεύθυνση παραλαβής/παράδοσης, ημερομηνίες, κόστος) από εμάς.',
      'Όλες οι μεταφορές διενεργούνται με ασφαλισμένα οχήματα. Για ειδικά ή υψηλής αξίας φορτία, ενδέχεται να απαιτείται επιπλέον ασφάλιση εμπορεύματος, η οποία συμφωνείται γραπτώς πριν την αποστολή.',
      'Η ΣΠΑΘΗΣ Μεταφορική Κεφαλονιάς δεν φέρει ευθύνη για καθυστερήσεις που οφείλονται σε ανωτέρα βία (καιρικές συνθήκες, απαγορευτικά, απεργίες, κλπ).',
      'Ο ιστότοπος ενδέχεται να ενημερωθεί με νέους όρους ανά πάσα στιγμή. Η συνεχιζόμενη χρήση του site μετά από αλλαγές υποδηλώνει αποδοχή.',
      'Για διευκρινίσεις: 6938 255 178 ή aspathis@hotmail.gr.',
    ],
  },
  en: {
    title: 'Terms of Service',
    paragraphs: [
      'Welcome to the SPATHIS Kefalonia Logistics website. By using this site you accept the following terms.',
      'Information shown on the site (services, routes, statistics) is for general information and may change without notice. A formal transport quote requires written confirmation via email or a signed form.',
      'Submitting a quote request does not constitute a binding transport contract. The contract is formed when you accept our quote and we confirm the details (cargo, pickup/delivery address, dates, price).',
      'All transports are carried out with insured vehicles. For special or high-value cargo, additional cargo insurance may be required, agreed in writing before the shipment.',
      'SPATHIS Kefalonia Logistics is not liable for delays caused by force majeure (weather, sailing bans, strikes, etc).',
      'These terms may be updated at any time. Continued use of the site after changes implies acceptance.',
      'For clarifications: +30 6938 255 178 or aspathis@hotmail.gr.',
    ],
  },
} as const;

export async function generateMetadata({ params }: PageProps<'/[locale]/terms'>): Promise<Metadata> {
  const { locale } = await params;
  const c = CONTENT[(locale as 'el' | 'en') === 'en' ? 'en' : 'el'];
  const path = (loc: string) => `${loc === routing.defaultLocale ? '' : `/${loc}`}/terms`;
  return {
    title: c.title,
    description: c.paragraphs[0].slice(0, 160),
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
    },
  };
}

export default async function TermsPage({ params }: PageProps<'/[locale]/terms'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = CONTENT[(locale as 'el' | 'en') === 'en' ? 'en' : 'el'];

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <article className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              {c.title}
            </h1>
            <div className="mt-10 space-y-5 text-base leading-relaxed text-ink/85 sm:text-lg">
              {c.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
