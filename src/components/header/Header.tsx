'use client';

import styled from "styled-components"
import Link from "next/link"
import { UserOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import SearchComponent from "../search/Search";
import { MenuOutlined } from "@ant-design/icons";
import { useMediaQuery } from '@mui/material';
import { useEffect, useState } from "react";
import { Drawer } from 'antd';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 968px)');

  useEffect(() => {
    if (!isSmallScreen) {
      setOpen(false);
    }
  }, [isSmallScreen])

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Container>
        <h1><Link href={'/'}>ProdFind</Link></h1>
        <Menu>
          <SearchComponent />
          {pathname !== '/produtos/mapa' && (
            <MenuItem href={'/produtos/mapa'} className={isSmallScreen ? 'not-visible' : ''}>Mapa de produtos</MenuItem>
          )}
          <MenuItem href={'/vender'} className={isSmallScreen ? 'not-visible' : ''}>Vender</MenuItem>
          <MenuItem href={'/suporte'} className={isSmallScreen ? 'not-visible' : ''}>Suporte</MenuItem>
        </Menu>
        <Link href={'/login'}>
          <UserOutlined className={isSmallScreen ? 'not-visible' : ''} />
        </Link>
        <MenuOutlined className={isSmallScreen ? '' : 'not-visible'} onClick={() => showDrawer()} />
        <Drawer
          placement='bottom'
          width={500}
          closeIcon={false}
          height='auto'
          style={{ borderRadius: '30px 30px 0px 0px' }}
          onClose={onClose}
          open={open}
        >
          <Line />
          <DrawerMenuOpts>
            {pathname !== '/produtos/mapa' && (
              <MenuItem style={{ textDecoration: 'none', color: 'inherit' }} href={'/produtos/mapa'}><h1>Mapa de produtos</h1></MenuItem>
            )}
            <MenuItem style={{ textDecoration: 'none', color: 'inherit' }} href={'/sell'}><h1>Vender</h1></MenuItem>
            <MenuItem style={{ textDecoration: 'none', color: 'inherit' }} href={'/register'}><h1>Meus Anúncios</h1></MenuItem>
            <MenuItem style={{ textDecoration: 'none', color: 'inherit' }} href={'/suporte'}><h1>Contato</h1></MenuItem>
          </DrawerMenuOpts>
          <Line02 />
          <LtTitle>
            <p>©2025 ProdFind</p>
          </LtTitle>
        </Drawer>

      </Container>
    </>
  )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20px 0;

    @media screen and (max-width: 768px) {
        justify-content: space-between;
        margin: 20px;
    }

    .not-visible {
        display: none;
    }
`;

const Menu = styled.menu`
    display: flex;
    align-items: center;
    gap: 20px;
`;

export const MenuItem = styled(Link)`
    list-style: none;
    cursor: pointer;
`;

export const Line = styled.span`
  display: block;
  margin: auto;
  border: 2px solid #e6e6e6;
  border-radius: 10px;
  height: 7px;
  background-color: #e6e6e6;
  width: 50px;
`;

export const Line02 = styled.span`
  display: block;
  margin: 40px auto 0px auto;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  background-color: #e6e6e6;
  width: 100%;
`;

export const LtTitle = styled.section`
  text-align: center;

  p {
    margin-top: 20px;
    font-weight: bold;
    opacity: 0.7;
  }
`;

export const DrawerMenuOpts = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: start;
  gap: 30px;
  margin-top: 70px;
`;
