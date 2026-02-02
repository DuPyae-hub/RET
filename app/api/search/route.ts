import { NextResponse } from "next/server";

// Search API removed — respond with 404 Not Found
export async function GET() {
  return NextResponse.json(
    { error: "Search API has been removed" },
    { status: 404 },
  );
}
