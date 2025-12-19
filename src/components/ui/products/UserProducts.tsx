import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProductClass from '@/utils/classes/Products/Products';
import { useAppSelector } from '@/store/hooks';
import { Products } from '@/types/Products/ProductsTypes';
import { Button, Card, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import Image from 'next/image';
import Link from 'next/link';
import { Modal } from 'antd';

export default function UserProducts() {
    const { userProducts } = useAppSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [modal, contextHolder] = Modal.useModal();
    const product = new ProductClass("");

    const confirm = (id: number) => {
        modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Deseja excluir este anúncio?',
            okText: 'Excluir',
            cancelText: 'Cancelar',
            async onOk() {
                await product.delete(id);
                window.location.reload();
            },
        });
    };

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 2; // Quantos produtos por página

    useEffect(() => {
        if (userProducts) {
            setLoading(false);
        }
    }, [userProducts]);

    // Cálculo dos produtos da página atual
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = userProducts?.slice(startIndex, endIndex) || [];

    return (
        <Container>
            <h2>Seus anúncios</h2>
            {userProducts && userProducts.length > 0 ? (
                <>
                    <ProductsContainer>
                        {paginatedProducts.map((product: Products, index: number) => (
                            <Card
                                key={index}
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
                                    <DeleteOutlined onClick={() => confirm(product.id)} style={{ color: 'red' }} key="delete" />,
                                    <Link key={index} href={`/produtos/atualizar/${product.id}`}><EditOutlined key="edit" /></Link>,
                                ]}
                            >
                                <Meta title={product.name} description={product.description} />
                            </Card>
                        ))}

                        {contextHolder}
                    </ProductsContainer>

                    <PaginationContainer>
                        <Pagination
                            current={currentPage}
                            total={userProducts.length}
                            pageSize={pageSize}
                            onChange={(page) => setCurrentPage(page)}
                        />
                    </PaginationContainer>
                </>
            ) : (
                <SubContainer>
                    <h2>Você ainda não anunciou produtos.</h2>
                    <Button type='primary' size='large'>Anunciar</Button>
                </SubContainer>
            )}
        </Container>
    );
}

const Container = styled.section`
    margin: auto;
    padding: 50px 0;

    h2 {
        text-align: center;
        margin-bottom: 50px;
    }
`;

const ProductsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

const SubContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
`;
