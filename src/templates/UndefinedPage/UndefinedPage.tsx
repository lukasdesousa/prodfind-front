import Header from "@/components/ui/header/Header";
import styled from "styled-components";
import { Button } from "antd";
import Link from "next/link";

export default function UndefinedPage() {
    return (
        <>
            <Header />
            <Container>
                <h1>Esta página encontra-se em construção</h1>
                <Link href={'/produtos/mapa'}><Button type='primary' size='large'>Ir ao marketplace</Button></Link>
            </Container>
        </>
    )
}

const Container = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
    margin: auto;
    width: 80%;
    gap: 30px;
    text-align: center;

    h1 {
        font-size: 1.3rem;
    }
`;