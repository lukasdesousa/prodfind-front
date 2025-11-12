'use client';

import Header from "@/components/ui/header/Header"
import { Button } from "antd";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <Main>
        <Template>
          <TextArea>
            <h1>Faça negócios</h1>
            <p>Venda, compre ou troque produtos com pessoas que estão próximas a você!</p>
            <Link href="/produtos/mapa">
              <Button style={{fontWeight: 500}} type="primary" size="large">
                Negociar
              </Button>
            </Link>
          </TextArea>
          <Image 
          src={'/images/home.png'}
          alt="Image home"
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
  margin: 10% auto;

  @media screen and (max-width: 1200px) {
    flex-direction: column;
    width: 80%;
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