import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutPreview from "@/components/home/AboutPreview";
import ServicesPreview from "@/components/home/ServicesPreview";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";

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
