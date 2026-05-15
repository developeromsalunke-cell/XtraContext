import React from 'react';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "XtraContext",
    "description": "The persistent memory layer for AI agents. Capture, search, and recall every architectural decision via the Model Context Protocol.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web, Windows, macOS, Linux",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "XtraContext",
      "url": "https://xtracontext.com"
    },
    "featureList": [
      "Model Context Protocol (MCP) Integration",
      "Architectural Decision Records (ADR) Persistence",
      "Semantic Search via Vector Embeddings",
      "Universal AI Memory Layer",
      "Team-based Workspace Isolation"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
