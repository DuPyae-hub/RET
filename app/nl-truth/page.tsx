import { query } from "@/lib/db";
import SubsidiaryLayout from "@/components/SubsidiaryLayout";
import { Smartphone, Wallet, Package } from "lucide-react";

async function getProjects() {
  try {
    return await query(
      "SELECT id, title, description, category, imageUrl, subsidiary, status, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary ORDER BY createdAt DESC",
      { subsidiary: "NL Truth" },
    );
  } catch {
    return [];
  }
}

export default async function NLTruthPage() {
  const projects = await getProjects();

  return (
    <SubsidiaryLayout
      name="NL Truth"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "NL Truth", href: "/nl-truth" },
      ]}
      heroTitle="NL Truth"
      heroDescription="Your trusted partner in distribution and logistics across Telecom, Online Money, and FMCG sectors."
      aboutTitle="About NL Truth"
      aboutContent={
        <>
          <p className="mb-4">
            NL Truth is a leading distribution and logistics company
            specializing in fast-moving consumer goods (FMCG),
            telecommunications products, and digital financial services. We
            ensure efficient, reliable delivery across Myanmar.
          </p>
          <p>
            With extensive networks and strategic partnerships, we connect
            businesses with consumers nationwide, enabling seamless access to
            essential products and services.
          </p>
        </>
      }
      projects={projects as any[]}
      servicesTitle="Our Services"
      services={[
        {
          icon: <Smartphone className="w-7 h-7" />,
          title: "Telecom Distribution",
          description:
            "Distribution of mobile devices, accessories, and telecommunications equipment to retailers and consumers nationwide.",
        },
        {
          icon: <Wallet className="w-7 h-7" />,
          title: "Online Money",
          description:
            "Distribution and management of digital financial services, mobile payment solutions, and online money platforms.",
        },
        {
          icon: <Package className="w-7 h-7" />,
          title: "FMCG Distribution",
          description:
            "Fast-moving consumer goods distribution including food, beverages, personal care, and household products.",
        },
      ]}
      extraSections={
        <section className="py-12 md:py-16 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <h2 className="text-2xl font-semibold text-center text-[#0F2942] mb-8">
              Our Network
            </h2>
            <div className="card-ret p-8 max-w-3xl mx-auto">
              <p className="text-center text-gray-600 leading-relaxed">
                NL Truth maintains an extensive distribution network covering
                major cities and rural areas across Myanmar, ensuring timely and
                efficient delivery of products to our partners and end
                consumers.
              </p>
            </div>
          </div>
        </section>
      }
    />
  );
}
