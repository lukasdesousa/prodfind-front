'use client';

import styled from "styled-components";
import type { CardType } from "@/src/types/CardType/CardType";
import Image from "next/image";
import { Button } from "antd";

export default function Card(data: CardType) {
    return (
        <>
            <CardContainer>
                <Image src={"/images/bike.webp"} alt="teste"
                    width={200} height={200} style={{margin: "15px auto"}}
                />
                <Info>
                    <h1 className="">{data.title}</h1>
                    <p>{data.description}</p>
                    <h2>{data.item_price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}</h2>
                </Info>
                <p>{data.seller_name}</p>
                <Button style={{margin: '0 auto', width: '80%'}} type="primary">Ver mais </Button>
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