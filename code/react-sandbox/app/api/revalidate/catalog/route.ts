import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST() {
  revalidateTag("catalog");
  return NextResponse.json({ ok: true });
}
