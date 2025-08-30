import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST() {
  revalidateTag("hn:front");
  return NextResponse.json({ ok: true, tag: "hn:front" });
}
