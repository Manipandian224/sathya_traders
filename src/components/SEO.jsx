import { useEffect } from 'react';

const DEFAULT_IMAGE = 'https://sathyatraders.in/images/sathyatraders.png';
const SITE_NAME = 'Sathya Traders';
const BASE_URL = 'https://sathyatraders.in';

export default function SEO({
  title,
  description,
  canonical,
  keywords,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  noindex = false,
  schema = null,
}) {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // Helper to create or update meta tag
    const setMetaTag = (selector, attributeName, attributeValue, contentValue) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue || '');
    };

    // Helper to create or update link tag
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      if (href) {
        element.setAttribute('href', href);
      }
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    if (keywords) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    }
    setMetaTag(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow'
    );

    // 3. Canonical Link
    const currentCanonical = canonical || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : BASE_URL);
    setLinkTag('canonical', currentCanonical);

    // 4. Open Graph Tags
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentCanonical);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', fullOgImage);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', fullOgImage);

    // 6. JSON-LD Schema
    const scriptId = 'seo-json-ld-schema';
    let scriptElement = document.getElementById(scriptId);

    if (schema) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(schema);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    return () => {
      // Clean up dynamic schema on unmount if needed
    };
  }, [title, description, canonical, keywords, ogType, ogImage, noindex, schema]);

  return null;
}
