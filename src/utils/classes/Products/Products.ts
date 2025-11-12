export default class ProductClass {
  protected userId = "";

  constructor(userId: string) {
    this.userId = userId;
  }

  async get_products(latitude: number, longitude: number, radium_km: number) {
    try {
      const res = await fetch("/api/posts/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: latitude, longitude: longitude, radium_km: radium_km }),
      });

      if (!res.ok) {
        throw new Error(`Erro ao buscar produtos: ${res.statusText}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }

  async create_product(data: { name: string; description: string; stock: number; price: number; preferences: number; latitude: number; longitude: number, base64Images: string[] }) {
    try {

      const imagesUrl = await this.upload_images(data.base64Images);

      const res = await fetch("/api/posts/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, description: data.description, stock: data.stock, price: data.price, preferences: data.preferences, latitude: data.latitude, longitude: data.longitude, imagesUrl: imagesUrl, seller_id: this.userId })
      });

      if (!res.ok) {
        throw new Error(`Erro ao criar produto: ${res.statusText}`);
      }

      const result = await res.json();
      return ({ success: true, data: result });
    } catch (err) {
      throw err;
    }
  }

  async upload_images(base64Images: string[]) {
    try {
      const response = await fetch("/api/posts/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: base64Images }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("URLs enviadas:", data.urls);
        return data.urls
      } else {
        return console.error(data.error || "Erro ao enviar arquivos.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getOne(id: number) {
    try {
      const response = await fetch(`/api/posts/products/get-one`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar produto: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Erro interno ao buscar produto", ${(error as Error).message}`);
    }
  }
}
