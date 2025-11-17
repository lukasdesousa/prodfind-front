import Header from "@/components/ui/header/Header";
import styled from "styled-components";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import UserProducts from "@/components/ui/products/UserProducts";
import LogOut from "@/components/ui/buttons/logout/Logout";

export default function UserHome() {
    const { name, email } = useAppSelector((state) => state.user);

    return (
        <>
            <Header />
            <Container>
                <UserInfo>
                    <Image 
                        src={"/images/user_image.png"}
                        alt="Imagem de usuário"
                        width={200}
                        height={200}
                        style={{ borderRadius: '50%', height: 'auto', width: '80vw', maxWidth: '100px', border: '2px solid black', paddingTop: '2px' }}
                    />
                <MainInfo>
                    <h1>{name}</h1>
                    <p>{email}</p>
                </MainInfo>
                </UserInfo>
                <ProductsSection>
                    <UserProducts />
                </ProductsSection>
                <LogOut />
            </Container>
        </>
    )
}

const Container = styled.main`
    margin: auto;
    width: 60%;
    @media (max-width: 768px) {
        width: 90%;
    }
`;

const UserInfo = styled.section`
    display: flex;
    margin-top: 50px;
    gap: 20px;
`;

const MainInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const ProductsSection = styled.section`
    margin-top: 50px;
    border-top: 1px solid #ccc;
`;