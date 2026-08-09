import type { JSX } from "react";

interface ButtonProps {
  text: string;
  disabled?: boolean;
  isSubmitting?: boolean;
}

export const Button = ({
  text,
  disabled = false,
  isSubmitting = false,
}: ButtonProps): JSX.Element => {
  return (
    <button
      disabled={disabled || isSubmitting}
      className="cursor-pointer w-full rounded-xl bg-positive px-4 py-4 font-bold uppercase text-black disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Loading..." : text}
    </button>
  );
};
