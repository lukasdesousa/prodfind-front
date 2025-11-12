import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: Request) {
  try {
    const { name, description, stock, price, preferences, latitude, longitude, imagesUrl, seller_id } = await req.json();
    
    console.log(name, description, stock, price, preferences, latitude, longitude, imagesUrl, seller_id)

    const res = await fetch(`${BACKEND_URL}/api/products/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, description: description, stock: stock, price: price, preferences: preferences, latitude: latitude, longitude: longitude, imagesUrl: imagesUrl, seller_id: seller_id }),
    });

    if(!res.ok) throw new Error("Ocorreu um interno")

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro na criação de produto: ", details: String(err) },
      { status: 500 }
    );
  }
}
