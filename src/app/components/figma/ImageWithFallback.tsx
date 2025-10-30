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

  if (didError || !src) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
        style={{ position: "relative", width, height, ...style }}
      >
        <Image
          src={ERROR_IMG_SRC}
          alt="Error loading image"
          fill
          style={{ objectFit: "contain" }}
          {...rest}
        />
      </div>
    );
  }

  return (
  <div
    className={`relative ${className ?? ""}`}
    style={{ width: width || "100%", height: height || "100%", ...style }}
  >
    <Image
      src={src}
      alt={alt || "image"}
      fill={!width || !height}
      width={width}
      height={height}
      style={{ objectFit: "cover" }}
      onError={handleError}
      {...rest}
    />
  </div>
);
}
