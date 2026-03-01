import Layout from "@/shared/components/layout/Layout";
import HeroSection from "@/features/home/components/HeroSection";
import AboutPreview from "@/features/home/components/AboutPreview";
import ServicesPreview from "@/features/home/components/ServicesPreview";
import WhatsAppCTA from "@/features/home/components/WhatsAppCTA";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutPreview />
      <ServicesPreview />
      <WhatsAppCTA />
    </Layout>
  );
};

export default Index;
