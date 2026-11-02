"use client";

import dynamic from "next/dynamic";

/** Not needed for the first screen, and it only ever renders in the browser. */
export const CookieNoticeLazy = dynamic(() => import("./CookieNotice").then((m) => m.CookieNotice), { ssr: false });
