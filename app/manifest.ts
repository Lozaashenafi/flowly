// app/manifest.ts
import { MetadataRoute } from "next";

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
        src: "../public/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "../public/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
