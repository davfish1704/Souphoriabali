// Site content configuration
const siteConfig = {
  brandName: 'Souphoria',
  tagline: 'Pork rice bowls and signature soup in Kerobokan / Canggu',
  gojekLink: 'https://gojek.com',
  grabLink: 'https://grab.com',
  mapLink: 'https://goo.gl/maps/example',
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.751845667019!2d115.1500!3d-8.6700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSouphoria!5e0!3m2!1sen!2sid!4v00000000000',
  address: 'Jalan Raya Kerobokan No. 123, Canggu, Bali',
  openingHours: 'Mon-Sun 10:00 - 22:00',
  instagram: 'https://instagram.com/souphoria',
  phone: '+62 812-3456-7890',
  // AI image references for menu cards
  itemImage: {
    src: 'https://image.pollinations.ai/prompt/moody%20pork%20rice%20bowl%20with%20soup%2C%20dark%20warm%20lighting%2C%20realistic%20street%20food%20photography',
    alt: 'Pork rice bowl and soup in warm lighting',
    path: '/assets/images/menu/ai-menu-thumb.jpg',
    prompt: 'moody pork rice bowl with soup, dark warm lighting, realistic street food photography'
  },
  structuredMenu: [
    {
      category: 'Pork with Rice',
      items: [
        { name: 'Crispy Pork Rice', price: 52000, description: 'Crackling pork belly, sambal matah, pickles', badge: 'Bestseller' },
        { name: 'Char Siu Rice Bowl', price: 48000, description: 'Glazed pork char siu, soft egg, greens' },
        { name: 'BBQ Pork Rice', price: 50000, description: 'Smoky BBQ pork, jasmine rice, house sauce', badge: 'Spicy' }
      ]
    },
    {
      category: 'Signature Soup',
      items: [
        { name: 'Bone Broth Soup', price: 45000, description: 'Slow-simmered pork bone broth, noodles', badge: 'Comfort pick' },
        { name: 'Spicy Tantan Soup', price: 48000, description: 'Creamy spicy broth, minced pork, chili oil', badge: 'Spicy' },
        { name: 'Mushroom Comfort Soup', price: 42000, description: 'Earthy mushrooms, garlic oil, herbs' }
      ]
    },
    {
      category: 'Small Bites',
      items: [
        { name: 'Fried Gyoza (5pc)', price: 32000, description: 'Pork + chive filling, dipping sauce' },
        { name: 'Crispy Pork Skins', price: 28000, description: 'Lightly salted cracklings, lime', badge: 'Crunchy' },
        { name: 'Charred Corn Ribs', price: 26000, description: 'Tamarind glaze, chili flakes', badge: 'Spicy' }
      ]
    }
  ]
};

const formatPrice = (amount) => `IDR ${amount.toLocaleString('id-ID')}`;

function renderMenu() {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';

  siteConfig.structuredMenu.forEach(({ category, items }) => {
    const header = document.createElement('div');
    header.className = 'menu-card';
    header.style.background = 'transparent';
    header.style.boxShadow = 'none';
    header.innerHTML = `<h3 style="margin:0 0 6px;">${category}</h3><p style="margin:0;color:var(--muted);">Comfort picks served all day.</p>`;
    grid.appendChild(header);

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'menu-card';

      const top = document.createElement('div');
      top.className = 'top';
      const img = document.createElement('img');
      img.className = 'thumb';
      img.src = siteConfig.itemImage.src;
      img.alt = siteConfig.itemImage.alt;
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

      if (item.badge) {
        const tagWrap = document.createElement('div');
        tagWrap.className = 'tags';
        const tag = document.createElement('span');
        tag.className = 'tag';
        if (item.badge.toLowerCase().includes('spicy')) tag.classList.add('spicy');
        tag.textContent = item.badge;
        tagWrap.appendChild(tag);
        details.appendChild(tagWrap);
      }

      top.appendChild(details);
      card.appendChild(top);

      const footer = document.createElement('div');
      footer.className = 'card-footer';
      const price = document.createElement('span');
      price.className = 'price';
      price.textContent = formatPrice(item.price);
      footer.appendChild(price);

      const hint = document.createElement('span');
      hint.style.color = 'var(--muted)';
      hint.style.fontSize = '0.9rem';
      hint.textContent = 'Order via Gojek or Grab';
      footer.appendChild(hint);

      card.appendChild(footer);
      grid.appendChild(card);
    });
  });
}

function hydrateInfo() {
  document.getElementById('addressBadge').textContent = siteConfig.address;
  document.getElementById('hoursBadge').textContent = siteConfig.openingHours;
  document.getElementById('mapFrame').src = siteConfig.mapEmbed;
  document.getElementById('ctaDirections').href = siteConfig.mapLink;
  document.getElementById('ctaMaps').href = siteConfig.mapLink;
  document.getElementById('footerAddress').textContent = siteConfig.address;
  document.getElementById('footerHours').textContent = `Hours: ${siteConfig.openingHours}`;
}

function hydrateDeliveryLinks() {
  document.querySelectorAll('[data-delivery="gojek"]').forEach((link) => {
    link.href = siteConfig.gojekLink;
  });
  document.querySelectorAll('[data-delivery="grab"]').forEach((link) => {
    link.href = siteConfig.grabLink;
  });
}

function injectSchema() {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.brandName,
    description: siteConfig.tagline,
    telephone: siteConfig.phone,
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

function init() {
  renderMenu();
  hydrateInfo();
  hydrateDeliveryLinks();
  injectSchema();
}

document.addEventListener('DOMContentLoaded', init);
