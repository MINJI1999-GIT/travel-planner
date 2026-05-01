import type { Place } from "./places"

export type ItineraryResult = {
  places: {
    name: string
    type: string
    distance_km: number
    description: string
    opening_hours: string
    entrance_fee_thb: number
  }[]
  itinerary: {
    time: string
    activity: string
    place: string
    transport: string
    transport_cost_thb: number
    activity_cost_thb: number
  }[]
  estimated_cost_thb: number
  tips: string[]
}

export async function generateItinerary(
  cityName: string,
  lat: number,
  lng: number,
  places: Place[]
): Promise<ItineraryResult> {
  const { default: OpenAI } = await import("openai")
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Travel Planner",
    },
  })

  const prompt = `I am at ${cityName} (lat: ${lat}, lng: ${lng}).
Here are real nearby tourist attractions from OpenStreetMap:
${JSON.stringify(places, null, 2)}

Based on these real places, create a 1-day itinerary and recommendations.
Order the itinerary logically to minimize travel time.
Reply ONLY with a JSON object in this exact structure:
{
  "places": [
    {
      "name": "string",
      "type": "string",
      "distance_km": number,
      "description": "string",
      "opening_hours": "string",
      "entrance_fee_thb": number
    }
  ],
  "itinerary": [
    {
      "time": "string",
      "activity": "string",
      "place": "string",
      "transport": "string",
      "transport_cost_thb": number,
      "activity_cost_thb": number
    }
  ],
  "estimated_cost_thb": number,
  "tips": ["string"]
}`

  const response = await client.chat.completions.create({
    model: "google/gemma-4-26b-a4b-it:free",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a travel planner. Reply in JSON only. Use only the places provided. Follow the exact JSON structure.",
      },
      { role: "user", content: prompt },
    ],
  })

  const raw = response.choices[0].message.content
  if (!raw) {
    throw Object.assign(new Error("No response from LLM"), { status: 503 })
  }
  const content = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()
  return JSON.parse(content) as ItineraryResult
}
