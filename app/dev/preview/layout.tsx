export const metadata = {
  title: "Visual System",
  robots: { index: false, follow: false },
};

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
