'use client';

import Header, { Line, Line02, LtTitle } from "@/components/ui/header/Header";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { Col, Drawer, InputNumber, InputNumberProps, Row, Slider } from 'antd';
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import ProductClass from "@/utils/classes/Products/Products";
import { useDispatch } from "react-redux";
import { setProductsNearBy } from "@/store/slices/userSlice";
import Loading from "@/components/ui/loading/Loading";
import { useUserLocation } from '@/utils/functions/Location';
import useNotification from "antd/es/notification/useNotification";

const Map = dynamic(() => import("./map/TestModeMap"), {
    ssr: false,
});

export default function Products() {
    const [full, setFull] = useState(false);
    const [radium_km, setRadiumKm] = useState(1);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = useNotification();
    const [searched, setSearched] = useState(false);
    const { latitude, longitude } = useAppSelector((state) => state.user);
    const dispatch = useDispatch();
    const productsClass = new ProductClass("");

    const onChange: InputNumberProps['onChange'] = (newValue) => {
        setRadiumKm(newValue as number);
    };

    useUserLocation();

    useEffect(() => {
        localStorage.setItem('radium_km', String(radium_km))

        const search = async () => {
            const productsNearBy = await productsClass.get_products(latitude!, longitude!, radium_km!);
            dispatch(setProductsNearBy(productsNearBy))
            setSearched(true);
            setLoading(false);
        }

        if (latitude && longitude && radium_km && !searched) {
            search();
        } else if (!latitude || !longitude || !radium_km) {
            api.warning({
                message: 'Algo deu errado ao obter sua localização',
                description: 'Por favor, verifique se você permitiu o acesso à sua localização e recarregue a página.',
                duration: 5,
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [radium_km, latitude, longitude])

return (
    <>
        {contextHolder}
        {loading && <Loading />}
        <Header />
        <Container>
            <Map range={radium_km} />
            <Drawer
                placement='bottom'
                width={500}
                closeIcon={false}
                onClose={() => setFull(false)}
                mask={full ? true : false}
                height={full ? 'auto' : 50}
                onClick={() => setFull(true)}
                open
                style={{ transition: '1s' }}
            >
                <Line />
                <DrawerContent>
                    <h1 style={{ fontWeight: '600', textAlign: 'center' }}>Mostrando produtos em um raio de {radium_km}km</h1>
                    <Row style={{ margin: 'auto' }}>
                        <Col span={12}>
                            <Slider
                                min={1}
                                max={20}
                                onChange={onChange}
                                value={typeof radium_km === 'number' ? radium_km : 0}
                            />
                        </Col>
                        <Col span={4}>
                            <InputNumber
                                min={1}
                                max={20}
                                style={{ margin: '0 16px' }}
                                value={radium_km}
                                onChange={onChange}
                            />
                        </Col>
                    </Row>
                </DrawerContent>
                <Line02 />
                <LtTitle>
                    <p>©2025 ProdFind</p>
                </LtTitle>
            </Drawer>
        </Container>
    </>
)
}

const Container = styled.section`
    width: 100%;
    height: 100dvh;
    margin: 0 auto;
    overflow: hidden;
    border: none;
`;

const DrawerContent = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;

    gap: 20px;
    margin: 80px auto;
`;