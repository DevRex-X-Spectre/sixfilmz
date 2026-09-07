import type { MediaItem } from "../data/content";
import { selectedWorks } from "../data/content";
import { Reveal } from "./Reveal";
import { WorkCard } from "./WorkCard";

type Props = {
  onOpen: (item: MediaItem) => void;
};

export function SelectedWorks({ onOpen }: Props) {
  const [featured, left, right, wide] = selectedWorks;
  if (!featured || !left || !right || !wide) return null;

  return (
    <section id="results-section" className="scroll-mt-28 px-4 pt-24 pb-24 sm:px-6 sm:pt-32 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-4 text-sm font-light uppercase tracking-widest text-gray-400">
            Selected Works
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-12 max-w-xl text-2xl font-light tracking-tight md:text-4xl">
            A cut of cinema, stills, and brand film.
          </p>
        </Reveal>

        <div className="space-y-10 md:space-y-16">
          <WorkCard item={featured} overlay="bottom-lg" onOpen={onOpen} framed />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            <WorkCard
              item={left}
              delay={0.1}
              onOpen={onOpen}
              className="md:mt-10"
              tilt="left"
            />
            <WorkCard
              item={right}
              delay={0.2}
              onOpen={onOpen}
              className="md:-mt-6"
              tilt="right"
            />
          </div>

          <WorkCard item={wide} overlay="bottom-lg" onOpen={onOpen} />
        </div>
      </div>
    </section>
  );
}
