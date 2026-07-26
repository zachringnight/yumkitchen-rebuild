export const CATERING_PLAN_EVENT = 'yum:catering-plan';

export type CateringPlanDetail = {
  /** Plain-English sentence appended to the catering form's message field. */
  summary: string;
  /** Location slug, so the form's restaurant select can be set to match. */
  locationSlug?: string;
  /** Guest count as entered, kept as a string to match the form field. */
  guests?: string;
};
