import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: email, password: password }),
    });

    if (!res.ok) throw new Error("Ocorreu um interno")

    const data = await res.json();
    const response = NextResponse.json(data, { status: res.status });

    response.cookies.set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 2,
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao criar usuário", details: String(err) },
      { status: 500 }
    );
  }
}
