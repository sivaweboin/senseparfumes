# AK & Co. product page

Shopify Online Store 2.0 product-page integration, matching the existing storefront's muted paper, dark green and serif typography. This folder is a product-page module, not a complete uploadable theme: the homepage, layout, header, footer and cart remain to be converted.

## Install into the eventual Shopify theme

1. Copy `assets/ak-product.css`, `assets/ak-product.js` and the three `.woff2` files into the theme assets directory.
2. Copy `sections/main-product.liquid` into sections and merge `templates/product.json` into the target theme. Preserve any existing product-template customizations before replacing that template.
3. The surrounding theme layout supplies navigation, footer, `content_for_header` and `content_for_layout`. Assign this product template to catalog products. This module uses the standard Shopify product form and navigates to Shopify's cart on submission; it does not depend on the static homepage's demo bag. The product template enables Shopify's accelerated checkout button by default; merchants can turn it off in the section settings.
4. In Shopify admin, set the shop name, currency, product images, descriptions, variant prices, inventory and shipping/refund policies. No product imagery, price, size or stock is hard-coded in Liquid.
5. Optional product metafields: `custom.subtitle` (single-line text) and `custom.fragrance_notes` (rich text). Product options render as selectable capsules; selecting a combination loads its matching Shopify variant so its price, availability, media and checkout stay in sync. Text-only recommendation cards show up to four other products from the product's first collection. Additional accordions, app blocks and accelerated checkout are configurable in the theme editor.

## Preview and checks

Open `../product-preview.html` locally for the visual design. Product photography is intentionally omitted, and the size selector uses sample options; this is not a live Shopify render. Rebuild with `node build-product-preview.cjs` from the workspace root.

The static storefront uses the shared `../product-catalog.js` catalog. Product cards and “You might also like” cards link to `../product.html?product=<product-id>`, where the selected catalog entry supplies the title, type, price, description, image and available scent notes. Recommendation cards use portrait product-art tiles and individual Add to bag buttons. “Frequently bought together” uses the same image-card layout and provides an individual quick-add button for each of up to four other priced products. Shopify quick-add buttons in both sections submit the selected available variant through Shopify's Ajax cart endpoint. Update the shared catalog when adding or changing storefront products; Shopify product pages use the live Shopify product record instead.

Variant capsules reload the current product URL with `?variant=ID`, keeping prices, availability, media, quantity rules and payment buttons server-rendered together. A native variant selector is available when JavaScript is disabled. When an option combination does not exist, add-to-cart is disabled until a valid combination is selected. The picker uses `product.variants` and is intended for normal fragrance catalogs (up to Shopify's Liquid variant iteration limit); high-variant catalogs need an option-value selector before launch.

Validate inside the full theme with Shopify Theme Check and a development-store preview. Verify variant selection, available/sold-out products, cart submission, accelerated checkout if enabled, app blocks and catalog media. No connected Shopify store or CLI was available during local implementation, so live commerce has not been validated.

The fonts were extracted from the supplied storefront; confirm the existing font licensing covers the published store.
