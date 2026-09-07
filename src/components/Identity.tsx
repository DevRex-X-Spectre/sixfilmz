import { Reveal } from "./Reveal";

export function Identity() {
  return (
    <section
      id="identity"
      className="flex min-h-[70svh] items-center justify-center px-5 pt-24 pb-24 sm:min-h-screen sm:px-6 sm:pt-32 sm:pb-32"
    >
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="text-3xl font-light leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Crafting visuals where <span className="font-medium">light</span>,{" "}
            <span className="font-medium">form</span> and{" "}
            <span className="font-medium">emotion</span> collide.
          </p>
        </Reveal>
        <div className="mt-16 flex justify-center">
          <Reveal variant="line-reveal" className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
        </div>
      </div>
    </section>
  );
}
