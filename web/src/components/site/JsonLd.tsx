const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://spathismetaforiki.gr';

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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
