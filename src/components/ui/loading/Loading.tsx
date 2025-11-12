'use client';

import { CircularProgress } from "@mui/material";
import styled from "styled-components";

export default function Loading() {
    return (
        <>
            <Container>
                <h3>Estou obtendo os produtos próximos de você</h3>
                <CircularProgress />
            </Container>
        </>
    )
}

const Container = styled.section`
    z-index: 100000;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.208);
`;