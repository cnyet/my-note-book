import { Header } from "@/components/common/Header";
import { CyberBackground } from "@/components/ui/CyberBackground";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CyberBackground />
      <Header />
      <main className="flex-grow">{children}</main>
    </>
  );
}
