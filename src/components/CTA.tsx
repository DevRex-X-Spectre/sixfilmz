import { Reveal } from "./Reveal";

type Props = {
  onOpenContact: () => void;
};

export function CTA({ onOpenContact }: Props) {
  return (
    <section id="contact-section" className="scroll-mt-28 px-5 py-28 sm:px-6 sm:py-48">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="mb-12 text-4xl font-light tracking-tight md:text-6xl lg:text-7xl">
            Ready to create something <span className="font-medium">timeless</span>?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <button type="button" className="shiny-cta text-base" onClick={onOpenContact}>
            <span>Let&apos;s create something timeless</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
