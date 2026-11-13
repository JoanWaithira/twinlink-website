// Partner logos (src/assets/partners/), looked up by the file name given in site.ts.
const logos = import.meta.glob<{ default: ImageMetadata }>('../assets/partners/*', { eager: true });
export const partnerLogo = (file?: string) => file ? Object.entries(logos).find(([p]) => p.endsWith(`/${file}`))?.[1].default : undefined;
