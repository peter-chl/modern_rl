import type { Metadata } from "next";
import Shell from "@/components/Shell";
import "./globals.css";

const SITE_URL = "https://peter-chl.github.io/modern_rl";
const SITE_NAME = "modern_rl";
const DESCRIPTION =
  "Notes on modern reinforcement learning — Markov decision processes and policy gradients, then RL for language models, vision-language models, image and video generators, and vision-language-action models — with the arguments written out in full.";

export const metadata: Metadata = {
  title: {
    default: "Modern Reinforcement Learning — Notes",
    template: "%s — modern_rl",
  },
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Modern Reinforcement Learning",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
