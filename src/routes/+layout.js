import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
injectSpeedInsights();

import { dev } from '$app/environment';
import { inject } from '@vercel/analytics';
 
inject({ mode: dev ? 'development' : 'production' });

