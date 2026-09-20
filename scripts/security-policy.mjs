// Keep this policy tied to the actual static site's resources and capabilities.
// Add a new external origin only after reviewing the feature that needs it.
const baselineContentSecurityPolicy = [
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self' https://fonts.googleapis.com",
  "style-src-attr 'none'",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-src 'self'",
  "frame-ancestors 'none'",
  "media-src 'none'",
  "worker-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const permissionsPolicy = [
  'accelerometer=()',
  'camera=()',
  'display-capture=()',
  'geolocation=()',
  'gyroscope=()',
  'magnetometer=()',
  'microphone=()',
  'payment=()',
  'usb=()',
].join(', ');

/** Return the global rule for Netlify's generated _headers file.
 * Enforce a compatible baseline while observing the stricter resource policy.
 * Report-only violations appear in the browser console; no report collector is used.
 */
export function securityHeaders(preview = false, { enforceCsp = false } = {}) {
  const headers = [
    `Content-Security-Policy: ${enforceCsp ? contentSecurityPolicy : baselineContentSecurityPolicy}`,
    ...(!enforceCsp ? [`Content-Security-Policy-Report-Only: ${contentSecurityPolicy}`] : []),
    'X-Content-Type-Options: nosniff',
    'X-Frame-Options: DENY',
    'Referrer-Policy: strict-origin-when-cross-origin',
    `Permissions-Policy: ${permissionsPolicy}`,
    // HSTS applies to the responding hostname only; do not extend it to subdomains.
    'Strict-Transport-Security: max-age=31536000',
  ];
  if (preview) headers.push('X-Robots-Tag: noindex, nofollow');
  return `/*\n${headers.map(header => `  ${header}`).join('\n')}\n`;
}
