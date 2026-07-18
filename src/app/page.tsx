import Header from "@/components/header";
import Hero from "@/components/hero";
import CategoryChips from "@/components/category-chips";
import ProductGrid from "@/components/product-grid";
import Footer from "@/components/footer";

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const { category, q } = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoryChips activeCategory={category} />
        <ProductGrid activeCategory={category} searchQuery={q} />
      </main>
      <Footer />
    </>
  );
}
