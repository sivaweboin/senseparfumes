const createProductArtwork = (name, accent, portrait = false) => {
  const titleSize = name.length > 24 ? 17 : name.length > 17 ? 20 : 24;
  const safeName = name.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  const viewBox = portrait ? "0 0 400 500" : "0 0 400 400";
  const paperHeight = portrait ? 500 : 400;
  const bottleScale = portrait ? "" : '<g transform="translate(32 30) scale(.84)">';
  const bottleEnd = portrait ? "" : "</g>";
  const productTitleY = portrait ? 421 : 360;
  const brandY = portrait ? 450 : 383;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
      <defs>
        <linearGradient id="paper" x2="0" y2="1">
          <stop stop-color="#f5f1e8"/>
          <stop offset="1" stop-color="#e4ded1"/>
        </linearGradient>
        <linearGradient id="glass" x2="1" y2="0">
          <stop stop-color="#ffffff" stop-opacity=".8"/>
          <stop offset=".18" stop-color="${accent}" stop-opacity=".58"/>
          <stop offset=".5" stop-color="#ffffff" stop-opacity=".76"/>
          <stop offset=".82" stop-color="${accent}" stop-opacity=".68"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity=".8"/>
        </linearGradient>
        <linearGradient id="cap" x2="1" y2="0">
          <stop stop-color="#171916"/>
          <stop offset=".5" stop-color="#45443c"/>
          <stop offset="1" stop-color="#141512"/>
        </linearGradient>
        <filter id="shadow" x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="9"/>
        </filter>
      </defs>
      <rect width="400" height="${paperHeight}" fill="url(#paper)"/>
      <circle cx="54" cy="82" r="72" fill="#fff" opacity=".25"/>
      <circle cx="344" cy="218" r="115" fill="${accent}" opacity=".07"/>
      ${bottleScale}
      <ellipse cx="200" cy="359" rx="91" ry="17" fill="#443c30" opacity=".2" filter="url(#shadow)"/>
      <rect x="160" y="104" width="80" height="93" rx="13" fill="url(#cap)"/>
      <path d="M165 111h70M165 122h70M165 133h70M165 144h70M165 155h70M165 166h70M165 177h70" stroke="#fff" stroke-opacity=".08"/>
      <rect x="174" y="95" width="52" height="13" rx="5" fill="#c9b99c"/>
      <path d="M149 194h102v20c0 10 32 20 32 42v84c0 18-13 30-31 30h-104c-18 0-31-12-31-30v-84c0-22 32-32 32-42z" fill="url(#glass)" stroke="#fff" stroke-opacity=".9" stroke-width="4"/>
      <path d="M151 217h98c4 13 24 19 24 39v82c0 12-8 20-22 20h-102c-14 0-22-8-22-20v-82c0-20 20-26 24-39z" fill="${accent}" opacity=".12"/>
      <path d="M132 246v87c0 11 4 17 13 20M268 246v87c0 11-4 17-13 20" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="5"/>
      <path d="M200 214v93" stroke="#5f5545" stroke-opacity=".2" stroke-width="3"/>
      <text x="200" y="276" text-anchor="middle" fill="#28251f" font-family="Georgia,serif" font-size="31" font-style="italic">ak</text>
      <path d="M163 292h74" stroke="#fff" stroke-opacity=".65"/>
      <text x="200" y="314" text-anchor="middle" fill="#302d26" font-family="Georgia,serif" font-size="10" letter-spacing="2">EAU DE PARFUM</text>
      ${bottleEnd}
      <text x="200" y="${productTitleY}" text-anchor="middle" fill="#27251f" font-family="Georgia,serif" font-size="${titleSize}">${safeName}</text>
      <text x="200" y="${brandY}" text-anchor="middle" fill="#777064" font-family="Arial,sans-serif" font-size="9" letter-spacing="4">AK&amp;CO  /  FINE FRAGRANCE</text>
    </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

window.SENSE_PRODUCTS = [
  {
    id: "oud-noir-parfum",
    name: "Oud Noir Parfum",
    type: "Parfum",
    price: 165,
    image: createProductArtwork("Oud Noir Parfum", "#76513a"),
    homeImage: createProductArtwork("Oud Noir Parfum", "#76513a", true),
    subtitle: "A considered fragrance from the AK&CO collection.",
    description:
      "Discover Oud Noir Parfum, crafted with the considered character of the AK&CO fragrance collection.",
  },
  {
    id: "bantal-solis-eau-de-parfum",
    name: "Bantal Solis Eau de Parfum",
    type: "Eau de Parfum",
    price: 150,
    image: createProductArtwork("Bantal Solis Eau de Parfum", "#768477"),
    homeImage: createProductArtwork("Bantal Solis Eau de Parfum", "#768477", true),
    subtitle: "A sophisticated signature from the AK&CO collection.",
    description:
      "A masterfully crafted olfactory journey designed for the modern connoisseur. Each note unfolds deliberately to reveal a deeply personal and sophisticated signature profile.",
    notes: "Australian Sandalwood, Cardamom, Iris, Amber",
  },
  {
    id: "lumiere-blanche-eau-de-parfum",
    name: "Lumière Blanche Eau de Parfum",
    type: "Eau de Parfum",
    price: 165,
    image: createProductArtwork("Lumière Blanche Eau de Parfum", "#c1a77d"),
    homeImage: createProductArtwork("Lumière Blanche Eau de Parfum", "#c1a77d", true),
    subtitle: "A considered fragrance from the AK&CO collection.",
    description:
      "Discover Lumière Blanche Eau de Parfum, crafted with the considered character of the AK&CO fragrance collection.",
  },
  {
    id: "veridian-mist-eau-de-parfum",
    name: "Veridian Mist Eau de Parfum",
    type: "Eau de Parfum",
    price: 57,
    image: createProductArtwork("Veridian Mist Eau de Parfum", "#7c987d"),
    homeImage: createProductArtwork("Veridian Mist Eau de Parfum", "#7c987d", true),
    subtitle: "A considered fragrance from the AK&CO collection.",
    description:
      "Discover Veridian Mist Eau de Parfum, crafted with the considered character of the AK&CO fragrance collection.",
  },
  {
    id: "flora-obscura-eau-de-parfum",
    name: "Flora Obscura Eau de Parfum",
    type: "Eau de Parfum",
    price: 65,
    image: createProductArtwork("Flora Obscura Eau de Parfum", "#926f7b"),
    homeImage: createProductArtwork("Flora Obscura Eau de Parfum", "#926f7b", true),
    subtitle: "A considered fragrance from the AK&CO collection.",
    description:
      "Discover Flora Obscura Eau de Parfum, crafted with the considered character of the AK&CO fragrance collection.",
  },
  {
    id: "fleur-de-sel-eau-de-parfum",
    name: "Fleur de Sel Eau de Parfum",
    type: "Eau de Parfum",
    price: 85,
    image: createProductArtwork("Fleur de Sel Eau de Parfum", "#aeb5b0"),
    homeImage: createProductArtwork("Fleur de Sel Eau de Parfum", "#aeb5b0", true),
    subtitle: "A considered fragrance from the AK&CO collection.",
    description:
      "Discover Fleur de Sel Eau de Parfum, crafted with the considered character of the AK&CO fragrance collection.",
  },
  {
    id: "celeste-mandarine-eau-de-parfum",
    name: "Céleste Mandarine Eau de Parfum",
    type: "Eau de Parfum",
    price: 90,
    image: createProductArtwork("Céleste Mandarine Eau de Parfum", "#cb9251"),
    homeImage: createProductArtwork("Céleste Mandarine Eau de Parfum", "#cb9251", true),
    subtitle: "A considered fragrance from the AK&CO collection.",
    description:
      "Discover Céleste Mandarine Eau de Parfum, crafted with the considered character of the AK&CO fragrance collection.",
  },
  {
    id: "pepper-fire",
    name: "Pepper Fire",
    type: "Eau de Parfum",
    price: null,
    image: "images/pepper-fire.jpeg",
    subtitle: "A bold explosion of spice.",
    description: "A spicy, warm, addictive fragrance with pepper, cinnamon, tobacco and woody accords.",
    notes: "Pepper, Cinnamon, Tobacco, Woody Accords",
    category: "perfumes",
  },
  {
    id: "aventus",
    name: "Aventus",
    type: "Eau de Parfum",
    price: null,
    image: "images/aventus-product.jpeg",
    subtitle: "Timeless. Bold. Distinctive.",
    description: "A distinctive fragrance presented with a timeless, bold character.",
    category: "perfumes",
  },
  {
    id: "vanilla-smoke",
    name: "Vanilla Smoke",
    type: "Eau de Parfum",
    price: null,
    image: "images/vanilla-smoke.jpeg",
    subtitle: "Vanilla Smoke",
    description: "Discover Vanilla Smoke from the AK&CO fragrance collection.",
    category: "perfumes",
  },
  {
    id: "ultimate",
    name: "Ultimate",
    type: "Eau de Parfum",
    price: null,
    image: "images/ultimate.jpeg",
    subtitle: "Ultimate",
    description: "Discover Ultimate from the AK&CO fragrance collection.",
    category: "perfumes",
  },
];
