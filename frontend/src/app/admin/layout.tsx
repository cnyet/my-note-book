import AdminLayoutContent from "@/components/admin/AdminLayoutContent";
import { Toaster } from "@/components/ui/sonner";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      <Toaster />
    </AntdRegistry>
  );
}
