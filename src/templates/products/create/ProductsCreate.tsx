'use client';

import React, { useEffect, useState } from 'react';
import ProductClass from '@/utils/classes/Products/Products';
import { Button, Form, GetProp, Input, Select, Steps, theme, Upload, Image, UploadFile, UploadProps, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SelectLocationMap from './location/LocationSelect';
import Header from '@/components/ui/header/Header';
import styled from 'styled-components';
import TextArea from 'antd/es/input/TextArea';
import ptBR from 'antd/locale/pt_BR';
import { useAppSelector } from '@/store/hooks';
import { CreateProductsForm } from '@/types/Products/ProductsTypes';
import useNotification from 'antd/es/notification/useNotification';
import { useUserLocation } from '@/utils/functions/Location';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export default function ProductsCreate() {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [count, setCount] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [api, context] = useNotification();
    const { id } = useAppSelector((state) => state.user);

    useUserLocation();

    const { latitude, longitude } = useSelector(
        (state: RootState) => state.location
    );

    useEffect(() => {
        console.log(latitude, longitude)
    }, [latitude, longitude])

    const productClass = new ProductClass(id as string);

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChangeImage: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const steps = [
        {
            title: '1º',
            fields: ['name'],
            content: (
                <Form.Item
                    label="Título"
                    name="name"
                    extra="Insira um título para seu produto"
                    rules={[
                        { required: true, type: 'string', message: 'O campo título é obrigatório.' },
                    ]}
                >
                    <Input size="large" placeholder="Samsung Galaxy S24" />
                </Form.Item>
            ),
        },
        {
            title: '2º',
            fields: ['images'],
            content: (
                <>
                    <Form.Item
                        label="Fotos"
                        name="images"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (!e) return [];
                            if (Array.isArray(e)) return e;
                            return e.fileList ?? [];
                        }}
                        extra="Insira fotos do seu produto - Máximo de 4 fotos"
                        rules={[{ required: true, message: 'Insira ao menos 1 (uma) foto.' }]}
                    >
                        <Upload
                            locale={ptBR.Upload}
                            accept="image/*"
                            multiple
                            maxCount={4}
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChangeImage}
                        >
                            {fileList.length >= 4 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    {previewImage && (
                        <Image
                            alt='Image preview'
                            wrapperStyle={{ display: 'none' }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                </>
            ),
        },
        {
            title: '3º',
            fields: ['description'],
            content: (
                <Form.Item
                    label="Descrição"
                    name="description"
                    extra={`Insira uma descrição para o seu produto - ${count.length}/500`}
                    rules={[{ required: true, message: 'A descrição é obrigatória.' },
                    { max: 500, message: 'Máximo de 500 caracteres atingido' },
                    { min: 50, message: 'Mínimo de 50 caracteres' },
                    ]}
                >
                    <TextArea style={{ maxHeight: '200px' }} size="large" onChange={(e) => setCount(e.currentTarget.value)} value={count} placeholder="Bicicleta com apenas 5 meses de uso..." />
                </Form.Item>
            ),
        },
        {
            title: '4º',
            fields: ['stock'],
            content: (
                <Form.Item
                    label="Estoque"
                    name="stock"
                    extra="Insira a quantidade disponível do produto"
                    rules={[{ required: true, message: 'É necessário ao menos 1 unidade.' },
                    ]}
                >
                    <InputNumber
                        min={1}
                        size="large"
                        placeholder="Insira um valor"
                        style={{ width: "100%" }}
                    />
                </Form.Item>
            ),
        },
        {
            title: '5º',
            fields: ['location'],
            content: (
                <Form.Item
                style={{width: '80vw', maxWidth: '400px'}}
                    label="Localização"
                    name="location"
                    extra="Selecione a localização do produto no mapa"
                >
                    <SelectLocationMap />
                </Form.Item>
            ),
        },
        {
            title: '6º',
            fields: ['price'],
            content: (
                <Form.Item
                    label="Preço"
                    name="price"
                    extra="Insira o preço do produto"
                    rules={[{ required: true, message: 'O preço minimo é R$1,00' },
                    ]}
                >
                    <InputNumber
                        min={String(1)}
                        step={1}
                        style={{ width: "100%" }}
                        size="large"
                        stringMode
                        placeholder="0,00"
                        prefix="R$ "
                        formatter={(value) => {
                            if (!value) return "0,00";
                            return new Intl.NumberFormat("pt-BR", {
                                style: "decimal",
                                currency: "BRL",
                                minimumIntegerDigits: 1,
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            }).format(Number(value));
                        }}
                        parser={(value) => {
                            if (!value) return "";
                            let numeric = value.replace(/[\s.]/g, "").replace(",", ".");
                            numeric = numeric.replace(/^0+(?=\d)/, "");
                            return numeric;
                        }}
                    />
                </Form.Item>
            ),
        },
        {
            title: '7º',
            fields: ['preferences'],
            content: (
                <Form.Item
                    label="Escolha a preferência do anúncio"
                    name="preferences"
                    extra={'Escolha se você quer vender, trocar ou ambos.'}
                    rules={[
                        { required: true, message: 'Escolha a sua preferência.' },
                    ]}
                >
                    <Select
                        size='large'
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        options={[
                            { value: 1, label: 'Somente venda' },
                            { value: 2, label: 'Somente troca' },
                            { value: 3, label: 'Venda e troca' },
                        ]}
                    />
                </Form.Item>
            ),
        },
    ];

    useEffect(() => {
        const savedData = localStorage.getItem("formData");
        const current = localStorage.getItem("currentStep");

        if (savedData && current) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.description) setCount(parsed.description);
                form.setFieldsValue(parsed);

                if (parsed.images.fileList) {
                    setFileList(parsed.images.fileList);
                } else {
                    setFileList(parsed.images);
                }

                setCurrent(Number(current));
            } catch (e) {
                console.error("Erro ao carregar campos já preenchidos:", e);
            }
        }
    }, [form]);

    const next = async () => {
        try {
            await form.validateFields(steps[current].fields);

            localStorage.setItem("formData", JSON.stringify(form.getFieldsValue(true)));
            localStorage.setItem("currentStep", String(current + 1));

            setCurrent(current + 1);
        } catch {
            // 
        }
    };

    const prev = () => setCurrent(current - 1);

    const finish = async () => {
        try {
            await form.validateFields();

            const values: CreateProductsForm = form.getFieldsValue(true)

            const fileList = values.images;

            const base64Images: string[] = [];

            if(fileList) {
                fileList.map((file) => {
                    if (file.thumbUrl) base64Images.push(file.thumbUrl)
                })
            }

            const product_lat = localStorage.getItem("product_lat");
            const product_lon = localStorage.getItem("product_lon");

            if (!product_lat || !product_lon) {
                return api.error({
                    message: 'Erro',
                    description: 'É necessário selecionar a localização do produto no mapa.',
                    duration: 5,
                    showProgress: true,
                })
            }

            try {
                const res = await productClass.create_product({
                    name: values.name,
                    description: values.description,
                    base64Images: base64Images,
                    stock: values.stock,
                    price: Number(values.price),
                    preferences: values.preferences,
                    latitude: Number(product_lat),
                    longitude: Number(product_lon),
                })

                if (res.success) {
                    api.success({
                        message: 'Sucesso',
                        description: 'Produto criado com sucesso.',
                        duration: 5,
                        showProgress: true,
                    })
                    localStorage.removeItem("formData");
                    localStorage.removeItem("currentStep");
                    localStorage.removeItem("product_lat");
                    localStorage.removeItem("product_lon");
                    form.resetFields();
                    setFileList([]);
                    setCurrent(0);
                }
            } catch (error) {
                console.error(error);
            }

        } catch (error) {
            console.error("Erro ao enviar o formulário", (error as Error).message);
        }
    };

    const items = steps.map((s) => ({ key: s.title, title: s.title }));

    return (
        <>
            {context}
            <Header />
            <FormContainer>
                <Form form={form} layout="vertical" requiredMark={false}>
                    <Steps current={current} items={items} type='inline' progressDot direction='horizontal' />
                    <div
                        className='steps-content'
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            lineHeight: '260px',
                            textAlign: 'center',
                            borderRadius: token.borderRadiusLG,
                            border: `1px dashed ${token.colorBorder}`,
                            marginTop: 16,
                            padding: 40,
                        }}
                    >
                        {steps[current].content}
                    </div>
                    <div style={{ marginTop: 24 }}>
                        {current < steps.length - 1 && (
                            <Button size='large' type="primary" onClick={next}>
                                Próximo
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button size='large' type="primary" onClick={finish}>
                                Criar
                            </Button>
                        )}
                        {current > 0 && (
                            <Button size='large' style={{ margin: '0 8px' }} onClick={prev}>
                                Anterior
                            </Button>
                        )}
                    </div>
                </Form>
            </FormContainer>
        </>
    );
}

const FormContainer = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 50px auto;
    width: 100%;
    
    form {
        width: 90vw;
        max-width: 600px;

        .steps-content {
            box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        }

        & input {
            margin: 15px 0px;
            width: 80vw;
            max-width: 500px;
        }
    }

    .ant-steps {
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: row !important;
    }
`;
