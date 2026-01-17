export type BotOptions = {
  token: string;
  ownerId: string;
  applicationId: string;
};

const require = <T>(v: T | undefined): T => {
  if (v === undefined) {
    throw new Error('undefined value.');
  }
  
  return v;
};

export const loadBotOptions = (): BotOptions => ({
  token         : require(process.env.DISCORD_TOKEN),
  ownerId       : require(process.env.DISCORD_OWNER_ID),
  applicationId : require(process.env.DISCORD_APPLICATION_ID),
});
