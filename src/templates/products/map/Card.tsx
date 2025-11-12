'use client';

import styled from "styled-components";
import type { CardType } from "@/types/CardType/CardType";
import Image from "next/image";
import { Button } from "antd";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

export default function Card(data: CardType) {
    const { id } = useAppSelector((state) => state.user);

    return (
        <>
            <CardContainer>
                {id && id === data.sellerId && (
                    <p><strong>Seu anúncio</strong></p>
                )}
                <p><strong></strong></p>
                <Image src={data.imagesUrl} alt="teste"
                    width={200} height={200} style={{ margin: "15px auto" }}
                />
                <Info>
                    <h1 className="">{data.title}</h1>
                    <p>{data.description}</p>
                    <h2>{data.item_price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}</h2>
                </Info>
                <p>Anunciado por <strong>{data.seller_storename}</strong></p>
                <Link style={{width: '100%'}} href={`/produtos/info/${data.product_id}`}><Button style={{ margin: '0 auto', width: '100%' }} type="primary">Ver mais </Button></Link>
            </CardContainer>
        </>
    );
}

const CardContainer = styled.section`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    margin: 0;

    img {
        border-bottom: 2px solid #e6e6e6;
    }
`;

const Info = styled.section`
    padding: 0;

    h1 {
        font-size: 1.2rem;
    }
`;