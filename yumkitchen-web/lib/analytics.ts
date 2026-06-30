export type AnalyticsPayload = Record<string, string>;

declare global {
  interface Window {
    dataLayer?: AnalyticsPayload[];
  }
}

export function pushAnalyticsEvent(payload: AnalyticsPayload) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}
