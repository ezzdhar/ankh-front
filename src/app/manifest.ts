import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ANKH Fashion Store",
    short_name: "ANKH",
    description:
      "Modern fashion store offering high-quality clothing and accessories.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8EF",
    theme_color: "#3A0F0E",
    icons: [
      {
        src: "/logo_white.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
