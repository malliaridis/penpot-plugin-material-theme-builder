const tools = ["swap-variant", "change-theme", "replace-theme"] as const;

type Tool = (typeof tools)[number];

export { tools };
export type { Tool };
