import type { MediaItem } from "../data/content";
import { photographyWorks } from "../data/content";
import { Reveal } from "./Reveal";
import { WorkCard } from "./WorkCard";

type Props = {
  onOpen: (item: MediaItem) => void;
};

const spans = [
  "photo-span-3 md:min-h-[380px]",
  "photo-span-3 md:min-h-[380px]",
  "photo-span-2 md:min-h-[300px]",
  "photo-span-2 md:min-h-[300px]",
  "photo-span-2 md:min-h-[300px]",
  "photo-span-6 md:min-h-[320px]",
];

export function Photography({ onOpen }: Props) {
  return (
    <section id="photography-section" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-4 text-sm font-light uppercase tracking-widest text-gray-400">
            Photography
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-12 max-w-xl text-2xl font-light tracking-tight text-white md:text-4xl">
            Still frames from a moving world.
          </p>
        </Reveal>

        <div className="photo-bento">
          {photographyWorks.map((item, index) => (
            <WorkCard
              key={item.id}
              item={item}
              delay={(index % 3) * 0.08}
              onOpen={onOpen}
              className={spans[index] ?? "photo-span-2"}
              fill
              framed={index % 4 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
