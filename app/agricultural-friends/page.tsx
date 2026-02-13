import { query } from "@/lib/db";
import SubsidiaryLayout from "@/components/SubsidiaryLayout";
import { Leaf, Settings, BookOpen, ShoppingCart } from "lucide-react";
import { getPageBanners } from "@/lib/banners";

async function getProjects() {
  try {
    return await query(
      "SELECT id, title, description, category, imageUrl, subsidiary, status, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary ORDER BY createdAt DESC",
      { subsidiary: "Agricultural Friends" },
    );
  } catch {
    return [];
  }
}

export default async function AgriculturalFriendsPage() {
  const [projects, bannerRows] = await Promise.all([
    getProjects(),
    getPageBanners("agricultural-friends"),
  ]);

  const banners =
    bannerRows.length > 0
      ? bannerRows.map((b) => ({
          id: b.id,
          title: b.title,
          subtitle: b.subtitle,
          imageUrl: b.imageUrl,
        }))
      : [];

  return (
    <SubsidiaryLayout
      name="Agricultural Friends"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Agricultural Friends", href: "/agricultural-friends" },
      ]}
      heroTitle="Agricultural Friends"
      heroDescription="Supporting Myanmar's agricultural sector with comprehensive services and solutions."
      banners={banners}
      aboutTitle="About Agricultural Friends"
      aboutContent={
        <>
          <p className="mb-4">
            Agricultural Friends is dedicated to supporting Myanmar&apos;s
            farming communities through a wide range of agricultural services.
            We provide farmers with the tools, knowledge, and resources needed
            to improve productivity and sustainability.
          </p>
          <p>
            Our services encompass agricultural inputs, equipment distribution,
            training programs, and market access solutions to help farmers
            thrive in an evolving agricultural landscape.
          </p>
        </>
      }
      projects={projects as any[]}
      servicesTitle="Our Services"
      services={[
        {
          icon: <Leaf className="w-7 h-7" />,
          title: "Agricultural Inputs",
          description: "Seeds, fertilizers, and farming supplies.",
        },
        {
          icon: <Settings className="w-7 h-7" />,
          title: "Equipment",
          description: "Farming machinery and tools.",
        },
        {
          icon: <BookOpen className="w-7 h-7" />,
          title: "Training Programs",
          description: "Educational workshops and support.",
        },
        {
          icon: <ShoppingCart className="w-7 h-7" />,
          title: "Market Access",
          description: "Connecting farmers to markets.",
        },
      ]}
      extraSections={
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="card-ret p-6 md:p-8 border-l-4 border-[#059669]">
              <h3 className="text-xl font-semibold text-[#0F2942] mb-4">
                Our Commitment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Agricultural Friends is committed to empowering Myanmar&apos;s
                farming communities by providing access to quality inputs,
                modern equipment, and market opportunities. We believe in
                sustainable agriculture that benefits both farmers and the
                environment.
              </p>
            </div>
          </div>
        </section>
      }
    />
  );
}
