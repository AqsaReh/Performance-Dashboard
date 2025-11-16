import { ReactNode } from "react";

interface ErrorLayoutProps {
  children: ReactNode;
}

export default function ErrorLayout({ children }: ErrorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
