import React from "react";

import { Button, Form, Grid, Input, theme, Typography } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import UserClass from "@/utils/classes/User/UserClass";
import useNotification from "antd/es/notification/useNotification";
import type { RegisterType } from "@/types/Form/FormTypes";
import Image from "next/image";
import Link from "next/link";
import useSetUserInfo from "@/utils/functions/UserFuncs";
import { useRouter } from "next/navigation";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

export default function SignUpPage() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const userClass = new UserClass();
  const [api, context] = useNotification();
  const userInfo = useSetUserInfo();
  const router = useRouter();

  const onFinish = async (values: RegisterType) => {
    const res = await userClass.create({
      name: values.name,
      email: values.email,
      password: values.password,
    })

    if (res.success) {
      api.success({
        message: "Usuário criado com sucesso!",
        description: "Retornando para a home...",
        duration: 5,
        showProgress: true,
      })

      userInfo({name: res.response.user.storeName, email: res.response.user.email, id: res.response.user.id, userProducts: []});
    
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

            <Title style={styles.title}>Cadastre-se</Title>
            <Text style={styles.text}>
              Junte-se a nós! Venda, troque e compre produtos próximos.
            </Text>
          </div>
          <Form
            name="normal_signup"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Insira um nome.",
                },
              ]}
            >
              <Input size="large" prefix={<UserOutlined />} placeholder="Nome" />
            </Form.Item>
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
              extra="A senha precisa ter no minimo 8 caracteres"
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
                Cadastrar
              </Button>
              <div style={styles.signup}>
                <Text style={styles.text}>Já tem uma conta?</Text>{" "}
                <Link href={'/entrar'}>Entrar</Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </section>
    </>
  );
}