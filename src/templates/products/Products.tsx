'use client';

import Header, { Line, Line02, LtTitle, MenuItem } from "@/src/components/header/Header";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { Col, Drawer, InputNumber, InputNumberProps, Row, Slider } from 'antd';
import { useState } from "react";

const Map = dynamic(() => import("./map/Map"), {
    ssr: false,
});

export default function Products() {
    const [full, setFull] = useState(false);

    const [inputValue, setInputValue] = useState(1);

    const onChange: InputNumberProps['onChange'] = (newValue) => {
        setInputValue(newValue as number);
    };

    return (
        <>
            <Header />
            <Container>
                <Map range={inputValue} />
                <Drawer
                    placement='bottom'
                    width={500}
                    closeIcon={false}
                    onClose={() => setFull(false)}
                    mask={full ? true : false}
                    height={full ? 'auto' : 50}
                    onClick={() => setFull(true)}
                    open={true}
                    style={{ transition: '1s' }}
                >
                    <Line />
                    <DrawerContent>
                        <h1 style={{ fontWeight: '600', textAlign: 'center' }}>Mostrar produtos em um raio de {inputValue}km</h1>
                        <Row style={{margin: 'auto'}}>
                            <Col span={12}>
                                <Slider
                                    min={1}
                                    max={20}
                                    onChange={onChange}
                                    value={typeof inputValue === 'number' ? inputValue : 0}
                                />
                            </Col>
                            <Col span={4}>
                                <InputNumber
                                    min={1}
                                    max={20}
                                    style={{ margin: '0 16px' }}
                                    value={inputValue}
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