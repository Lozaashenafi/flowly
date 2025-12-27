import type { Metadata, ResolvingMetadata } from "next";
import Dashboard from "../src/presentation/pages/Dashboard";

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentMetadata = await parent;

  return {
    title: "Flowly - Personal Finance App",
    description:
      "Track your income and expenses easily. Your data stays on your device, and it works as a PWA!",
    openGraph: {
      ...parentMetadata.openGraph,
      title: "Flowly - Personal Finance App",
      description:
        "Track your income and expenses easily. Your data stays on your device, and it works as a PWA!",
    },
    twitter: {
      ...parentMetadata.twitter,
      title: "Flowly - Personal Finance App",
      description:
        "Track your income and expenses easily. Your data stays on your device, and it works as a PWA!",
      images: ["https://flowly-finance.vercel.app/preview.png"],
    },
  };
}

export default function Page() {
  return <Dashboard />;
}
