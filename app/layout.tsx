import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReadyTogether | A plan for what comes next",
  description: "Build a private, personalized household emergency plan in under a minute.",
  applicationName: "ReadyTogether",
  keywords: ["emergency plan", "preparedness", "accessibility", "community safety"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
