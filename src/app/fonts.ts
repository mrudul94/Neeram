import { Anton, Baloo_Chettan_2, Inter, Newsreader, Noto_Sans_Malayalam } from "next/font/google";

export const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });

export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const balooChettan = Baloo_Chettan_2({
  weight: ["600", "800"],
  subsets: ["malayalam", "latin"],
  variable: "--font-baloo-chettan",
  display: "swap",
});

export const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  variable: "--font-noto-ml",
  display: "swap",
});

export const fontVariables = [anton, newsreader, inter, balooChettan, notoMalayalam].map((f) => f.variable).join(" ");
