import { NextResponse } from "next/server";
import { handlePlan, handleGetPlan, handleUpdatePlan, handleDeletePlan } from "@/services/plan/plan";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await handlePlan(body);
    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: error.status || 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");

  try {
    const result = await handleGetPlan({ lat, lng });
    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: error.status || 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const result = await handleUpdatePlan(body);
    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: error.status || 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const result = await handleDeletePlan(body);
    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: error.status || 500 });
  }
}
