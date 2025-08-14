
import { env } from '@/lib/env';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { CTA } from '@/components/CTA';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <CTA />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": env.NEXT_PUBLIC_SITE_NAME,
            "url": "https://rensto.com",
            "logo": "https://rensto.com/logo.png",
            "description": "Automations that ship in days — not months. Transform your manual processes into intelligent workflows.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Plano",
              "addressRegion": "TX",
              "addressCountry": "US"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": env.NEXT_PUBLIC_CONTACT_EMAIL
            },
            "sameAs": [
              env.NEXT_PUBLIC_LINKEDIN_URL,
              env.NEXT_PUBLIC_X_URL
            ].filter(Boolean)
          })
        }}
      />
    </main>
  );
}
