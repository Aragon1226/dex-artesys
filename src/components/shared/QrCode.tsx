import React, { useEffect, useRef, useState } from "react";

export interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * Renders a QR code locally (no remote image service), so deposit addresses
 * still show a scannable code offline.
 */
export const QrCode: React.FC<QrCodeProps> = ({
  value,
  size = 148,
  className = "",
  alt = "QR code",
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const latest = useRef(value);

  useEffect(() => {
    latest.current = value;
    let cancelled = false;
    if (!value) {
      setDataUrl(null);
      return;
    }
    void (async () => {
      try {
        const { toDataURL } = await import("qrcode");
        const url = await toDataURL(value, {
          width: size * 2,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
        });
        if (!cancelled && latest.current === value) setDataUrl(url);
      } catch {
        if (!cancelled) setDataUrl(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className={`animate-pulse rounded-lg bg-muted ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
    />
  );
};

export default QrCode;
