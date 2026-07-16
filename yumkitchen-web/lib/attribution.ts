export const attributionFieldNames = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'landing_page',
  'referrer',
] as const;

export type AttributionFieldName = (typeof attributionFieldNames)[number];
export type AttributionContext = Record<AttributionFieldName, string>;

const storageKey = 'yum_acquisition_attribution_v1';
const utmFieldNames = attributionFieldNames.slice(0, 5);

function emptyAttribution(): AttributionContext {
  return {
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
    landing_page: '',
    referrer: '',
  };
}

function clean(value: string | null | undefined, maxLength = 500) {
  return (value ?? '').trim().slice(0, maxLength);
}

function readStoredAttribution(): AttributionContext {
  const empty = emptyAttribution();
  if (typeof window === 'undefined') return empty;

  try {
    const stored = window.sessionStorage.getItem(storageKey);
    if (!stored) return empty;
    const parsed = JSON.parse(stored) as Partial<Record<AttributionFieldName, unknown>>;
    return Object.fromEntries(
      attributionFieldNames.map((field) => [field, typeof parsed[field] === 'string' ? clean(parsed[field] as string) : '']),
    ) as AttributionContext;
  } catch {
    return empty;
  }
}

function writeStoredAttribution(attribution: AttributionContext) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(attribution));
  } catch {
    // Attribution remains available for the current event when storage is blocked.
  }
}

export function getAttributionContext(): AttributionContext {
  if (typeof window === 'undefined') return emptyAttribution();

  const stored = readStoredAttribution();
  const url = new URL(window.location.href);
  const currentCampaign = Object.fromEntries(
    utmFieldNames.map((field) => [field, clean(url.searchParams.get(field), 200)]),
  ) as Pick<AttributionContext, (typeof utmFieldNames)[number]>;
  const hasCurrentCampaign = utmFieldNames.some((field) => Boolean(currentCampaign[field]));
  const currentPage = clean(`${url.pathname}${url.search}${url.hash}`);

  const attribution: AttributionContext = {
    ...stored,
    ...(hasCurrentCampaign ? currentCampaign : {}),
    landing_page: hasCurrentCampaign ? currentPage : stored.landing_page || currentPage,
    referrer: stored.referrer || clean(document.referrer),
  };

  writeStoredAttribution(attribution);
  return attribution;
}
