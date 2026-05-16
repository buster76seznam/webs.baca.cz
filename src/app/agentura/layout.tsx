import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Klientská zóna",
  robots: { index: false, follow: false },
};

export default function AgenturaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
