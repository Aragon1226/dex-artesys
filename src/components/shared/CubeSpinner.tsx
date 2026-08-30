import { BrandLoader } from "@/components/shared/BrandLoader";

interface CubeSpinnerProps {
  fullScreen?: boolean;
  label?: string;
}

const CubeSpinner = ({ fullScreen, label }: CubeSpinnerProps) => {
  const content = <BrandLoader size={fullScreen ? 64 : 40} label={label} />;

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  return content;
};

export default CubeSpinner;
