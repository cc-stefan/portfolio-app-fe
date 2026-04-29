import { redirect } from "next/navigation";
import { defaultLocale } from "@/features/portfolio/i18n/routing";

export default function Home() {
  redirect(`/${defaultLocale}`);
}
