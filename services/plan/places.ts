export type Place = {
  name: string
  type: string
  distance_km: number | null
  opening_hours: string | null
}

export async function fetchPlaces(lat: number, lng: number): Promise<Place[]> {
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["tourism"~"attraction|museum|viewpoint|artwork|theme_park|zoo|aquarium|gallery"](around:5000,${lat},${lng});
      way["tourism"~"attraction|museum|viewpoint|artwork|theme_park|zoo|aquarium|gallery"](around:5000,${lat},${lng});
    );
    out center 10;
  `

  const res = await fetch("https://overpass.kumi.systems/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "TravelPlanner/1.0 (pimted.kit@gmail.com)",
    },
    body: `data=${encodeURIComponent(overpassQuery)}`,
  })

  if (!res.ok) {
    throw Object.assign(new Error("Failed to fetch nearby places"), { status: 502 })
  }

  const data = await res.json()
  const elements: any[] = data.elements ?? []

  if (elements.length === 0) {
    throw Object.assign(new Error("No tourist places found nearby"), { status: 404 })
  }

  return elements
    .slice(0, 10)
    .map((el): Place | null => {
      const name = el.tags?.["name:en"] || el.tags?.name
      if (!name) return null
      const placeLat: number = el.lat ?? el.center?.lat
      const placeLng: number = el.lon ?? el.center?.lon
      const distance_km =
        placeLat && placeLng
          ? Math.round(
              Math.sqrt(
                Math.pow((placeLat - lat) * 111, 2) +
                  Math.pow((placeLng - lng) * 111 * Math.cos((lat * Math.PI) / 180), 2)
              ) * 10
            ) / 10
          : null
      return {
        name,
        type: el.tags?.tourism ?? "attraction",
        distance_km,
        opening_hours: el.tags?.opening_hours ?? null,
      }
    })
    .filter((p): p is Place => p !== null)
}
