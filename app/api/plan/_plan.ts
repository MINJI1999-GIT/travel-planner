import { fetchPlaces } from "./_places"
import { generateItinerary, type ItineraryResult } from "./_itinerary"

type PlanInput = {
  cityName: string
  lat: number
  lng: number
}

const cache = new Map<string, { data: ItineraryResult; expiresAt: number }>()
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

export async function handlePlan({ cityName, lat, lng }: PlanInput): Promise<ItineraryResult> {
  if (!cityName || typeof lat !== "number" || typeof lng !== "number") {
    throw Object.assign(new Error("cityName, lat, and lng are required"), { status: 400 })
  }

  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`
  const cached = cache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) return cached.data

  const places = await fetchPlaces(lat, lng)
  const result = await generateItinerary(cityName, lat, lng, places)

  cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS })
  return result
}
