import { createFileRoute } from "@tanstack/react-router";
import CustomerService from "@/components/pages/admin/CustomerService";

export const Route = createFileRoute("/admin/customer-service")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Customer Service — CrypX-Pro Admin" },
      { name: "description", content: "Reply to live customer service chats from CrypX-Pro users." },
      { property: "og:title", content: "Customer Service — CrypX-Pro Admin" },
      { property: "og:description", content: "Reply to live customer service chats from CrypX-Pro users." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <CustomerService />,
});
