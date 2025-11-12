'use client';

import Header from "@/components/ui/header/Header";
import InfoCard from "@/components/ui/products/InfoCard/InfoCard";
import ProductClass from "@/utils/classes/Products/Products";
import { useEffect, useState } from "react";
import { Products } from "@/types/Products/ProductsTypes";

export default function ProductInfo({ id }: { id: number }) {
    const productClass = new ProductClass("");
    const [product, setProduct] = useState<Products>();

    useEffect(() => {
        async function getProduct() {
            const search = await productClass.getOne(id)
            if (search.product) setProduct(search.product);
        }
        
        if (id) getProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
    
    console.log(product)
    return (
        <>
            <Header />
            <InfoCard name={product?.name || ''} description={product?.description || ''} imagesUrl={product && Array.isArray(product.imagesUrl) ? product.imagesUrl : []} price={product?.price || 0} sellerName={product?.seller.storeName || ''} />
        </>
    );
}