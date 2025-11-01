"use client";

import React from "react";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string; // optional background image
}

export function HeroSection({ title, subtitle, backgroundImage }: HeroSectionProps) {
  return (
    <section
      className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(
            to right,
            var(--primary),
            var(--secondary)
          )${backgroundImage ? `, url(${backgroundImage})` : ""}
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Optional dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-6xl mb-4">{title}</h1>
        {subtitle && (
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
