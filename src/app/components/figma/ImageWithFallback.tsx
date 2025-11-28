"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  style,
  ...rest
}: ImageProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  return (
    <div
      className={`relative bg-gray-100 ${className ?? ""}`}
      style={{ width: width || "100%", height: height || "100%", ...style }}
    >
      <Image
        src={didError || !src ? ERROR_IMG_SRC : src}
        alt={alt || "image"}
        fill
        style={{ objectFit: didError || !src ? "contain" : "cover" }}
        onError={handleError}
        {...rest}
      />
    </div>
  );
}
