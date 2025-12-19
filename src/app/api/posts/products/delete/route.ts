import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: Request) {
  try {
    const { product_id } = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/products/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product_id }),
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
