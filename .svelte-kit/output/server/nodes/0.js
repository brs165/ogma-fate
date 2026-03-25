

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.2nDza4nS.js","_app/immutable/chunks/Dx8Yv8aA.js","_app/immutable/chunks/Bd0vxY4w.js","_app/immutable/chunks/DVP8_kx0.js"];
export const stylesheets = [];
export const fonts = [];
