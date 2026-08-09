import type { JSX } from "react";

export const Logo = (): JSX.Element => {
  return (
    <div className="flex gap-2 items-center">
      <div
        aria-hidden="true"
        className="flex items-center justify-center h-10 w-10 rounded-xl bg-positive text-black font-bold"
      >
        M
      </div>
      <div className="font-bold uppercase text-2xl font-display">Muscle Memory</div>
    </div>
  );
};
