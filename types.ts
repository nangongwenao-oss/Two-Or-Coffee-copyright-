export interface CoffeeHero {
  id: string;
  name: string; // Coffee Name
  character: string; // Water Margin Character Name
  price: number;
  description: string;
  prompt: string; // Prompt for Gemini
}

export interface CartItem extends CoffeeHero {
  quantity: number;
}

export interface GeneratedImageMap {
  [key: string]: string | null; // id -> base64/url or null if failed
}