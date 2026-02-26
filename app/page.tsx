import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BrowseByRole from "@/components/BrowseByRole";
import FeaturedStacks from "@/components/FeaturedStacks";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <BrowseByRole />
      <FeaturedStacks />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
