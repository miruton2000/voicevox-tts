export type TtsOptions = {
  port: number;
  speaker: number;
  ownerId: string;
};

export const getTtsOptions = (): TtsOptions => ({
  port: Number(process.env.ENGINE_PORT ?? "50021"),
  speaker: Number(process.env.ENGINE_SPEAKER ?? "1"),
  ownerId: process.env.OWNER_ID ?? "",
});
