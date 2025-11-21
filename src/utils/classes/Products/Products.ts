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

      // NOVAS IMAGENS ADICIONADAS NA ABA "EDITAR"
      const newImages = base64Images.filter((img) => {
        return img.startsWith("data:image/")
      });

      // IMAGENS JÁ ENVIADAS ANTERIORMENTE
      const uploadedImages = base64Images.filter((img) => {
        return !img.startsWith("data:image/")
      });

      let newUrls = [];

      if (newImages.length === 0) {
        return uploadedImages;
      }

      const response = await fetch("/api/posts/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: newImages }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao enviar arquivos aaa.");
      }

      const data = await response.json();
      newUrls = data.urls;

      return [...uploadedImages, ...newUrls];
    } catch (error) {
      console.error("Erro no upload:", error);
      throw error;
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

  async update(updatedData: { product_id: number, name?: string; description?: string; stock?: number; price?: number; imagesUrl?: string[] }) {
    try {

      const imagesUrl = await this.upload_images(updatedData.imagesUrl!);

      const response = await fetch(`/api/posts/products/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: updatedData.product_id,
          name: updatedData.name,
          description: updatedData.description,
          stock: updatedData.stock,
          price: updatedData.price,
          imagesUrl: imagesUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar produto: ${response.statusText}`);
      }

      const data = await response.json();
      return {success: true, data};
    } catch (error) {
      throw new Error(`Erro ao atualizar produto: ${(error as Error).message}`);
    }
  }
}
