"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface BannerSlide {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  imageUrl: string;
}

interface BannerCarouselProps {
  banners: BannerSlide[];
  defaultTitle: string;
  defaultSubtitle?: string;
  accentColor?: string;
}

export default function BannerCarousel({
  banners,
  defaultTitle,
  defaultSubtitle,
  accentColor = "#FFC107",
}: BannerCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const current = banners[index];

  return (
    <div className="relative w-full h-[260px] md:h-[320px] lg:h-[380px] overflow-hidden rounded-none bg-[#0F2942]">
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={banner.imageUrl}
              alt={banner.title || defaultTitle}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/10 pointer-events-none" />
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col justify-center max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight text-white drop-shadow-md">
          {current.title || defaultTitle}
        </h1>
        {(current.subtitle || defaultSubtitle) && (
          <p className="text-xs md:text-sm lg:text-base text-white/90 max-w-2xl leading-relaxed drop-shadow-md">
            {current.subtitle || defaultSubtitle}
          </p>
        )}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full border border-white/60 transition-all ${
                i === index
                  ? "w-6 bg-white"
                  : "bg-black/30 hover:bg-white/70"
              }`}
              style={i === index ? { backgroundColor: accentColor } : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

