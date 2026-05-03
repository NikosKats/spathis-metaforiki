import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email().max(200),
  phone: z.string().max(40).optional().or(z.literal('')),
  message: z.string().min(10).max(4000),
  language: z.enum(['el', 'en']),
  // Honeypot — must be empty
  website: z.string().max(0).optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const quoteSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email().max(200),
  phone: z.string().max(40).optional().or(z.literal('')),
  company: z.string().max(200).optional().or(z.literal('')),
  cargoType: z.enum(['full_load', 'container', 'haulage', 'other']),
  origin: z.string().min(2).max(200),
  destination: z.string().min(2).max(200),
  weightKg: z.string().max(20).optional().or(z.literal('')),
  volumeM3: z.string().max(20).optional().or(z.literal('')),
  pickupDate: z.string().max(20).optional().or(z.literal('')),
  deliveryDate: z.string().max(20).optional().or(z.literal('')),
  notes: z.string().max(4000).optional().or(z.literal('')),
  language: z.enum(['el', 'en']),
  website: z.string().max(0).optional().or(z.literal('')),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
