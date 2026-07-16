const defaultPreviewPassword = 'Patticake4000';

export const previewAccessCookie = 'yum_preview_access';

export function getPreviewPassword() {
  return process.env.PREVIEW_PASSWORD?.trim() || defaultPreviewPassword;
}

export async function getPreviewAccessToken() {
  const value = `${getPreviewPassword()}:yum-preview-v1`;
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
