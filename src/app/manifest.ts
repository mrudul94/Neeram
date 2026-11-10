import type { MetadataRoute } from "next";

/** Name and icons when the site is added to a phone's home screen. Icons are in public/images/favicon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Neeram Coconut Oil",
    short_name: "Neeram",
    start_url: "/",
    display: "standalone",
    background_color: "#eee8dc",
    theme_color: "#16130f",
    icons: [
      { src: "/images/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
