import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/store/hooks';
import { Products } from '@/types/Products/ProductsTypes';
import { Button, Card } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import Image from 'next/image';

export default function UserProducts() {
    const { userProducts } = useAppSelector((state) => state.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userProducts) {
            setLoading(false);
        }
    }, [userProducts])

    return (
        <>
            <Container>
                {userProducts && userProducts.length > 0 ? userProducts.map((product: Products, index: number) => (
                    <div key={index}>
                        <Card
                            loading={loading}
                            style={{ width: 300 }}
                            cover={
                                <Image
                                    draggable={true}
                                    width={200}
                                    height={200}
                                    style={{ width: '100%', height: 'auto' }}
                                    alt="Imagem capa do anúncio"
                                    src={product.imagesUrl[0]}
                                    quality={100}
                                />
                            }
                            actions={[
                                <SettingOutlined key="setting" />,
                                <EditOutlined key="edit" />,
                                <EllipsisOutlined key="ellipsis" />,
                            ]}
                        >
                            <Meta
                                title={product.name}
                                description={product.description}
                            />
                        </Card>
                    </div>
                )) : (
                    <SubContainer>
                        <h2>Você ainda não anunciou produtos.</h2>
                        <Button type='primary' size='large'>Anunciar</Button>
                    </SubContainer>
                )}
            </Container>
        </>
    )
}

const Container = styled.section`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: auto;
    padding: 50px 0px;

    h2 {
        font-size: 1.3rem;
        text-align: center;
    }
`;

const SubContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
`;