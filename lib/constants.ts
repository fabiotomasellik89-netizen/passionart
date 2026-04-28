export const siteConfig = {
  name: "PassionArt",
  claim: "Make Your Dreams",
  description:
    "Bomboniere, segnaposto e decorazioni personalizzate dal cuore artigianale, create per eventi da ricordare.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "+39 333 000 1122",
  email: "ciao@passionart.it",
  instagram: "@passionart.makeyourdreams",
  instagramUrl: "https://www.instagram.com/passionart.makeyourdreams",
  facebookUrl: "https://www.facebook.com/passionart.makeyourdreams",
  whatsappNumber: "393330001122",
  whatsappMessage: "Ciao! Vorrei informazioni sulle vostre bomboniere personalizzate.",
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/catalogo", label: "Catalogo" },
  { href: "/configuratore", label: "Configuratore" },
  { href: "/blog", label: "Blog" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/carrello", label: "Carrello" },
  { href: "/admin", label: "Admin" },
];

export const adminCookieName = "passionart_admin";

export const adminDemoCredentials = {
  email: "admin@passionart.it",
  password: "PassionArt2026!",
};
