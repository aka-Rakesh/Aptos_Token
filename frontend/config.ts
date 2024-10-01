import Placeholder1 from "@/assets/placeholders/asset.png";

export const config: Config = {
  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: "https://twitter.com/aka_rakesh19",
    discord: "https://discord.com/blade1.0.",
    homepage: "https://github.com/aka-Rakesh/Aptos_Token",
  },

  defaultAsset: {
    name: "SET DEFAULT",
    image: Placeholder1,
  },

  ourStory: {
    title: "Our Story",
    description: `We wish implement this token in a NFT card trading/battle game, more on that soon!`,
    discordLink: "https://discord.com/aka_rakesh19",
  },
};

export interface Config {
  socials?: {
    twitter?: string;
    discord?: string;
    homepage?: string;
  };

  defaultAsset?: {
    name: string;
    image: string;
  };

  ourStory?: {
    title: string;
    subTitle?: string;
    description: string;
    discordLink: string;
  };
}
