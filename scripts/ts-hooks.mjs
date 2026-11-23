// Lets plain Node import the site's data files (src/data/*.ts) without Vite:
// imports without an extension get ".ts", and `import.meta.env.BASE_URL`
// becomes the folder the site is served from. Node strips the types itself.
const base = process.env.BASE_PATH || "/";

export async function resolve(specifier, context, nextResolve) {
  const relative = specifier.startsWith("./") || specifier.startsWith("../");
  if (relative && !/\.[cm]?[jt]sx?$/.test(specifier) && context.parentURL?.endsWith(".ts")) {
    return nextResolve(`${specifier}.ts`, context);
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (url.endsWith(".ts") && result.source) {
    const source = String(result.source).replaceAll(
      "import.meta.env.BASE_URL",
      JSON.stringify(base)
    );
    return { ...result, source };
  }
  return result;
}
