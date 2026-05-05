import { z } from "zod/v4";
import type { PortfolioDictionary } from "../i18n/types";

type InquiryFormCopy = PortfolioDictionary["inquiryForm"];

export function createInquiryFormSchema(copy: InquiryFormCopy) {
  return z.object({
    name: z.string().trim().min(2, copy.nameValidation),
    email: z.email(copy.emailValidation),
    message: z.string().trim().min(24, copy.messageValidation),
  });
}

export const inquiryFormSchema = createInquiryFormSchema({
  nameLabel: "",
  namePlaceholder: "",
  nameValidation: "",
  emailLabel: "",
  emailPlaceholder: "",
  emailValidation: "",
  companyLabel: "",
  companyPlaceholder: "",
  budgetLabel: "",
  budgetPlaceholder: "",
  scopeLabel: "",
  scopePlaceholder: "",
  messageLabel: "",
  messagePlaceholder: "",
  messageValidation: "",
  submit: "",
  submitting: "",
  successTitle: "",
  successDescription: "",
  errorTitle: "",
  errorDescription: "",
  reviewError: "",
  endpointUnavailableError: "",
  submitUnavailableError: "",
  backendUnavailableError: "",
  privacyNote: "",
});

export type InquiryFormValues = z.infer<
  ReturnType<typeof createInquiryFormSchema>
>;
