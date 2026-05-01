export function createPostHandler<TInput>(
  fn: (input: TInput) => Promise<unknown>
) {
  return async (req: Request): Promise<Response> => {
    try {
      const input = (await req.json()) as TInput
      const result = await fn(input)
      return Response.json(result)
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: err.status ?? 500 })
    }
  }
}
