import { getIntegrationStatus, getMissingRequiredIntegrations } from '@/lib/server/api-status';

export const dynamic = 'force-dynamic';

export async function GET() {
  const integrations = getIntegrationStatus();
  const missingRequired = getMissingRequiredIntegrations();

  return Response.json({
    generatedAt: new Date().toISOString(),
    readyForTourApiMvp: missingRequired.length === 0,
    integrations,
    missingRequired,
  });
}
