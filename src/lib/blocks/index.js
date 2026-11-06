const modules = import.meta.glob('./*/index.js', { eager: true });

export const blockTypes = Object.fromEntries(
  Object.entries(modules)
    .map(([path, mod]) => [path.split('/')[1], mod.default])
    .sort(([, a], [, b]) => (a.weight ?? 0) - (b.weight ?? 0) || a.label.localeCompare(b.label))
);