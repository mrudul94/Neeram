import { ButtonLink, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="wrap py-24 md:py-32">
      <Eyebrow>404</Eyebrow>
      <h1 className="display mt-4 text-[clamp(4rem,10vw,8rem)]">
        Not on
        <br />
        this shelf.
      </h1>
      <p className="mt-6 font-serif text-xl text-muted">The page you were looking for isn&apos;t here.</p>
      <ButtonLink href="/shop" arrow className="mt-8">
        See the shelf
      </ButtonLink>
    </div>
  );
}
