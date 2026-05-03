-- Seed initial content
insert into public.site_settings (id, phone_primary, phone_secondary, email, whatsapp_number, viber_number, address_el, address_en, hours_el, hours_en)
values (
  1,
  '+306938255178',
  '+306943450557',
  'aspathis@hotmail.gr',
  '+306938255178',
  '+306938255178',
  'Σκάλα Κεφαλονιάς, Ελλάδα',
  'Skala, Kefalonia, Greece',
  'Δευ–Σαβ 08:00–20:00',
  'Mon–Sat 8:00–20:00'
) on conflict (id) do nothing;

insert into public.services (slug, title_el, title_en, short_el, short_en, description_el, description_en, icon, display_order)
values
  ('full-loads', 'Συμπαγή Φορτία', 'Full Loads',
   'Μεταφορά συμπαγών φορτίων από και προς την Κεφαλονιά.',
   'Full-truckload transport to and from Kefalonia.',
   'Αναλαμβάνουμε τη μεταφορά συμπαγών φορτίων (FTL) με ασφάλεια και συνέπεια.',
   'We handle full-truckload (FTL) transport with safety and reliability.',
   'truck', 1),
  ('containers', 'Containers', 'Containers',
   'Μεταφορά εμπορευματοκιβωτίων προς/από το νησί.',
   'Container transport to/from the island.',
   'Μεταφορά containers όλων των τύπων με σύγχρονο εξοπλισμό.',
   'Container transport for all standard types using modern equipment.',
   'container', 2),
  ('haulage', 'Τρακτορεύσεις', 'Tractor Haulage',
   'Υπηρεσίες τρακτόρευσης για βαρέα φορτία.',
   'Tractor haulage for heavy and oversized loads.',
   'Παρέχουμε υπηρεσίες τρακτόρευσης για βαρέα και ειδικά φορτία.',
   'Tractor haulage services for heavy and specialized loads.',
   'truck-electric', 3)
on conflict (slug) do nothing;

insert into public.pages (slug, title_el, title_en, body_el, body_en, meta_description_el, meta_description_en)
values
  ('about',
   'Σχετικά με εμάς',
   'About us',
   '## Νέα μεταφορική στην Κεφαλονιά\n\nΗ μεταφορική Σπάθης ξεκινά τη λειτουργία της με έδρα τη Σκάλα Κεφαλονιάς...',
   '## A new logistics company in Kefalonia\n\nSpathis Logistics is a newly launched transport company based in Skala, Kefalonia...',
   'Νέα μεταφορική εταιρεία στην Κεφαλονιά. Συμπαγή φορτία, containers, τρακτορεύσεις.',
   'New logistics company in Kefalonia. Full loads, containers, tractor haulage.'),
  ('privacy',
   'Πολιτική Απορρήτου',
   'Privacy Policy',
   '## Πολιτική Απορρήτου\n\n_Σχέδιο — προς αναθεώρηση._',
   '## Privacy Policy\n\n_Draft — pending review._',
   'Πολιτική απορρήτου ΣΠΑΘΗΣ Μεταφορική.',
   'Spathis Logistics privacy policy.'),
  ('terms',
   'Όροι Χρήσης',
   'Terms of Service',
   '## Όροι Χρήσης\n\n_Σχέδιο — προς αναθεώρηση._',
   '## Terms of Service\n\n_Draft — pending review._',
   'Όροι χρήσης.',
   'Terms of service.')
on conflict (slug) do nothing;
