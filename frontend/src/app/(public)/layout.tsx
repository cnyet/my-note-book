import { Header } from "@/components/common/Header";
import { PublicFooter } from "@/components/common/PublicFooter";
import { ParticleBg } from "@/components/v-ui/ParticleBg";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ParticleBg />
      <Header />
      <main className="flex-grow">{children}</main>
      <PublicFooter />
    </>
  );
}
