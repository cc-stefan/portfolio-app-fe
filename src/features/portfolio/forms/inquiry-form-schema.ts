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
  nameValidation: "Enter at least 2 characters.",
  emailLabel: "",
  emailPlaceholder: "",
  emailValidation: "Enter a valid email address.",
  companyLabel: "",
  companyPlaceholder: "",
  budgetLabel: "",
  budgetPlaceholder: "",
  scopeLabel: "",
  scopePlaceholder: "",
  messageLabel: "",
  messagePlaceholder: "",
  messageValidation: "Add more context so the request is useful.",
  submit: "",
  submitting: "",
  successTitle: "",
  successDescription: "",
  errorTitle: "",
  errorDescription: "",
  privacyNote: "",
});

export type InquiryFormValues = z.infer<
  ReturnType<typeof createInquiryFormSchema>
>;
