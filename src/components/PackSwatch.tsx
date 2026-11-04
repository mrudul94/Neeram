import Image from "next/image";
import type { Pack } from "@/data/products";
import { cx } from "./ui";

/** The picture and labels inside a size button; the button around it sets the colours. */
export function PackSwatch({ pack, sizeClassName, formClassName }: { pack: Pack; sizeClassName?: string; formClassName?: string }) {
  return (
    <>
      <span className="grid h-14 w-full place-items-center">
        <Image src={pack.thumb.src} alt="" width={pack.thumb.width} height={pack.thumb.height} sizes="4rem" className="max-h-14 w-auto max-w-full object-contain" />
      </span>
      <span className={cx("text-sm leading-none font-medium", sizeClassName)}>{pack.size}</span>
      <span className={cx("eyebrow text-[0.5625rem] leading-none", formClassName)}>{pack.form === "Packet" ? "Packet" : "Bottle"}</span>
    </>
  );
}
