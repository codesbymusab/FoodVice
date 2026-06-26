export type AIRecommendation = {
  id:string;
  name: string;
  reason: string;
  distanceKm: number;
  cuisine: string;
  priceCategory: string;
};

export type AIChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type AISummary = {
  verdict: string;
  pros: string[];
  cons: string[];
};

const BASE_URL = import.meta.env.VITE_API_BASE

export async function fetchAIRecommendations({
  query,
  location,
  userId,
}: {
  query: string;
  location: [number, number] | null;
  userId?: string;
}): Promise<AIRecommendation[]> {
  try {
    const res = await fetch(`${BASE_URL}/ai/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        query,
        location: location ? { lat: location[0], lon: location[1] } : undefined,
        userId,
      }),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch AI recommendations');
    }
    return (await res.json()) as AIRecommendation[];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchAIChat({
  messages,
  location,
  userId,
}: {
  messages: AIChatMessage[];
  location: [number, number] | null;
  userId?: string;
}): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        messages,
        location: location ? { lat: location[0], lon: location[1] } : undefined,
        userId,
      }),
    });
    if (!res.ok) {
      throw new Error('Failed to chat with AI');
    }
    const json = await res.json();
    return json.response ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchAISummary({
  restaurantId,
  restaurantName,
}: {
  restaurantId: string;
  restaurantName: string;
}): Promise<AISummary | null> {
  try {
    const res = await fetch(`${BASE_URL}/ai/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ restaurantId, restaurantName }),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch AI summary');
    }
    return (await res.json()) as AISummary;
  } catch (error) {
    console.error(error);
    return null;
  }
}
