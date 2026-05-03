import { Truck, Container, Anchor, type LucideIcon } from 'lucide-react';

export type ServiceSlug = 'full-loads' | 'containers' | 'haulage';

type ServiceConfig = {
  slug: ServiceSlug;
  msgKey: 'fullLoads' | 'containers' | 'haulage';
  icon: LucideIcon;
};

export const SERVICES: ServiceConfig[] = [
  { slug: 'full-loads', msgKey: 'fullLoads', icon: Truck },
  { slug: 'containers', msgKey: 'containers', icon: Container },
  { slug: 'haulage', msgKey: 'haulage', icon: Anchor },
];

export function getService(slug: string): ServiceConfig | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
