import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Cursor } from "@/components/ui/Cursor";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Cursor />
    </>
  );
}
