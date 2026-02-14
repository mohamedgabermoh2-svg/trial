const $ = (selector) => document.querySelector(selector);

const brandNameEl = $("#brandName");
const aboutBrandNameEl = $("#aboutBrandName");
const footerBrandNameEl = $("#footerBrandName");
const heroHeadingEl = $("#heroHeading");
const heroSubheadingEl = $("#heroSubheading");
const instagramLinkEl = $("#instagramLink");
const tiktokLinkEl = $("#tiktokLink");
const heroWhatsappBtnEl = $("#heroWhatsappBtn");
const yearEl = $("#year");

const productsGridEl = $("#productsGrid");
const searchInputEl = $("#searchInput");
const categoryFilterEl = $("#categoryFilter");

const orderFormEl = $("#orderForm");
const customerNameEl = $("#customerName");
const customerPhoneEl = $("#customerPhone");
const orderItemsEl = $("#orderItems");
const orderNoteEl = $("#orderNote");

const burgerBtnEl = $("#burgerBtn");
const mainNavEl = $("#mainNav");

const formatPrice = (value) => `$${value.toFixed(2)}`;

const buildWhatsappUrl = (message) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
};

const initBranding = () => {
  const brand = CONFIG.brandName;
  brandNameEl.textContent = brand;
  aboutBrandNameEl.textContent = brand;
  footerBrandNameEl.textContent = brand;

  heroHeadingEl.textContent = `${brand}: makeup that elevates every look.`;
  heroSubheadingEl.textContent =
    "Explore premium essentials curated for glow, confidence, and effortless artistry.";

  instagramLinkEl.href = CONFIG.instagramLink;
  tiktokLinkEl.href = CONFIG.tiktokLink;
  yearEl.textContent = new Date().getFullYear();

  heroWhatsappBtnEl.href = buildWhatsappUrl(`Hi ${brand}, I'd love to place an order.`);
};

const getCategories = () => [...new Set(PRODUCTS.map((product) => product.category))].sort();

const populateCategories = () => {
  getCategories().forEach((category) => {
    const option = document.createElement("option");
    option.value = category.toLowerCase();
    option.textContent = category;
    categoryFilterEl.append(option);
  });
};

const createProductCard = (product) => {
  const card = document.createElement("article");
  card.className = "product-card";

  const message = `Hi ${CONFIG.brandName}, I want to buy:\n- ${product.name} (${formatPrice(product.price)})`;

  card.innerHTML = `
    <div class="product-top">
      <h3>${product.name}</h3>
      <span class="badge">${product.badge}</span>
    </div>
    <p class="product-desc">${product.description}</p>
    <div class="product-bottom">
      <span class="price">${formatPrice(product.price)}</span>
      <a class="btn btn-outline" href="${buildWhatsappUrl(message)}" target="_blank" rel="noopener">Buy</a>
    </div>
  `;

  return card;
};

const renderProducts = () => {
  const searchText = searchInputEl.value.trim().toLowerCase();
  const selectedCategory = categoryFilterEl.value;

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText) ||
      product.badge.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productsGridEl.innerHTML = "";

  if (!filteredProducts.length) {
    productsGridEl.innerHTML = '<p class="empty-state">No products found. Try another keyword or filter.</p>';
    return;
  }

  filteredProducts.forEach((product) => {
    productsGridEl.append(createProductCard(product));
  });
};

const initOrderForm = () => {
  orderFormEl.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = [
      `Hi ${CONFIG.brandName}, I want to place an order:`,
      `Name: ${customerNameEl.value.trim()}`,
      `Phone: ${customerPhoneEl.value.trim()}`,
      `Items: ${orderItemsEl.value.trim()}`,
      `Note: ${orderNoteEl.value.trim() || "N/A"}`
    ].join("\n");

    window.open(buildWhatsappUrl(message), "_blank");
  });
};

const initMobileMenu = () => {
  burgerBtnEl.addEventListener("click", () => {
    const isOpen = mainNavEl.classList.toggle("open");
    burgerBtnEl.setAttribute("aria-expanded", String(isOpen));
  });

  mainNavEl.querySelectorAll("a").forEach((navLink) => {
    navLink.addEventListener("click", () => {
      mainNavEl.classList.remove("open");
      burgerBtnEl.setAttribute("aria-expanded", "false");
    });
  });
};

const initEvents = () => {
  searchInputEl.addEventListener("input", renderProducts);
  categoryFilterEl.addEventListener("change", renderProducts);
};

const init = () => {
  initBranding();
  populateCategories();
  renderProducts();
  initEvents();
  initOrderForm();
  initMobileMenu();
};

init();
