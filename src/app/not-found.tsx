import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section band="paper">
      <div className="max-w-2xl">
        <p className="text-slate">404</p>
        <h1 className="mt-3">That page has moved or never existed.</h1>
        <p className="mt-5 text-slate">Try the robots, the industry pages, or book a demo.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/products" variant="secondary">See the robots</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
