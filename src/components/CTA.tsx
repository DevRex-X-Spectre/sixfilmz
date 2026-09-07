import { Reveal } from "./Reveal";

type Props = {
  onOpenContact: () => void;
};

export function CTA({ onOpenContact }: Props) {
  return (
    <section id="contact-section" className="scroll-mt-28 px-5 py-28 sm:px-6 sm:py-48">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="font-cinematic mb-12 text-3xl font-light tracking-wider md:text-5xl lg:text-6xl text-white">
            Ready to create something <span className="font-semibold italic text-white">timeless</span>?
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
