import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutPreview from "@/components/home/AboutPreview";
import ServicesPreview from "@/components/home/ServicesPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutPreview />
      <ServicesPreview />
      {/* <TestimonialsSection /> */}
      {/* <FAQSection /> */}
      <WhatsAppCTA />
    </Layout>
  );
};

export default Index;
