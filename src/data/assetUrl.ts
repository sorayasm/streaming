/**
 * Turns a path from `public/` into a URL that works wherever the site is
 * deployed. At the root it returns "/soraya.webp"; under a sub-path such as
 * GitHub Pages it returns "/portfolio/soraya.webp".
 */
/** Address of a page of the site, such as "capitulo/t1e05/", wherever it is deployed. */
export function pageUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
