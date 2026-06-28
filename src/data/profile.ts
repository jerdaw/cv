export type SiteMeta = {
  title: string;
  description: string;
  siteName: string;
};

export type ComingSoonContent = {
  eyebrow: string;
  title: string;
  message: string;
  note: string;
};

export const siteMeta: SiteMeta = {
  title: "Jeremy Dawson | Rewriting",
  description: "Jeremy Dawson's public site is being rewritten.",
  siteName: "Jeremy Dawson",
};

export const comingSoon: ComingSoonContent = {
  eyebrow: "Rewriting",
  title: "Jeremy Dawson",
  message: "This site is down while I rewrite it.",
  note: "Back when it's ready.",
};
