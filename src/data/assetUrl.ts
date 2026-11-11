/**
 * Turns a path from `public/` into a URL that works wherever the site is
 * deployed. At the root it returns "/soraya.webp"; under a sub-path such as
 * GitHub Pages it returns "/portfolio/soraya.webp".
 */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
