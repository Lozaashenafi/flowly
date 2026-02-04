import { MetadataRoute } from "next";

// This line is MANDATORY for 'output: export'
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flowly - Personal Finance App",
    short_name: "Flowly",
    description: "Track your income and expenses easily.",
    start_url: "/",
    display: "standalone",
    background_color: "#477A71",
    theme_color: "#477A71",
    icons: [
      {
        src: "/icon-192.png", // Corrected: removed ../public
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png", // Corrected: removed ../public
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
