import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: Request) {
  try {
    const { latitude, longitude, radium_km } = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/products/get-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude: latitude, longitude: longitude, radium_km: radium_km }),
    });

    if(!res.ok) throw new Error("Ocorreu um interno")

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro na consulta", details: String(err) },
      { status: 500 }
    );
  }
}
