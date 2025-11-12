import React from "react";
import { Button, Form, Grid, Input, theme, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import UserClass from "@/utils/classes/User/UserClass";
import useNotification from "antd/es/notification/useNotification";
import type { LoginType } from "@/types/Form/FormTypes";
import Link from "next/link";
import Image from "next/image";
import useSetUserData from "@/utils/functions/UserFuncs";
import { useRouter } from "next/navigation";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

export default function SignInPage() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const userClass = new UserClass();
  const [api, context] = useNotification();
  const userInfo = useSetUserData();
  const router = useRouter();

  const onFinish = async (values: LoginType) => {
    const res = await userClass.login({
      email: values.email,
      password: values.password,
    })

    if (res.success) {
      api.success({
        message: "Sucesso!",
        description: "Redirecionando você...",
        duration: 5,
        showProgress: true,
      })

      console.log(res.userInfo.data)

       userInfo({name: res.userInfo.data.name, email: res.userInfo.data.email, id: res.userInfo.data.id, userProducts: res.userInfo.data.user_products});

       setTimeout(() => {
         router.push('/')
       }, 2000);
    }
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md ? `${token.paddingXL}px` : `${token.paddingXL}px ${token.padding}px`,
      width: "380px"
    },
    forgotPassword: {
      float: "right"
    },
    header: {
      marginBottom: token.marginXL,
      textAlign: "center" as const
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
    },
    signup: {
      marginTop: token.marginLG,
      textAlign: "center" as const,
      width: "100%"
    },
    text: {
      color: token.colorTextSecondary
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3
    }
  };

  return (
    <>
      {context}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.header}>
            <Image
              src={'/images/prodfind_icon.png'}
              alt="Prodfind Icon"
              width={80}
              height={300}
              quality={100}
              style={{ height: 'auto' }}
            />

            <Title style={styles.title}>Entre</Title>
            <Text style={styles.text}>
              Entre em sua conta para conversar com vendedores ou anúnciar um produto.
            </Text>
          </div>
          <Form
            name="normal_signin"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Insira um endereço de e-mail válido.",
                },
              ]}
            >
              <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Insira uma senha.",
                },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                type="password"
                placeholder="Senha"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button size="large" block type="primary" htmlType="submit">
                Entrar
              </Button>
              <div style={styles.signup}>
                <Text style={styles.text}>Ainda não tem uma conta?</Text>{" "}
                <Link href={'/cadastro'}>Cadastre-se</Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </section>
    </>
  );
}