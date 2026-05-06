import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AnnouncementBar } from '@/components/site/AnnouncementBar';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { routing } from '@/i18n/routing';

const CONTENT = {
  el: {
    title: 'Πολιτική Απορρήτου',
    paragraphs: [
      'Η ΣΠΑΘΗΣ Μεταφορική Κεφαλονιάς σέβεται την ιδιωτικότητά σας. Συλλέγουμε μόνο τα στοιχεία που χρειάζονται για να σας απαντήσουμε σε αίτημα προσφοράς ή επικοινωνίας: ονοματεπώνυμο, email, τηλέφωνο και τις λεπτομέρειες της μεταφοράς που μας περιγράφετε.',
      'Τα δεδομένα αυτά χρησιμοποιούνται αποκλειστικά για να επικοινωνήσουμε μαζί σας και να εξυπηρετήσουμε το αίτημά σας. Δεν τα μοιραζόμαστε με τρίτους και δεν τα χρησιμοποιούμε για διαφημιστικούς σκοπούς.',
      'Αποθηκεύουμε τα στοιχεία σας για όσο χρόνο χρειάζεται για την εξυπηρέτηση του αιτήματος και για λογιστικές υποχρεώσεις. Έχετε το δικαίωμα ανά πάσα στιγμή να ζητήσετε αντίγραφο, διόρθωση ή διαγραφή των δεδομένων σας στέλνοντας email στο aspathis@hotmail.gr.',
      'Ο ιστότοπος δεν χρησιμοποιεί cookies παρακολούθησης ή διαφημιστικά cookies. Χρησιμοποιούμε αποκλειστικά τα τεχνικά cookies που είναι απαραίτητα για τη λειτουργία του (π.χ. επιλογή γλώσσας).',
      'Για οποιαδήποτε ερώτηση σχετικά με τη διαχείριση των προσωπικών σας δεδομένων, επικοινωνήστε στο 6938 255 178 ή στο aspathis@hotmail.gr.',
    ],
  },
  en: {
    title: 'Privacy Policy',
    paragraphs: [
      'SPATHIS Kefalonia Logistics respects your privacy. We collect only the information needed to respond to a quote request or contact form: full name, email, phone and the freight details you describe.',
      "This data is used solely to contact you and fulfil your request. We do not share it with third parties and do not use it for advertising.",
      "We retain your information for as long as needed to handle the request and meet our accounting obligations. You can ask for a copy, correction or deletion of your data at any time by emailing aspathis@hotmail.gr.",
      "The site uses no tracking or advertising cookies — only the technical cookies required for it to function (e.g. language preference).",
      "For any question about how we handle your personal data, contact +30 6938 255 178 or aspathis@hotmail.gr.",
    ],
  },
} as const;

export async function generateMetadata({ params }: PageProps<'/[locale]/privacy'>): Promise<Metadata> {
  const { locale } = await params;
  const c = CONTENT[(locale as 'el' | 'en') === 'en' ? 'en' : 'el'];
  const path = (loc: string) => `${loc === routing.defaultLocale ? '' : `/${loc}`}/privacy`;
  return {
    title: c.title,
    description: c.paragraphs[0].slice(0, 160),
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
    },
  };
}

export default async function PrivacyPage({ params }: PageProps<'/[locale]/privacy'>) {
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
