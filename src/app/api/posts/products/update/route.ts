import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: Request) {
  try {
    const { product_id, name, description, stock, price, imagesUrl } = await req.json();

    console.log("Dados recebidos no backend:", { product_id, name, description, stock, price, imagesUrl });

    const res = await fetch(`${BACKEND_URL}/api/products/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id, name, description, stock, price, imagesUrl }),
    });

    if (!res.ok) throw new Error("Ocorreu um interno")

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao atualizar produto: ", details: String(err) },
      { status: 500 }
    );
  }
}
