"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";

interface Client {
  id: string;
  name: string;
  logoUrl: string;
  category: string;
  subsidiary: string | null;
}

const filterCategories = [
  "All",
  "Contract Client",
  "Campaign Client",
  "Other Client",
];

export default function ClientShowcase() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredClients(clients);
    } else {
      setFilteredClients(
        clients.filter((client) => client.category === activeFilter),
      );
    }
  }, [activeFilter, clients]);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Carousel state & logic ---
  const [perPage, setPerPage] = useState<number>(4);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompactDots, setIsCompactDots] = useState<boolean>(false);

  // Touch / pointer refs for swipe
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const pages = useMemo(() => {
    if (filteredClients.length === 0) return [] as Client[][];
    const p: Client[][] = [];
    for (let i = 0; i < filteredClients.length; i += perPage) {
      p.push(filteredClients.slice(i, i + perPage));
    }
    return p;
  }, [filteredClients, perPage]);

  useEffect(() => {
    const updatePerPage = () => {
      const w = window.innerWidth;
      // Compact dots on very small screens
      setIsCompactDots(w < 640);
      if (w < 768) setPerPage(1);
      else if (w < 1024) setPerPage(2);
      else setPerPage(4);
    };

    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  // Reset to first page when filter or perPage changes
  useEffect(() => setCurrentPage(0), [filteredClients, perPage]);

  // Auto-rotate (pauseable)
  useEffect(() => {
    if (pages.length <= 1) return;
    const id = setInterval(() => {
      if (!isPaused) setCurrentPage((c) => (c + 1) % pages.length);
    }, 4000);
    return () => clearInterval(id);
  }, [pages, isPaused]);

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches?.[0]?.clientX ?? null;
    touchDeltaX.current = 0;
    setIsPaused(true);
  };

  const handleTouchMove = (e: any) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches?.[0]?.clientX - touchStartX.current;
    }
  };

  const handleTouchEnd = () => {
    const THRESHOLD = 50; // px
    if (Math.abs(touchDeltaX.current) > THRESHOLD) {
      if (touchDeltaX.current > 0) {
        setCurrentPage((c) => (c - 1 + pages.length) % pages.length);
      } else {
        setCurrentPage((c) => (c + 1) % pages.length);
      }
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    // Small delay before autoplay resumes so the user can see the result
    setTimeout(() => setIsPaused(false), 700);
  };

  // Keyboard navigation (only when carousel is focused)
  const handleKeyDown = useCallback(
    (e: any) => {
      if (!pages.length) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentPage((c) => (c - 1 + pages.length) % pages.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentPage((c) => (c + 1) % pages.length);
      } else if (e.key === " " || e.key === "Spacebar") {
        // Space toggles pause/resume
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    },
    [pages.length],
  );

  return (
    <section className="py-section md:py-20 bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-12">
          <p className="section-label text-[#1A4A94] mb-2">Our partners</p>
          <h2 className="font-serif text-ox-h2 md:text-3xl font-semibold text-[#0F2942]">
            Client Showcase
          </h2>
          <p className="text-gray-600 mt-2">Trusted by leading brands across Myanmar</p>
          <div className="section-title-bar mt-3" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-12">
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === category
                  ? "bg-[#1A4A94] text-white"
                  : "bg-[#F8F9FA] border border-[#E9ECEF] text-gray-700 hover:border-[#1A4A94] hover:text-[#1A4A94]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-ret h-28 md:h-32 animate-pulse" />
            ))}
          </div>
        ) : filteredClients.length > 0 ? (
          <>
            {pages.length <= 1 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="card-ret p-3 box-border min-w-0 aspect-square flex items-center justify-center"
                  >
                    <div className="relative w-3/4 h-3/4 overflow-hidden">
                      <Image
                        src={
                          client.logoUrl ||
                          "https://via.placeholder.com/150x100?text=Client+Logo"
                        }
                        alt={client.name}
                        fill
                        className="object-contain object-center p-2"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="relative touch-pan-y"
                ref={carouselRef}
                role="region"
                aria-label="Client Showcase Carousel"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-700 ease-out"
                    style={{
                      width: `${pages.length * 100}%`,
                      transform: `translateX(-${currentPage * (100 / pages.length)}%)`,
                    }}
                  >
                    {pages.map((page, idx) => (
                      <div
                        key={idx}
                        className={`w-full flex gap-4 transition-opacity duration-500 ease-in-out box-border overflow-hidden`}
                        style={{
                          width: `${100 / pages.length}%`,
                          opacity: currentPage === idx ? 1 : 0.45,
                        }}
                      >
                        {page.map((client) => (
                          <div
                            key={client.id}
                            className="card-ret p-3 box-border min-w-0 aspect-square flex items-center justify-center"
                            style={{ flex: `0 0 ${100 / perPage}%` }}
                          >
                            <div className="relative w-3/4 h-3/4 overflow-hidden">
                              <Image
                                src={
                                  client.logoUrl ||
                                  "https://via.placeholder.com/150x100?text=Client+Logo"
                                }
                                alt={client.name}
                                fill
                                className="object-contain object-center p-2"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                  <button
                    aria-label="Previous"
                    onClick={() =>
                      setCurrentPage(
                        (c) => (c - 1 + pages.length) % pages.length,
                      )
                    }
                    className="px-2 py-1 text-sm rounded bg-[#F8F9FA] hover:bg-[#E9ECEF]"
                  >
                    Prev
                  </button>

                  <div className="flex items-center gap-3 sm:gap-2 overflow-x-auto px-1">
                    {isCompactDots ? (
                      // Compact: show prev/current/next and numeric indicator on very small screens
                      <div className="flex items-center gap-2">
                        {pages.length <= 3
                          ? pages.map((_, i) => (
                              <button
                                key={i}
                                aria-label={`Go to slide ${i + 1}`}
                                aria-current={
                                  currentPage === i ? "true" : "false"
                                }
                                onClick={() => setCurrentPage(i)}
                                className={`w-4 h-4 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A4A94] ${currentPage === i ? "bg-[#1A4A94]" : "bg-gray-300"}`}
                              />
                            ))
                          : (() => {
                              const prev =
                                (currentPage - 1 + pages.length) % pages.length;
                              const next = (currentPage + 1) % pages.length;
                              return (
                                <>
                                  <button
                                    key={prev}
                                    aria-label={`Go to slide ${prev + 1}`}
                                    onClick={() => setCurrentPage(prev)}
                                    className={`w-3 h-3 rounded-full ${currentPage === prev ? "bg-[#1A4A94]" : "bg-gray-300"}`}
                                  />
                                  <button
                                    key={currentPage}
                                    aria-label={`Go to slide ${currentPage + 1}`}
                                    aria-current="true"
                                    onClick={() => setCurrentPage(currentPage)}
                                    className={`w-4 h-4 rounded-full bg-[#1A4A94]`}
                                  />
                                  <button
                                    key={next}
                                    aria-label={`Go to slide ${next + 1}`}
                                    onClick={() => setCurrentPage(next)}
                                    className={`w-3 h-3 rounded-full ${currentPage === next ? "bg-[#1A4A94]" : "bg-gray-300"}`}
                                  />
                                  <span className="ml-2 text-sm text-gray-600">{`${currentPage + 1} / ${pages.length}`}</span>
                                </>
                              );
                            })()}
                      </div>
                    ) : (
                      // Full dots on larger screens
                      <div className="flex items-center gap-2">
                        {pages.map((_, i) => (
                          <button
                            key={i}
                            aria-label={`Go to slide ${i + 1}`}
                            aria-current={currentPage === i ? "true" : "false"}
                            onClick={() => setCurrentPage(i)}
                            className={`w-4 h-4 sm:w-3 sm:h-3 md:w-2 md:h-2 min-w-[16px] md:min-w-[12px] rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A4A94] ${currentPage === i ? "bg-[#1A4A94]" : "bg-gray-300"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    aria-label="Next"
                    onClick={() =>
                      setCurrentPage((c) => (c + 1) % pages.length)
                    }
                    className="px-2 py-1 text-sm rounded bg-[#F8F9FA] hover:bg-[#E9ECEF]"
                  >
                    Next
                  </button>
                </div>

                {/* ARIA live region for screen readers (visually hidden) */}
                <div className="sr-only" aria-live="polite">
                  {`Showing slide ${currentPage + 1} of ${pages.length}`}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="card-ret p-8 max-w-md mx-auto">
              <p className="text-gray-600 font-medium mb-2">No clients found</p>
              <p className="text-gray-500 text-sm">
                {activeFilter === "All"
                  ? "No clients have been added yet."
                  : `No clients found in the "${activeFilter}" category.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
