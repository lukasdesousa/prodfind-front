'use client';

import ProductsInfo from "@/templates/ProductInfo/ProductInfo";
import { useParams } from 'next/navigation';

export default function ProdCreate() {
    const params = useParams();
    const id = params.id;

    return (
        <>
           <ProductsInfo id={Number(id)} />
        </>
    )
}
