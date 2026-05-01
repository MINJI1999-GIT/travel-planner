import { createPostHandler } from "@/lib/create-post-handler"
import { handlePlan } from "./_plan"

export const POST = createPostHandler(handlePlan)
