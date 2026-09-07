export const SITE_ORIGIN = "https://xn--artsys-dva.com";
export const OG_IMAGE = `${SITE_ORIGIN}/og-artesys.jpg`;

interface MetaInput {
  title: string;
  description: string;
  path: string;
  type?: string;
  image?: string;
}

/** Standard meta + canonical block for a public Artesys page. */
export const publicHead = ({
  title,
  description,
  path,
  type = "website",
  image = OG_IMAGE,
}: MetaInput) => {
  const url = `${SITE_ORIGIN}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
};

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  type: "application/ld+json",
  children: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_ORIGIN}${item.path}`,
    })),
  }),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  type: "application/ld+json",
  children: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }),
});
