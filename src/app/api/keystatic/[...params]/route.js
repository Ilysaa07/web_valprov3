import { makeRouteHandler } from '@keystatic/next/route-handler';
import { keystaticConfig } from '../../../../lib/keystatic';

export const { GET, POST } = makeRouteHandler({
  config: keystaticConfig,
});