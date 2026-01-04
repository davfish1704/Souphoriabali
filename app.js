// Editable site config
const siteConfig = {
  brandName: 'Souphoria',
  tagline: 'Pork rice bowls and signature soup in Kerobokan / Canggu',
  whatsappNumber: '6281234567890', // replace with country code + number
  greeting: 'Hi Souphoria team!',
  mapLink: 'https://goo.gl/maps/example',
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.751845667019!2d115.1500!3d-8.6700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSouphoria!5e0!3m2!1sen!2sid!4v00000000000',
  address: 'Jalan Raya Kerobokan No. 123, Canggu, Bali',
  openingHours: 'Mon-Sun 10:00 - 22:00',
  instagram: 'https://instagram.com/souphoria',
  menuImages: [
    { src: 'assets/menu-bowl.svg', alt: 'Signature soup bowl menu' },
    { src: 'assets/menu-pork.svg', alt: 'Pork bowls menu' },
    { src: 'assets/menu-bites.svg', alt: 'Small bites menu' }
  ],
  structuredMenu: [
    {
      category: 'Pork with Rice',
      items: [
        { name: 'Crispy Pork Rice', price: 52000, description: 'Crackling pork belly, sambal matah, pickles', bestseller: true },
        { name: 'Char Siu Rice Bowl', price: 48000, description: 'Glazed pork char siu, soft egg, greens' },
        { name: 'BBQ Pork Rice', price: 50000, description: 'Smoky BBQ pork, jasmine rice, house sauce', spicy: true }
      ]
    },
    {
      category: 'Signature Soup',
      items: [
        { name: 'Bone Broth Soup', price: 45000, description: 'Slow-simmered pork bone broth, noodles', bestseller: true },
        { name: 'Spicy Tantan Soup', price: 48000, description: 'Creamy spicy broth, minced pork, chili oil', spicy: true },
        { name: 'Mushroom Comfort Soup', price: 42000, description: 'Earthy mushrooms, garlic oil, herbs' }
      ]
    },
    {
      category: 'Small Bites',
      items: [
        { name: 'Fried Gyoza (5pc)', price: 32000, description: 'Pork + chive filling, dipping sauce' },
        { name: 'Crispy Pork Skins', price: 28000, description: 'Lightly salted cracklings, lime', bestseller: true },
        { name: 'Charred Corn Ribs', price: 26000, description: 'Tamarind glaze, chili flakes', spicy: true }
      ]
    }
  ]
};

// --- Utility helpers ---
const formatPrice = (amount) => `IDR ${amount.toLocaleString('id-ID')}`;
const createWAUrl = (message) => `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

function setCTA(el) {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const message = buildWhatsAppMessage();
    window.dataLayer.push({ event: 'wa_cta_click', label: el.id || 'cta' });
    window.open(createWAUrl(message), '_blank');
  });
}

// --- Render functions ---
function renderGallery() {
  const gallery = document.getElementById('menuGallery');
  gallery.innerHTML = '';
  siteConfig.menuImages.forEach((img) => {
    const image = document.createElement('img');
    image.src = img.src;
    image.alt = img.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    gallery.appendChild(image);
  });
}

function populateFilters() {
  const select = document.getElementById('categoryFilter');
  siteConfig.structuredMenu.forEach(({ category }) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

function renderMenu() {
  const grid = document.getElementById('menuGrid');
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const categoryValue = document.getElementById('categoryFilter').value;
  grid.innerHTML = '';

  siteConfig.structuredMenu.forEach(({ category, items }) => {
    items.forEach((item) => {
      const matchesCategory = categoryValue === 'all' || categoryValue === category;
      const matchesSearch = item.name.toLowerCase().includes(searchValue) || (item.description || '').toLowerCase().includes(searchValue);
      if (!matchesCategory || !matchesSearch) return;

      const card = document.createElement('div');
      card.className = 'menu-card';

      const top = document.createElement('div');
      top.className = 'top';
      const img = document.createElement('img');
      img.className = 'thumb';
      img.src = siteConfig.menuImages[0]?.src || 'assets/menu-bowl.svg';
      img.alt = `${item.name} photo`;
      img.loading = 'lazy';
      top.appendChild(img);

      const details = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = item.name;
      details.appendChild(title);

      const desc = document.createElement('div');
      desc.textContent = item.description || '';
      desc.style.color = 'var(--muted)';
      desc.style.fontSize = '0.95rem';
      details.appendChild(desc);

      const tagWrap = document.createElement('div');
      tagWrap.className = 'tags';
      if (item.bestseller) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = 'Popular';
        tagWrap.appendChild(tag);
      }
      if (item.spicy) {
        const tag = document.createElement('span');
        tag.className = 'tag spicy';
        tag.textContent = 'Spicy';
        tagWrap.appendChild(tag);
      }
      details.appendChild(tagWrap);

      top.appendChild(details);
      card.appendChild(top);

      const footer = document.createElement('div');
      footer.className = 'card-footer';
      const price = document.createElement('span');
      price.className = 'price';
      price.textContent = formatPrice(item.price);
      footer.appendChild(price);

      const btn = document.createElement('button');
      btn.className = 'button primary';
      btn.style.padding = '10px 14px';
      btn.textContent = 'Add to order';
      btn.addEventListener('click', () => {
        addToOrder(item.name, item.price, category);
        window.dataLayer.push({ event: 'add_to_order', item: item.name });
      });
      footer.appendChild(btn);

      card.appendChild(footer);
      grid.appendChild(card);
    });
  });
}

// --- Order management ---
const orderState = new Map();

function addToOrder(name, price, category) {
  const key = name;
  const existing = orderState.get(key) || { qty: 0, price, category };
  orderState.set(key, { ...existing, qty: existing.qty + 1 });
  renderOrder();
}

function updateQty(name, delta) {
  const item = orderState.get(name);
  if (!item) return;
  const newQty = item.qty + delta;
  if (newQty <= 0) {
    orderState.delete(name);
  } else {
    orderState.set(name, { ...item, qty: newQty });
  }
  renderOrder();
}

function renderOrder() {
  const list = document.getElementById('orderList');
  list.innerHTML = '';
  let total = 0;

  if (orderState.size === 0) {
    list.innerHTML = '<div style="color:var(--muted);">No items yet. Add from the menu.</div>';
  }

  orderState.forEach((item, name) => {
    total += item.qty;
    const row = document.createElement('div');
    row.className = 'order-item';

    const info = document.createElement('div');
    info.innerHTML = `<strong>${name}</strong><br><span style="color:var(--muted);font-size:0.9rem;">${formatPrice(item.price)} x ${item.qty}</span>`;
    row.appendChild(info);

    const controls = document.createElement('div');
    controls.className = 'qty-control';
    const minus = document.createElement('button');
    minus.setAttribute('aria-label', `Remove ${name}`);
    minus.textContent = '-';
    minus.addEventListener('click', () => updateQty(name, -1));
    const plus = document.createElement('button');
    plus.setAttribute('aria-label', `Add ${name}`);
    plus.textContent = '+';
    plus.addEventListener('click', () => updateQty(name, 1));
    controls.append(minus, plus);

    row.appendChild(controls);
    list.appendChild(row);
  });

  document.getElementById('totalCount').textContent = total;
}

function buildWhatsAppMessage() {
  const lines = [
    `${siteConfig.greeting} I want to order:`,
    ''
  ];
  if (orderState.size === 0) {
    lines.push('No items added yet, please share today\'s recommendations.');
  } else {
    orderState.forEach((item, name) => {
      lines.push(`- ${name} x${item.qty} (${formatPrice(item.price)})`);
    });
  }
  lines.push('', 'Pickup or delivery?', 'Location: ' + siteConfig.address, 'Thank you!');
  return lines.join('\n');
}

// --- Footer & map ---
function hydrateInfo() {
  document.getElementById('addressBadge').textContent = siteConfig.address;
  document.getElementById('hoursBadge').textContent = siteConfig.openingHours;
  document.getElementById('mapFrame').src = siteConfig.mapEmbed;
  document.getElementById('ctaDirections').href = siteConfig.mapLink;
  document.getElementById('ctaMaps').href = siteConfig.mapLink;
  document.getElementById('footerAddress').textContent = siteConfig.address;
  document.getElementById('footerHours').textContent = `Hours: ${siteConfig.openingHours}`;
  const footerWA = document.getElementById('footerWA');
  footerWA.textContent = `+${siteConfig.whatsappNumber}`;
  footerWA.href = createWAUrl(siteConfig.greeting);
  document.getElementById('footerIG').href = siteConfig.instagram;
  document.getElementById('floatingWA').href = createWAUrl(siteConfig.greeting);
}

// --- JSON-LD ---
function injectSchema() {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.brandName,
    description: siteConfig.tagline,
    telephone: `+${siteConfig.whatsappNumber}`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressLocality: 'Kerobokan',
      addressRegion: 'Bali',
      addressCountry: 'ID'
    },
    openingHours: siteConfig.openingHours,
    sameAs: [siteConfig.instagram],
    url: 'https://souphoria.example.com'
  });
  document.head.appendChild(script);
}

function bindSearch() {
  document.getElementById('searchInput').addEventListener('input', renderMenu);
  document.getElementById('categoryFilter').addEventListener('change', renderMenu);
}

function bindOrderCTA() {
  const ctas = ['navOrder', 'heroOrder', 'floatingWA'];
  ctas.forEach((id) => {
    const el = document.getElementById(id);
    setCTA(el);
  });
  document.getElementById('sendOrder').addEventListener('click', () => {
    const message = buildWhatsAppMessage();
    window.dataLayer.push({ event: 'wa_order_send', items: Array.from(orderState.entries()) });
    window.open(createWAUrl(message), '_blank');
  });
  document.getElementById('clearOrder').addEventListener('click', () => {
    orderState.clear();
    renderOrder();
  });
}

function init() {
  renderGallery();
  populateFilters();
  renderMenu();
  renderOrder();
  hydrateInfo();
  injectSchema();
  bindSearch();
  bindOrderCTA();
}

document.addEventListener('DOMContentLoaded', init);
