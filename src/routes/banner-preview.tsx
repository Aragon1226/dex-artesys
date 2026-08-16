import { createFileRoute } from "@tanstack/react-router";
import BannerSlideshow from "@/components/BannerSlideshow";

export const Route = createFileRoute("/banner-preview")({
  ssr: false,
  component: () => (
    <div className="min-h-screen bg-background py-6">
      <BannerSlideshow />
    </div>
  ),
});
