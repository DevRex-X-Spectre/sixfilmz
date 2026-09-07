import { ArrowRight, Camera, Clapperboard, Video } from "lucide-react";
import { services } from "../data/content";
import { Reveal } from "./Reveal";

const icons = {
  clapperboard: Clapperboard,
  camera: Camera,
  video: Video,
};

export function Services() {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-16 text-sm font-light uppercase tracking-widest text-gray-400">
            Services
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <Reveal key={service.id} variant={service.reveal} delay={service.delay}>
                <a href={service.href} className="service-card group relative block cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-950 transition-all duration-700 group-hover:border-gray-700/50">
                    <div className="absolute inset-0 opacity-35">
                      <img
                        src={service.image}
                        alt=""
                        className="service-image h-full w-full object-cover transition-all duration-700 ease-out"
                      />
                    </div>
                    <div
                      className={`service-glow absolute inset-0 bg-gradient-to-br transition-all duration-700 ${service.glow}`}
                    />
                    <div className="relative z-10 flex h-full flex-col justify-between p-8">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-800/80">
                        <Icon className="h-7 w-7 text-gray-300" />
                      </div>
                      <div>
                        <h3 className="mb-3 text-2xl font-medium tracking-tight">
                          {service.title}
                        </h3>
                        <p className="text-sm font-light leading-relaxed text-gray-400">
                          {service.description}
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 transition-colors duration-500 group-hover:text-white">
                          <span className="font-light">Explore</span>
                          <ArrowRight className="h-4 w-4 transform transition-transform duration-500 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
