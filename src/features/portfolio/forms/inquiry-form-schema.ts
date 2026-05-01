import { z } from "zod/v4";

export const inquiryFormSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters."),
  email: z.email("Enter a valid email address."),
  message: z.string().trim().min(24, "Add more context so the request is useful."),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;
