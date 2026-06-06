import { useEffect, useState } from "react";

export default function GameEndDisplayer({
  gameEnded,
}: {
  gameEnded: "victory" | "defeat" | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false); // controls dark + blur
  const [modalIn, setModalIn] = useState(false);

  useEffect(() => {
    if (gameEnded !== null) {
      setMounted(true);

      const t1 = setTimeout(() => {
        setActive(true); // start dim + blur after 1s
      }, 1000);

      const t2 = setTimeout(() => {
        setModalIn(true); // slide modal in slightly after
      }, 1400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setMounted(false);
      setActive(false);
      setModalIn(false);
    }
  }, [gameEnded]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className={[
          "absolute inset-0 transition-all duration-700",
          active ? "bg-black/60 backdrop-blur-md" : "bg-black/0 backdrop-blur-0",
        ].join(" ")}
      />

      {/* MODAL */}
      <div
        className={[
          "relative w-80 h-40 rounded-md bg-gray-700",
          "transition-all duration-700 ease-out",
          modalIn
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-95",
        ].join(" ")}
      />
    </div>
  );
}