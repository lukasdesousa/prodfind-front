'use client';

import UpdateProduct from "@/templates/products/update/UpdateProduct";
import { useParams } from 'next/navigation';

export default function ProdUpdate() {
    const params = useParams();
    const id = params.id;

    return (
        <>
           <UpdateProduct id={Number(id)} />
        </>
    )
}
