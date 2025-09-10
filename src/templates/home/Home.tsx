'use client';

import Header from "@/src/components/header/Header"
import { Button } from "antd";
import styled from "styled-components";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <Main>
        <Template>
          <TextArea>
            <h1>Faça negócios</h1>
            <p>Venda, compre ou troque produtos com pessoas que estão próximas a você!</p>
            <Button style={{fontWeight: 500}} type="primary" size="large">
              Negociar
            </Button>
          </TextArea>
          <Image 
          src={'/images/image.png'}
          alt="Image from home"
          width={400}
          height={400}
          />
        </Template>
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

`;

const Template = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media screen and (max-width: 1200px) {
    flex-direction: column;
    width: 80%;
    top: 60%;
  }

  img {
    @media screen and (max-width: 768px) {
      width: 80%;
    }
    max-width: 600px;
    height: auto;
    z-index: -1;
  }
`;

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  z-index: 1;

  p {
    max-width: 400px;
  }
`;