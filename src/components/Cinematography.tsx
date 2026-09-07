import type { MediaItem } from "../data/content";
import { cinematographyFeatured, cinematographyWorks } from "../data/content";
import { Reveal } from "./Reveal";
import { WorkCard } from "./WorkCard";

type Props = {
  onOpen: (item: MediaItem) => void;
};

export function Cinematography({ onOpen }: Props) {
  return (
    <section
      id="cinematography-section"
      className="scroll-mt-28 bg-gradient-to-b from-black via-gray-950 to-black px-4 py-24 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-6 text-sm font-light uppercase tracking-widest text-gray-400">
            Cinematography
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-16 max-w-2xl text-lg font-light leading-relaxed text-gray-400">
            Aerial cinema, grounded coverage, and motion design. Water, color,
            and form composed as moving pictures.
          </p>
        </Reveal>

        <div className="space-y-8">
          <WorkCard
            item={cinematographyFeatured}
            overlay="bottom-lg"
            onOpen={onOpen}
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {cinematographyWorks.map((item, index) => (
              <WorkCard
                key={item.id}
                item={item}
                delay={index * 0.1}
                overlay="bottom-lg"
                onOpen={onOpen}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
