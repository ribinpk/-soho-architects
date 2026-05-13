import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ContactFab } from "@/components/site/ContactFab";
import { Cursor } from "@/components/ui/Cursor";
import { EventTracker } from "@/components/analytics/EventTracker";
import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";

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
      <ContactFab />
      <Cursor />
      <EventTracker />
      <WebVitalsReporter />
    </>
  );
}
