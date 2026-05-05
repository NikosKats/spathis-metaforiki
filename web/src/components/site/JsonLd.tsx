const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://metaforikikefalonias.gr';

function ldScript(data: object) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function MovingCompanyJsonLd({ locale }: { locale: 'el' | 'en' }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    '@id': `${SITE}#org`,
    name: locale === 'el' ? 'ΣΠΑΘΗΣ — Μεταφορική Κεφαλονιάς' : 'SPATHIS — Kefalonia Logistics',
    alternateName: ['Spathis Logistics', 'Σπάθης Μεταφορική'],
    url: SITE,
    description:
      locale === 'el'
        ? 'Μεταφορική εταιρεία στη Σκάλα Κεφαλονιάς. Συμπαγή φορτία, containers, τρακτορεύσεις από και προς την Κεφαλονιά.'
        : 'Logistics company based in Skala, Kefalonia. Full loads, containers, tractor haulage to and from the island.',
    telephone: ['+306938255178', '+306943450557'],
    email: 'aspathis@hotmail.gr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Σκάλα',
      addressLocality: 'Κεφαλονιά',
      addressRegion: locale === 'el' ? 'Κεφαλονιά' : 'Kefalonia',
      addressCountry: 'GR',
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Κεφαλονιά' },
      { '@type': 'Country', name: 'Greece' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '20:00',
    },
    sameAs: [`${SITE}`, 'https://metaforikikefalonias.gr'],
    knowsLanguage: ['el', 'en'],
    founder: { '@type': 'Person', name: 'Σπάθης Θανάσης' },
  };

  return ldScript(data);
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.href.startsWith('http') ? item.href : `${SITE}${item.href}`,
    })),
  };
  return ldScript(data);
}

export function ServiceJsonLd({
  name,
  description,
  slug,
  locale,
}: {
  name: string;
  description: string;
  slug: string;
  locale: 'el' | 'en';
}) {
  const path = `${locale === 'el' ? '' : `/${locale}`}/services/${slug}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: name,
    url: `${SITE}${path}`,
    provider: { '@id': `${SITE}#org` },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Κεφαλονιά' },
      { '@type': 'Country', name: 'Greece' },
    ],
    inLanguage: locale,
  };
  return ldScript(data);
}

export function WebPageJsonLd({
  name,
  description,
  path,
  locale,
}: {
  name: string;
  description: string;
  path: string;
  locale: 'el' | 'en';
}) {
  const url = `${SITE}${path}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    inLanguage: locale,
    isPartOf: { '@id': `${SITE}#org` },
  };
  return ldScript(data);
}
