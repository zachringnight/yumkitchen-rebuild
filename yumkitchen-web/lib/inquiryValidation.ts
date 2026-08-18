import { z } from 'zod';

// Single source of truth for inquiry validation. The client form
// (components/forms/InquiryForm.tsx) and the API route
// (app/api/inquiry/route.ts) both build their schemas from these pieces so
// the field rules and the cake/careers conditional requirements cannot drift.

export const inquiryKinds = ['contact', 'catering', 'cake', 'careers', 'accessibility'] as const;
export type InquiryKind = (typeof inquiryKinds)[number];
export type CakeMode = 'general' | 'pickup' | 'delivery';

export const inquiryFieldsSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Enter a valid email.'),
  phone: z.string().optional(),
  recipientName: z.string().optional(),
  location: z.string().optional(),
  subject: z.string().min(1, 'Subject is required.'),
  eventDate: z.string().optional(),
  guests: z.string().optional(),
  streetAddress: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  occasion: z.string().optional(),
  giftMessage: z.string().max(140, 'Gift message must be 140 characters or fewer.').optional(),
  availability: z.string().optional(),
  applyingFor: z.string().optional(),
  commitments: z.string().optional(),
  ageConfirm: z.boolean().optional(),
  workAuthorized: z.boolean().optional(),
  restaurantExperience: z.string().optional(),
  restaurantRoles: z.string().optional(),
  specialSkills: z.string().optional(),
  heardAbout: z.string().optional(),
  referral: z.string().optional(),
  promiseTrue: z.boolean().optional(),
  message: z.string().min(10, 'Please share a little more detail.'),
  company: z.string().optional(),
});

export type InquiryFields = z.infer<typeof inquiryFieldsSchema>;

type FieldRule = readonly [keyof InquiryFields, string];

export const cakePickupRequiredFields: readonly FieldRule[] = [
  ['location', 'Pickup restaurant is required.'],
  ['eventDate', 'Pickup date is required.'],
];

export const cakeDeliveryRequiredFields: readonly FieldRule[] = [
  ['recipientName', 'Recipient name is required.'],
  ['eventDate', 'Requested delivery date is required.'],
  ['streetAddress', 'Street address is required.'],
  ['city', 'City is required.'],
  ['state', 'State is required.'],
  ['zip', 'ZIP code is required.'],
  ['occasion', 'Occasion is required.'],
];

export const careersRequiredFields: readonly FieldRule[] = [
  ['phone', 'Phone is required.'],
  ['location', 'Location is required.'],
  ['availability', 'Availability is required.'],
  ['applyingFor', 'Applying for is required.'],
  ['heardAbout', 'Please tell us how you heard about this job.'],
];

export const careersRequiredChecks: readonly FieldRule[] = [
  ['ageConfirm', 'Please confirm your age.'],
  ['workAuthorized', 'Please confirm work authorization.'],
  ['promiseTrue', 'Please confirm the application is accurate.'],
];

// ---------------------------------------------------------------------------
// Cake date floors.
// The client form enforces exact floors in the visitor's local calendar
// (pickup: today or later; delivery: three or more days out). The API applies
// the same rules as a backstop against hand-crafted requests, anchored to the
// bakery's calendar (America/Chicago) and loosened by one day so no honest
// visitor timezone straddling midnight is rejected. The backstop's job is to
// stop clearly-past junk dates, not to re-litigate the exact boundary.
// ---------------------------------------------------------------------------

export function bakeryIsoDate(offsetDays = 0): string {
  // en-CA formats as YYYY-MM-DD, comparable to the date inputs' values.
  return new Date(Date.now() + offsetDays * 86_400_000).toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}

export function addCakeDateFloorIssues(data: Partial<InquiryFields>, ctx: z.RefinementCtx, mode: 'pickup' | 'delivery') {
  if (!data.eventDate) return;
  if (mode === 'pickup' && data.eventDate < bakeryIsoDate(-1)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['eventDate'], message: 'Choose today or a later pickup date.' });
  }
  if (mode === 'delivery' && data.eventDate < bakeryIsoDate(2)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['eventDate'], message: 'Choose a date at least three days out.' });
  }
}

export function addMissingStringIssues(data: Partial<InquiryFields>, ctx: z.RefinementCtx, rules: readonly FieldRule[]) {
  for (const [field, message] of rules) {
    const value = data[field];
    if (typeof value !== 'string' || !value.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
    }
  }
}

export function addUncheckedIssues(data: Partial<InquiryFields>, ctx: z.RefinementCtx, rules: readonly FieldRule[]) {
  for (const [field, message] of rules) {
    if (data[field] !== true) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
    }
  }
}

export function addCareersIssues(data: Partial<InquiryFields>, ctx: z.RefinementCtx) {
  addMissingStringIssues(data, ctx, careersRequiredFields);
  addUncheckedIssues(data, ctx, careersRequiredChecks);
}
