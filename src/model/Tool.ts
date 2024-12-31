const tools = ["configure", "swap"] as const;

type Tool = (typeof tools)[number];

export { tools };
export type { Tool };
