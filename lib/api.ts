type PlanInput = { cityName: string; lat: number; lng: number }
type LatLng = { lat: number; lng: number }

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init)
  const body = await res.json()
  if (body.status === "error") throw new Error(body.message ?? "Request failed")
  return body.data as T
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
})

/// หน้า API สำหรับเรียกใช้จาก client-side
export const createPlan = (input: PlanInput) => call("/api/plan/create", json("POST", input))
export const getPlan    = ({ lat, lng }: LatLng) => call(`/api/plan/get?lat=${lat}&lng=${lng}`)
export const updatePlan = (input: PlanInput) => call("/api/plan/update", json("PUT", input))
export const deletePlan = (input: LatLng)    => call("/api/plan/delete", json("DELETE", input))
