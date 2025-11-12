import { UploadFile } from "antd";

export type Products = {
    id: number;
    created_at: string;
    description: string;
    distance: number;
    imagesUrl: string;
    keys: Array<string>;
    latitude: number;
    longitude: number;
    name: string;
    price: number;
    sellerId: string;
    seller: {
        email: string;
        id: string;
        latitude?: number;
        longitude?: number;
        storeName: string
    }
    storename: string; // alternativo para uso em "Map"
    stock: number;
}

export type CreateProductsForm = {
    name: string;
    description: string;
    images: UploadFile[]
    stock: number;
    price: number;
    preferences: number;
    latitude: number;
    longitude: number;
}