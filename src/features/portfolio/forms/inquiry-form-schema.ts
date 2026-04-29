import { z } from "zod/v4";

export const inquiryFormSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters."),
  email: z.email("Enter a valid email address."),
  company: z.string().trim().min(2, "Enter a company or team name."),
  budget: z.string().trim().min(2, "Add a rough budget or scope."),
  scope: z.string().trim().min(12, "Describe the project scope in more detail."),
  message: z.string().trim().min(24, "Add more context so the request is useful."),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;
