import type { MediaItem } from "../data/content";
import { videographyWorks } from "../data/content";
import { Reveal } from "./Reveal";
import { WorkCard } from "./WorkCard";

type Props = {
  onOpen: (item: MediaItem) => void;
};

export function Videography({ onOpen }: Props) {
  const [featured, second, ...rest] = videographyWorks;
  if (!featured || !second) return null;

  return (
    <section
      id="videography-section"
      className="scroll-mt-28 bg-gradient-to-b from-black via-gray-950 to-black px-4 py-24 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-4 text-sm font-light uppercase tracking-widest text-gray-400">
            Videography
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-12 max-w-xl text-2xl font-light tracking-tight md:text-4xl">
            Commercials, events, and stories in motion.
          </p>
        </Reveal>

        <div className="space-y-8 md:space-y-12">
          <WorkCard item={featured} overlay="bottom-lg" onOpen={onOpen} framed />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end">
            <WorkCard
              item={second}
              delay={0.1}
              overlay="bottom-lg"
              onOpen={onOpen}
              className="md:mt-8"
            />
            {rest[0] && (
              <WorkCard
                item={rest[0]}
                delay={0.2}
                overlay="bottom-lg"
                onOpen={onOpen}
                className="md:mb-8"
              />
            )}
          </div>

          {rest.slice(1).map((item, index) => (
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
    </section>
  );
}
