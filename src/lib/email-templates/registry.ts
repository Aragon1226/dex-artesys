import type { ComponentType } from "react";

import { template as signupWelcomeTemplate } from "./signup-welcome";
import { template as depositRequestTemplate } from "./deposit-request";
import { template as depositConfirmationTemplate } from "./deposit-confirmation";
import { template as withdrawalRequestTemplate } from "./withdrawal-request";
import { template as withdrawalConfirmationTemplate } from "./withdrawal-confirmation";
import { template as kycSubmittedTemplate } from "./kyc-submitted";
import { template as kycStatusTemplate } from "./kyc-status";

export interface TemplateEntry {
  component: ComponentType<any>;
  subject: string | ((data: Record<string, any>) => string);
  displayName?: string;
  previewData?: Record<string, any>;
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string;
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  "signup-welcome": signupWelcomeTemplate,
  "deposit-request": depositRequestTemplate,
  "deposit-confirmation": depositConfirmationTemplate,
  "withdrawal-request": withdrawalRequestTemplate,
  "withdrawal-confirmation": withdrawalConfirmationTemplate,
  "kyc-submitted": kycSubmittedTemplate,
  "kyc-status": kycStatusTemplate,
};
