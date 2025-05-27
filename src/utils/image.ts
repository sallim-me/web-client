const DEFAULT_IMAGES = {
  airconditioner: "/images/airconditioner.svg",
  refrigerator: "/images/refrigerator.svg",
  washer: "/images/washer.svg",
} as const;

type DefaultImageType = keyof typeof DEFAULT_IMAGES;

export const getImageUrl = (
  imageUrl: string | null | undefined,
  type: DefaultImageType = "refrigerator"
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
