import { photographyWorks } from "../data/content";

export function Filmstrip() {
  const frames = [...photographyWorks, ...photographyWorks];

  return (
    <div className="filmstrip" aria-hidden="true">
      <div className="filmstrip-track">
        {frames.map((item, index) => (
          <img
            key={`${item.id}-${index}`}
            src={item.src}
            alt=""
            className="filmstrip-frame"
          />
        ))}
      </div>
    </div>
  );
}
