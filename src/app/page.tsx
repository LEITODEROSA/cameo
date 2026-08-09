import Hero from "@/components/Hero";
import PromoStrip from "@/components/PromoStrip";
import ProductGrid from "@/components/ProductGrid";
import EditorialBanner from "@/components/EditorialBanner";
import CategoryGrid from "@/components/CategoryGrid";
import InstagramGrid from "@/components/InstagramGrid";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Hero />
      <PromoStrip />
      <Reveal>
        <ProductGrid />
      </Reveal>
      <Reveal>
        <EditorialBanner />
      </Reveal>
      <Reveal>
        <CategoryGrid />
      </Reveal>
      <Reveal>
        <InstagramGrid />
      </Reveal>
      <Newsletter />
    </>
  );
}
