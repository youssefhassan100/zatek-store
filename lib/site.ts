export const SITE = {
  name: 'ZATEK',
  productName: 'Talk the Talk — 30-Day English Planner',
  tagline: 'Stop starting over. Start practicing.',
  instagram: 'https://www.instagram.com/5.zatek?stkn=MXV5MTZpc3JnOWl0aw%3D%3D&utm_source=qr',
  tiktok: 'https://www.tiktok.com/@_zatek_5?_r=1&_t=ZS-9AAJBSgoogz',
  logo: { src: '/logo.png', width: 560, height: 221 },
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/planner', label: 'The Planner' },
  { href: '/inside', label: 'What’s inside' },
  { href: '/about', label: 'About' },
  { href: '/track', label: 'Track order' },
] as const;
