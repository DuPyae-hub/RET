import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";
import {
  FastForward,
  Users,
  Map,
  MapPin,
  Smartphone,
  Smile,
  Sparkles,
} from "lucide-react";
import ClientShowcase from "@/components/ClientShowcase";
import ScrollAnimation from "@/components/ScrollAnimation";
import StatsCards from "@/components/StatsCards";

// Force dynamic rendering to ensure settings updates are reflected immediately
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Disable all caching
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

async function getSiteSettings() {
  // Default values - only used if database query fails or returns no data
  const defaults = {
    mission: "Work Together to Build Our Business.",
    vision: "Be an Excellent Service Provider for Our Every Client.",
    history:
      "Established since 2007, providing professional overall Advertising & Media Services across the whole Myanmar territory.",
    attitude: "Learn to work hard on yourself; We have no competitor.",
    coreValues:
      'Focus on being a "corporate partner," ensuring "complete satisfaction," and commitment to "quality and efficiency of outcome".',
  };

  try {
    const rows = await query<{ key: string; value: string }[]>(
      'SELECT `key`, `value` FROM site_settings WHERE `key` IN ("mission","vision","history","attitude","coreValues")',
    );

    // Handle mysql2 RowDataPacket format - it returns an array
    const rowsArray = Array.isArray(rows) ? rows : [];

    // If no rows returned, use defaults
    if (rowsArray.length === 0) {
      console.log("No settings found in database, using defaults");
      return defaults;
    }

    // Build settings object from database - ALWAYS use database values
    const settings: Record<string, string> = {};

    // Process rows - mysql2 returns RowDataPacket objects
    rowsArray.forEach((row: any) => {
      // Access properties - mysql2 uses lowercase column names by default
      const key = row.key || row.KEY || row["key"] || row["KEY"];
      const value = row.value || row.VALUE || row["value"] || row["VALUE"];

      if (key) {
        // Always use database value, even if empty string
        settings[String(key)] =
          value !== null && value !== undefined ? String(value) : "";
      }
    });

    // Log for debugging
    console.log("=== Settings from Database ===");
    console.log("Rows found:", rowsArray.length);
    console.log("Settings object:", settings);

    // Return database values, fallback to defaults if key is missing or the value is empty
    const orDefault = (value: any, fallback: string) => {
      const v = value === undefined || value === null ? "" : String(value);
      return v.trim() !== "" ? v : fallback;
    };

    return {
      mission: orDefault(settings.mission, defaults.mission),
      vision: orDefault(settings.vision, defaults.vision),
      history: orDefault(settings.history, defaults.history),
      attitude: orDefault(settings.attitude, defaults.attitude),
      coreValues: orDefault(settings.coreValues, defaults.coreValues),
    };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    // Only use defaults if there's an error
    return defaults;
  }
}

async function getLegalDocuments() {
  try {
    const rows = await query<any[]>(
      "SELECT id, title, description, documentUrl, type, createdAt, updatedAt FROM LegalDocument ORDER BY createdAt DESC LIMIT 6",
    );

    const docs = Array.isArray(rows) ? rows : [];

    // For each document, detect whether the stored URL points to an image (HEAD request)
    return await Promise.all(
      docs.map(async (r) => {
        const doc = {
          id: r.id || r.ID,
          title: r.title || r.TITLE || r.name || "",
          description: r.description || r.DESCRIPTION || null,
          documentUrl: r.documentUrl || r.DOCUMENTURL || null,
          type: r.type || r.TYPE || null,
          createdAt: r.createdAt || r.CREATEDAT || null,
          updatedAt: r.updatedAt || r.UPDATEDAT || null,
        } as any;

        // Determine whether the documentUrl or imageUrl is an image.
        // Prefer documentUrl if it is an image; otherwise fallback to imageUrl.
        const tryIsImage = async (url: string | null) => {
          if (!url) return false;
          // quick extension check
          if (
            /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) ||
            url.startsWith("data:image")
          )
            return true;

          // If the URL is from our image API, treat it as an image
          if (url.startsWith("/api/image/")) return true;

          // If it's a local public path (starts with /), avoid making HEAD requests and fall back to file checks
          if (url.startsWith("/")) {
            try {
              const fs = require("fs");
              const path = require("path");
              const publicPath = path.join(
                process.cwd(),
                "public",
                url.replace(/^\//, ""),
              );
              if (fs.existsSync(publicPath)) {
                if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(publicPath))
                  return true;
              }
            } catch (e) {
              // ignore
            }
            return false;
          }

          try {
            const res = await fetch(url, { method: "HEAD" });
            const ct = res.headers.get("content-type") || "";
            return ct.startsWith("image/");
          } catch (e) {
            return false;
          }
        };

        const normalizeUrl = (u: string) => {
          if (!u) return u;
          let s = String(u);
          // strip file:// prefix
          s = s.replace(/^file:\/+/, "");
          // If path includes /public/, convert to web path under / (e.g. /public/legal/... -> /legal/...)
          s = s.replace(/^.*\/public\//, "/");
          // If it starts with 'public/', add leading slash
          s = s.replace(/^public\//, "/");
          // If someone stored just a filename, assume it's under /legal/
          if (!s.startsWith("/") && !/^https?:\/\//i.test(s)) {
            s = "/legal/" + s;
          }
          return s;
        };

        const srcCandidates = [
          doc.documentUrl,
          (r as any).imageUrl || null,
        ].filter(Boolean) as string[];

        let isImage = false;
        let imageSrc: string | null = null;

        for (const rawCandidate of srcCandidates) {
          const candidate = normalizeUrl(rawCandidate);
          // Log normalized candidate for debugging
          console.log(
            "[getLegalDocuments] candidate:",
            rawCandidate,
            "->",
            candidate,
          );
          if (await tryIsImage(candidate)) {
            isImage = true;
            imageSrc = candidate;
            console.log("[getLegalDocuments] image detected for", candidate);
            break;
          }
        }

        // If none of the candidates are images, still pick the first normalized candidate as the href
        if (!imageSrc && srcCandidates.length > 0) {
          imageSrc = normalizeUrl(srcCandidates[0]);
        }

        return { ...doc, isImage, imageSrc };
      }),
    );
  } catch (error) {
    console.error("Error fetching legal documents:", error);
    return [];
  }
}

async function getOrganizationChartUrl() {
  try {
    const settings = await query<{ value: string }[]>(
      'SELECT `value` FROM site_settings WHERE `key` = "organizationChartUrl" LIMIT 1',
    );
    const raw = settings.length > 0 ? settings[0].value : null;
    const normalize = (v: string | null) => {
      if (!v) return "/org/organization-chart.png";
      let s = String(v);
      s = s.replace(/^file:\/+/, "");
      s = s.replace(/^.*\/public\//, "/");
      s = s.replace(/^public\//, "/");
      if (!s.startsWith("/") && !/^https?:\/\//i.test(s)) {
        s = "/org/" + s;
      }
      return s;
    };
    const normalized = normalize(raw);
    console.log(
      "[getOrganizationChartUrl] raw:",
      raw,
      "normalized:",
      normalized,
    );
    return normalized;
  } catch (error) {
    return "/org/organization-chart.png";
  }
}

async function getSubsidiaries() {
  try {
    // First, check if table exists and is empty, then auto-seed
    try {
      const countResult = await query<{ count: number }[]>(
        "SELECT COUNT(*) as count FROM Subsidiary",
      );

      const countArray = Array.isArray(countResult) ? countResult : [];
      const firstRow = countArray[0] as
        | { count?: number; COUNT?: number }
        | undefined;
      const count = firstRow?.count ?? firstRow?.COUNT ?? 0;

      // If no subsidiaries exist, auto-seed them
      if (count === 0) {
        const defaultSubsidiaries = [
          {
            id: "sub-001",
            name: "RET Advertising",
            path: "/ret-advertising",
            description: "Branding, production, and CSR services",
            imageUrl:
              "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=80",
            displayOrder: 1,
          },
          {
            id: "sub-002",
            name: "Million Zone",
            path: "/million-zone",
            description:
              "Construction, infrastructure, and rural electrification",
            imageUrl:
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80",
            displayOrder: 2,
          },
          {
            id: "sub-003",
            name: "Inner True",
            path: "/inner-true",
            description:
              "Distribution and logistics (Telecom, Online Money, FMCG)",
            imageUrl:
              "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&q=80",
            displayOrder: 3,
          },
          {
            id: "sub-004",
            name: "Agricultural Friends",
            path: "/agricultural-friends",
            description: "General agricultural services",
            imageUrl:
              "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop&q=80",
            displayOrder: 4,
          },
        ];

        for (const sub of defaultSubsidiaries) {
          try {
            await query(
              `INSERT INTO Subsidiary (id, name, path, description, imageUrl, displayOrder, createdAt, updatedAt)
               VALUES (:id, :name, :path, :description, :imageUrl, :displayOrder, NOW(3), NOW(3))`,
              {
                id: sub.id,
                name: sub.name,
                path: sub.path,
                description: sub.description,
                imageUrl: sub.imageUrl,
                displayOrder: sub.displayOrder,
              },
            );
          } catch (error: any) {
            // Ignore duplicate key errors
            if (error.code !== "ER_DUP_ENTRY") {
              console.error(`Error auto-seeding ${sub.name}:`, error);
            }
          }
        }
      }
    } catch (error) {
      // Table might not exist yet, that's okay
      console.log("Auto-seed check skipped (table may not exist):", error);
    }

    // Now fetch all subsidiaries
    const rows = await query<
      {
        id: string;
        name: string;
        path: string;
        description: string | null;
        imageUrl: string | null;
        displayOrder: number;
      }[]
    >(
      "SELECT id, name, path, description, imageUrl, displayOrder FROM Subsidiary ORDER BY displayOrder ASC, name ASC",
    );

    const rowsArray = Array.isArray(rows) ? rows : [];
    return rowsArray.map((row: any) => ({
      id: row.id || row.ID,
      name: row.name || row.NAME,
      path: row.path || row.PATH,
      description: row.description || row.DESCRIPTION || "",
      imageUrl: row.imageUrl || row.imageURL || row.IMAGEURL || null,
      displayOrder: row.displayOrder || row.DISPLAYORDER || 0,
    }));
  } catch (error) {
    console.error("Error fetching subsidiaries:", error);
    // Return default subsidiaries if database query fails
    return [
      {
        id: "default-1",
        name: "RET Advertising",
        path: "/ret-advertising",
        description: "Branding, production, and CSR services",
        imageUrl: null,
        displayOrder: 1,
      },
      {
        id: "default-2",
        name: "Million Zone",
        path: "/million-zone",
        description: "Construction, infrastructure, and rural electrification",
        imageUrl: null,
        displayOrder: 2,
      },
      {
        id: "default-3",
        name: "Inner True",
        path: "/inner-true",
        description: "Distribution and logistics (Telecom, Online Money, FMCG)",
        imageUrl: null,
        displayOrder: 3,
      },
      {
        id: "default-4",
        name: "Agricultural Friends",
        path: "/agricultural-friends",
        description: "General agricultural services",
        imageUrl: null,
        displayOrder: 4,
      },
    ];
  }
}

async function getCounts() {
  try {
    const rows = await query<{ projects: number; clients: number }[]>(
      `SELECT (SELECT COUNT(*) FROM Project) AS projects, (SELECT COUNT(*) FROM Client) AS clients`,
    );
    const r =
      Array.isArray(rows) && rows[0] ? rows[0] : { projects: 0, clients: 0 };
    return {
      projects: Number(r.projects || 0),
      clients: Number(r.clients || 0),
    };
  } catch (error) {
    console.error("Error fetching counts:", error);
    return { projects: 0, clients: 0 };
  }
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const documents = await getLegalDocuments();
  const orgChartUrl = await getOrganizationChartUrl();
  const subsidiaries = await getSubsidiaries();
  const counts = await getCounts();

  const placeholderImage =
    "https://via.placeholder.com/800x600?text=Document+Preview";
  const featuredLegalDocs = [
    {
      title: "Certificate of Incorporation",
      description:
        "Royal Ever Truth Business Group Co., Ltd registration (No. 102364597)",
      imageUrl: "/legal/certificate-of-incorporation.jpg",
    },
    {
      title: "Supplier / Contractor Registration",
      description:
        "Royal Ever Truth Co., Ltd supplier / contractor registration",
      imageUrl: "/legal/supplier-contractor-registration.jpg",
    },
    {
      title: "Business Operating License (Advertising)",
      description:
        "Royal Ever Truth Business Group Co., Ltd – Advertising license (valid to 26/Sep/2025)",
      imageUrl: "/legal/operating-license.jpg",
    },
  ];

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", href: "/" }]} />

      {/* Hero Section - Royal Blue with subtle geometric pattern */}
      <section className="bg-[#1A4A94] text-white py-24 md:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 hero-pattern opacity-100"
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <ScrollAnimation direction="fade" delay={100}>
            <span className="inline-block text-white/80 text-sm font-semibold uppercase tracking-wider mb-4">
              Since 2007
            </span>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={200}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              Royal Ever Truth
              <br />
              Business Group
            </h1>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={300}>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed">
              Established since 2007, providing professional overall Advertising
              & Media Services across the whole Myanmar territory.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 mt-12 mb-12 relative z-10">
        <StatsCards counts={counts} />
      </div>

      {/* Attitude & Core Values */}
      <section className="py-16 md:py-20 bg-[#1A4A94] relative overflow-hidden">
        <div
          className="absolute inset-0 hero-pattern opacity-100"
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <ScrollAnimation direction="up" delay={250}>
              <div className="card-ret bg-white p-6 md:p-8 border border-[#E9ECEF] hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#1A4A94]/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#1A4A94]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-[#0F2942]">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {settings.mission}
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={300}>
              <div className="card-ret bg-white p-6 md:p-8 border border-[#E9ECEF] hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#1A4A94]/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#1A4A94]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-[#0F2942]">
                    Our Vision
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {settings.vision}
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="right" delay={100}>
              <div className="card-ret bg-white p-6 md:p-8 border border-[#E9ECEF] hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#FFC107]/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#FFC107]" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-[#0F2942]">
                    Our Attitude
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {settings.attitude}
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="left" delay={200}>
              <div className="card-ret bg-white p-6 md:p-8 border border-[#E9ECEF] hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#FFC107]/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#FFC107]" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-[#0F2942]">
                    Core Values
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {settings.coreValues}
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <ScrollAnimation direction="up" delay={100}>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#0F2942] mb-3">
                Our History
              </h2>
              <div className="w-16 h-1 bg-[#FFC107] mx-auto rounded-full" />
            </div>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={200}>
            <div className="card-ret bg-white p-6 md:p-8 border border-[#E9ECEF] shadow-md rounded-lg">
              <p className="text-base md:text-lg text-black leading-relaxed text-center">
                {settings.history}
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Our Strong Points */}
      <section className="py-16 md:py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <ScrollAnimation direction="up" delay={100}>
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#0F2942] mb-3">
                Our Strong Points
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base">
                Key strengths that drive our success and commitment to
                excellence
              </p>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: FastForward,
                title: "Smooth Progress",
                desc: "Efficient workflow and seamless project execution",
              },
              {
                icon: Users,
                title: "Organized Team Structure",
                desc: "Well-structured teams with clear hierarchy and roles",
              },
              {
                icon: Map,
                title: "Nationwide Coverage",
                desc: "Extensive reach across the whole Myanmar territory",
              },
              {
                icon: MapPin,
                title: "Branch Offices",
                desc: "Strategic locations for better service delivery",
              },
              {
                icon: Smartphone,
                title: "Frequently Update Reports",
                desc: "Real-time updates and transparent communication",
              },
              {
                icon: Smile,
                title: "Customer Satisfaction",
                desc: "Commitment to complete satisfaction and quality service",
              },
            ].map((item, idx) => (
              <ScrollAnimation
                key={item.title}
                direction="up"
                delay={100 + idx * 50}
              >
                <div className="card-ret p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#1A4A94]/10 rounded-lg p-3 group-hover:bg-[#1A4A94]/15 transition-colors">
                      <item.icon className="w-6 h-6 text-[#1A4A94]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-2 text-[#0F2942]">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Client Showcase - Filterable Gallery */}
      <ClientShowcase />

      {/* Subsidiaries */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <ScrollAnimation direction="up" delay={100}>
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#0F2942] mb-3">
                Our Subsidiaries
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto text-base">
                Explore our diverse portfolio of specialized business units
              </p>
            </div>
          </ScrollAnimation>
          <div className="grid md:grid-cols-2 gap-6">
            {subsidiaries.map((sub, index) => (
              <ScrollAnimation
                key={sub.id || sub.path}
                direction="up"
                delay={100 + index * 50}
              >
                <Link
                  href={sub.path}
                  className="card-ret block p-6 md:p-8 hover-lift border-l-4 border-[#1A4A94] group"
                >
                  <div className="flex gap-6">
                    {sub.imageUrl && (
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={sub.imageUrl}
                          alt={sub.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-[#0F2942] group-hover:text-[#1A4A94] transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {sub.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-16 md:py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <ScrollAnimation direction="up" delay={100}>
            <div className="card-ret overflow-hidden">
              <div className="p-6 md:p-8 border-b border-[#E9ECEF]">
                <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#0F2942] mb-2">
                  Organizational Structure
                </h2>
                <p className="text-gray-600 text-sm text-center">
                  Visual overview of leadership, functional managers, and teams.
                </p>
              </div>
              <div className="relative w-full h-[320px] md:h-[420px] bg-[#F8F9FA]">
                <Image
                  src={orgChartUrl}
                  alt="Organization Chart"
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
              </div>
              {orgChartUrl === "/org/organization-chart.png" && (
                <div className="px-6 py-4 bg-[#F8F9FA] text-xs text-gray-500">
                  Upload an organization chart in{" "}
                  <Link
                    href="/admin/settings"
                    className="text-[#1A4A94] hover:text-[#FFC107] transition-colors font-medium"
                  >
                    Admin Settings
                  </Link>
                  .
                </div>
              )}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Legal Documents */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <ScrollAnimation direction="up" delay={100}>
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#0F2942] mb-3">
                Legal Documents
              </h2>
              <div className="w-16 h-1 bg-[#FFC107] mx-auto rounded-full" />
            </div>
          </ScrollAnimation>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(documents.length > 0 ? documents : featuredLegalDocs).map(
              (
                doc: {
                  id?: string;
                  title: string;
                  description?: string;
                  documentUrl?: string;
                  imageUrl?: string;
                  type?: string;
                  isImage?: boolean;
                  imageSrc?: string | null;
                },
                idx: number,
              ) => {
                const hasDocument =
                  (doc as any).documentUrl || (doc as any).imageUrl;
                const isImage = Boolean((doc as any).isImage);
                const imageSrc =
                  isImage &&
                  ((doc as any).imageSrc ||
                    (doc as any).documentUrl ||
                    (doc as any).imageUrl)
                    ? (doc as any).imageSrc ||
                      (doc as any).documentUrl ||
                      (doc as any).imageUrl
                    : placeholderImage;

                const isPdf = hasDocument && !isImage;

                return (
                  <ScrollAnimation
                    key={(doc as any).id ?? idx}
                    direction="up"
                    delay={100 + idx * 100}
                  >
                    <div className="card-ret flex flex-col group hover-lift overflow-hidden">
                      <div className="relative h-64 w-full bg-[#F8F9FA] overflow-hidden">
                        {isImage ? (
                          <Image
                            src={imageSrc}
                            alt={doc.title}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center px-6">
                            <div className="text-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-12 h-12 text-gray-400 mx-auto"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeWidth={1.5}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 2v8l3-3m5 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8"
                                />
                                <path
                                  strokeWidth={1.5}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 12V2"
                                />
                              </svg>
                              <p className="mt-2 text-sm text-gray-600">
                                {isPdf
                                  ? "PDF Document"
                                  : "No preview available"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        {(doc as any).type && (
                          <span className="text-xs font-semibold text-[#1A4A94] uppercase bg-[#1A4A94]/10 px-3 py-1 rounded-full inline-block mb-3 w-fit">
                            {(doc as any).type}
                          </span>
                        )}
                        <h3 className="text-base font-semibold mb-2 text-[#0F2942] group-hover:text-[#1A4A94] transition-colors">
                          {doc.title}
                        </h3>
                        {(doc as any).description && (
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">
                            {(doc as any).description}
                          </p>
                        )}
                        {hasDocument ? (
                          <a
                            href={
                              (doc as any).documentUrl || (doc as any).imageUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1A4A94] hover:text-[#FFC107] text-sm font-medium mt-auto inline-flex items-center gap-2 transition-colors"
                          >
                            <span>View Full Document</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        ) : (
                          <p className="text-xs text-gray-500 mt-auto">
                            Upload in{" "}
                            <Link
                              href="/admin/legal-documents"
                              className="text-[#1A4A94] hover:text-[#FFC107] font-medium"
                            >
                              Admin → Legal Documents
                            </Link>
                          </p>
                        )}
                      </div>
                    </div>
                  </ScrollAnimation>
                );
              },
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
