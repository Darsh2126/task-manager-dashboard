import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Task Manager",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
