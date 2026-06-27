import { NextRequest, NextResponse } from "next/server";
import { verifyToken, findUserById } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") || 
    req.cookies.get("fh_token")?.value || "";

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = findUserById(decoded.id);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const { password: _, ...userWithoutPassword } = user;
  return NextResponse.json({ user: userWithoutPassword });
}
