(() => {
  const products = window.SENSE_PRODUCTS;
  const productPage = document.querySelector(".ak-product");
  if (!products || !productPage) return;

  const productsById = new Map(products.map((product) => [product.id, product]));
  const selectedId = new URLSearchParams(window.location.search).get("product");
  const product = productsById.get(selectedId) || products[0];
  if (selectedId !== product.id) {
    const canonicalUrl = new URL(window.location.href);
    canonicalUrl.searchParams.set("product", product.id);
    window.history.replaceState(null, "", canonicalUrl);
  }

  document.title = `${product.name} — AK&CO`;
  document.querySelector('meta[name="description"]')?.setAttribute(
    "content",
    `${product.name} by AK&CO. ${product.description}`,
  );
  productPage.dataset.productId = product.id;
  productPage.querySelector("h1").textContent = product.name;
  productPage.querySelector('[aria-current="page"]').textContent = product.name;
  const eyebrow = productPage.querySelector(".ak-eyebrow");
  eyebrow.replaceChildren(
    document.createTextNode("AK&CO "),
    Object.assign(document.createElement("span"), { textContent: "/" }),
    document.createTextNode(` ${product.type}`),
  );
  productPage.querySelector(".ak-image-caption").textContent =
    `AK&CO / ${product.type}`;
  const placeholder = productPage.querySelector(
    ".product-page-placeholder, .preview-image-placeholder",
  );
  if (product.image && placeholder) {
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = `${product.name} fragrance artwork`;
    placeholder.replaceWith(image);
    productPage.querySelector(".ak-image-caption").hidden = true;
  } else if (placeholder) {
    placeholder.textContent = product.name;
  }
  productPage.querySelector(".ak-subtitle").textContent = product.subtitle;
  productPage.querySelector(".ak-story .ak-richtext").textContent =
    product.description;
  const formattedPrice =
    product.price === null
      ? "Price coming soon"
      : new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(product.price);
  productPage.querySelector(".ak-price span").textContent = formattedPrice;
  productPage.querySelector(".ak-tax-note").textContent =
    product.price === null
      ? "Pricing will be announced soon."
      : "Shipping calculated at checkout.";
  if (product.price === null) {
    productPage.querySelector(".ak-availability").textContent =
      "Pricing coming soon";
    productPage
      .querySelectorAll('.ak-checkout-buttons button[type="submit"]')
      .forEach((button) => {
        button.disabled = true;
      });
  }

  const notes = productPage.querySelector(".ak-accords");
  if (product.notes) {
    notes.hidden = false;
    notes.querySelector(".ak-richtext").textContent = product.notes;
  } else {
    notes.hidden = true;
  }

  const productUrl = new URL(window.location.href);
  productUrl.searchParams.set("product", product.id);
  productPage.querySelectorAll(".ak-share a").forEach((link) => {
    const shareUrl = new URL(link.href);
    const productUrlParameter =
      shareUrl.hostname === "x.com" ? "url" : "u";
    shareUrl.searchParams.set(productUrlParameter, productUrl.href);
    if (shareUrl.hostname === "x.com") {
      shareUrl.searchParams.set("text", product.name);
    }
    link.href = shareUrl.href;
  });

  const collectionLink = productPage.querySelector(".ak-related-heading > a");
  collectionLink.href = "index.html#favorites";

  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.image)
    .slice(0, 4);
  const relatedHeading = productPage.querySelector(
    ".ak-related-heading h2",
  );
  relatedHeading.textContent = "You might also like";
  const relatedSection = productPage.querySelector(".ak-related");
  const relatedGrid = relatedSection.querySelector(".ak-related-grid");
  const relatedStatus = relatedSection.querySelector(".ak-related-status");
  relatedGrid.replaceChildren(
    ...relatedProducts.map((item, index) => {
      const card = document.createElement("div");
      card.className = "ak-related-card has-image";
      const link = document.createElement("a");
      link.className = "ak-related-product-link";
      link.href = `product.html?product=${encodeURIComponent(item.id)}`;

      const image = document.createElement("img");
      image.className = "ak-related-image";
      image.src = item.homeImage || item.image;
      image.alt = `${item.name} fragrance`;
      image.loading = "eager";
      link.append(image);

      const number = document.createElement("span");
      number.className = "ak-related-index";
      number.textContent = String(index + 1).padStart(2, "0");

      const name = document.createElement("span");
      name.className = "ak-related-name";
      name.textContent = item.name;

      const type = document.createElement("span");
      type.className = "ak-related-type";
      type.textContent = item.type;

      const price = document.createElement("span");
      price.className = "ak-related-price";
      price.textContent =
        item.price === null
          ? "Price coming soon"
          : new Intl.NumberFormat("en-IE", {
              style: "currency",
              currency: "EUR",
            }).format(item.price);

      const addButton = document.createElement("button");
      addButton.className = "ak-related-add";
      addButton.type = "button";
      addButton.textContent = item.price === null ? "Unavailable" : "Add to bag";
      addButton.disabled = item.price === null;
      addButton.setAttribute(
        "aria-label",
        item.price === null
          ? `${item.name} pricing coming soon`
          : `Add ${item.name} to bag`,
      );
      addButton.addEventListener("click", () => {
        relatedStatus.textContent = "";
        productPage.dispatchEvent(
          new CustomEvent("ak:add-product", {
            bubbles: true,
            detail: {
              productIndex: products.indexOf(item),
              statusElement: relatedStatus,
            },
          }),
        );
      });

      link.append(number, image, name, type, price);
      card.append(link, addButton);
      return card;
    }),
  );

  const bundleSection = productPage.querySelector(".ak-bundle");
  const bundleProducts = products
    .filter(
      (item) =>
        item.id !== product.id &&
        item.price !== null &&
        item.image,
    )
    .slice(0, 4);
  const bundleItems = bundleSection.querySelector(".ak-bundle-items");
  const bundleStatus = bundleSection.querySelector(".ak-bundle-status");
  if (
    bundleProducts.length === 0
  ) {
    bundleSection.hidden = true;
  } else {
    bundleSection.hidden = false;
    const formatPrice = (value) =>
      new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
      }).format(value);
    const createBundleItem = (item) => {
      const card = document.createElement("div");
      card.className = "ak-bundle-product ak-related-card has-image";

      const link = document.createElement("a");
      link.className = "ak-related-product-link";
      link.href = `product.html?product=${encodeURIComponent(item.id)}`;

      const image = document.createElement("img");
      image.className = "ak-related-image";
      image.src = item.homeImage || item.image;
      image.alt = `${item.name} fragrance`;
      image.loading = "eager";

      const name = document.createElement("span");
      name.className = "ak-related-name";
      name.textContent = item.name;

      const type = document.createElement("span");
      type.className = "ak-related-type";
      type.textContent = item.type;

      const price = document.createElement("span");
      price.className = "ak-related-price";
      price.textContent = formatPrice(item.price);

      const addButton = document.createElement("button");
      addButton.className = "ak-bundle-add ak-related-add";
      addButton.type = "button";
      addButton.textContent = "Add to bag";
      addButton.setAttribute("aria-label", `Add ${item.name} to bag`);
      addButton.addEventListener("click", () => {
        bundleStatus.textContent = "";
        productPage.dispatchEvent(
          new CustomEvent("ak:add-product", {
            bubbles: true,
            detail: {
              productIndex: products.indexOf(item),
              statusElement: bundleStatus,
            },
          }),
        );
      });

      link.append(image, name, type);
      card.append(link, price, addButton);
      return card;
    };

    bundleItems.replaceChildren(
      ...bundleProducts.map(createBundleItem),
    );
  }
})();
