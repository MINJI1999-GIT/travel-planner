type Handler<T> = (input: T) => Promise<unknown>

const ok   = (data: unknown) => Response.json({ status: "success", data })
const fail = (message: string, code: number) =>
  Response.json({ status: "error", message }, { status: code })

export function withBody<T>(fn: Handler<T>) {
  return async (req: Request): Promise<Response> => {
    try {
      return ok(await fn(await req.json() as T))
    } catch (err: any) {
      return fail(err.message ?? "Internal server error", err.status ?? 500)
    }
  }
}

export function withQuery<T>(fn: Handler<T>) {
  return async (req: Request): Promise<Response> => {
    try {
      const raw = Object.fromEntries(new URL(req.url).searchParams)
      const input = Object.fromEntries(
        Object.entries(raw).map(([k, v]) => [k, v !== "" && !isNaN(+v) ? +v : v])
      )
      return ok(await fn(input as T))
    } catch (err: any) {
      return fail(err.message ?? "Internal server error", err.status ?? 500)
    }
  }
}
