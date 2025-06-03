const DEFAULT_IMAGES = {
  AIRCONDITIONER: "/images/airconditioner.svg",
  REFRIGERATOR: "/images/refrigerator.svg",
  WASHER: "/images/washer.svg",
} as const;

type DefaultImageType = keyof typeof DEFAULT_IMAGES;

export const getImageUrl = (
  imageUrl: string | null | undefined,
  type: DefaultImageType = "REFRIGERATOR"
): string => {
  if (!imageUrl) {
    return DEFAULT_IMAGES[type];
  }
  return imageUrl;
};

export const getRandomDefaultImage = (): string => {
  const types = Object.keys(DEFAULT_IMAGES) as DefaultImageType[];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return DEFAULT_IMAGES[randomType];
};
