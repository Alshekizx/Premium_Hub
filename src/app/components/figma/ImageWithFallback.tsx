"use client";
import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";


const ERROR_IMG_SRC = "..."; // keep your existing base64 fallback

interface ImageWithAlternateProps extends Omit<ImageProps, 'src'> {
  srcList: string[];
  interval?: number;
  fadeDuration?: number; // in milliseconds
}

export default function ImageWithAlternate({
  srcList,
  alt,
  width,
  height,
  className,
  style,
  interval = 5000,
  fadeDuration = 1000,
  ...rest
}: ImageWithAlternateProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [didError, setDidError] = useState(false);

  useEffect(() => {
    if (srcList.length < 2) return;

    const timer = setInterval(() => {
      setPreviousIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % srcList.length);
      setDidError(false);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, interval, srcList.length]);

  const handleError = () => setDidError(true);

  return (
    <div
      className={`relative bg-gray-100 overflow-hidden ${className ?? ""}`}
      style={{ width: width || "100%", height: height || "100%", ...style }}
    >
      {previousIndex !== null && (
        <Image
          {...rest}
          src={srcList[previousIndex] || ERROR_IMG_SRC}
          alt={alt || "image"}
          fill
          style={{
            objectFit: "cover",
            opacity: 0,
            transition: `opacity ${fadeDuration}ms ease-in-out`,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          onError={handleError}
        />
      )}
      <Image
        {...rest}
        src={didError || !srcList[currentIndex] ? ERROR_IMG_SRC : srcList[currentIndex]}
        alt={alt || "image"}
        fill
        style={{
          objectFit: "cover",
          opacity: 1,
          transition: `opacity ${fadeDuration}ms ease-in-out`,
          position: "absolute",
          top: 0,
          left: 0,
        }}
        onError={handleError}
      />
    </div>
  );
}


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
