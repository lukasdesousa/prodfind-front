'use client';

import styled from "styled-components";
import { Carousel } from 'antd';
import Image from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";

export default function InfoCard(data: { name: string; description: string; price: number; imagesUrl: string[], sellerName: string }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data.name && data.description && data.price && data.sellerName) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [data])

    return (
        <>
            <Container>
                <Carousel arrows infinite={false} adaptiveHeight className="carousel">
                    {data.imagesUrl.length > 0 && data.imagesUrl.map((url, index) => (
                        <div key={index} style={{ margin: 'auto' }}>
                            <Image src={url} alt="Imagem de produto" width={300} height={300} style={{ margin: 'auto', maxWidth: '300px', width: '100%', height: 'auto' }} />
                        </div>
                    ))}
                </Carousel>
                {loading ? <Skeleton /> : (
                    <>
                        <h1>{data.name}</h1>
                        <p>{data.description}</p>
                        <h2>{data.price.toLocaleString('pt-BR', {
                            currency: 'BRL',
                            style: 'currency'
                        })}</h2>
                        <p>Anunciado por <strong>{data.sellerName}</strong></p>
                    </>
                )}
            </Container>
        </>
    )
}

const Container = styled.main`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 70%;
    margin: 30px auto;

    .carousel {
        .slick-prev, .slick-next {
            color: black
        }
        
        .slick-dots li button {
            background-color: black;
        }

        ul {
            li.slick-active {
                background-color: black;
            }
        }
    }
`;