import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Minimal first-deploy config. Add R2 incremental cache later if/when we
// introduce ISR pages — see https://opennext.js.org/cloudflare/caching
export default defineCloudflareConfig({});
