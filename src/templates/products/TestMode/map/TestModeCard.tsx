'use client';

import styled from "styled-components";
import Image from "next/image";
import { Button } from "antd";
import Link from "next/link";
import { TestModeProduct } from "@/types/TestMode/Map";

export default function Card({
    id,
    title,
    description,
    imageSrc,
    price,
    storename,
}: TestModeProduct) {
    return (
        <CardContainer>
            <Image
                src={imageSrc!}
                alt={title}
                width={200}
                height={200}
                style={{ margin: "15px auto", height: "auto" }}
            />

            <Info>
                <h1>{title}</h1>
                <p>{description}</p>
                <h2>
                    {price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </h2>
            </Info>

            <p>
                Anunciado por <strong>{storename}</strong>
            </p>

            <Link style={{ width: "100%" }} href={`/produtos/info/${id}`}>
                <Button disabled style={{ width: "100%" }} type="primary">
                    Ver mais
                </Button>
            </Link>
        </CardContainer>
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