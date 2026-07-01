export const CONTACT = {
  name: "Amit Chadha",
  title: "Founder & Investment Advisor",
  company: "WealthMaster India",
  whatsapp: "919999252122", // E.164 without "+" for wa.me
  whatsappDisplay: "+91 99992 52122",
  email: "contact@wealthmasterindia.in",
  phone: "+91 99992 52122",
  phoneRaw: "9999252122",
  telHref: "tel:+919999252122",
  address: "Q-14, Rajouri Garden, New Delhi-110027",
};

export const waLink = (msg: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;

export const mailLink = (subject: string, body = "") =>
  `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
