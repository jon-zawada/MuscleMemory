import type { JSX } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "./Logo";

export const PageLayout = (): JSX.Element => {
  const { isLoading } = useAuth();
  if (isLoading) return <div>LOADING...</div>; //TODO: make a real component
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4 py-8">
      <div className="w-full md:max-w-md md:rounded-2xl md:border md:border-surface md:p-8">
        <div className="mb-8">
          <Logo />
        </div>
        <Outlet />
      </div>
    </div>
  );
};
