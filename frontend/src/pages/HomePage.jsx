import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import OfferBanner from "../components/home/OfferBanner";
import NewArrivals from "../components/home/NewArrivals";
import BrandSection from "../components/home/BrandSection";
import BenefitsSection from "../components/home/BenefitsSection";
import NewsletterSection from "../components/home/NewsletterSection";

export default function HomePage() {
  return (
    <div className="bg-base-100 text-base-content">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <OfferBanner />
      <NewArrivals />
      <BrandSection />
      <BenefitsSection />
      <NewsletterSection />
    </div>
  );
}
