'use client';

import Header from "@/components/ui/header/Header";
import styled from "styled-components";
import Input from "antd/es/input/Input";
import { Form, GetProp, InputNumber, Upload, UploadFile, UploadProps, Button } from "antd";
import ptBR from 'antd/locale/pt_BR';
import { useEffect, useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import { Image } from "antd";
import TextArea from "antd/es/input/TextArea";
import ProductClass from "@/utils/classes/Products/Products";
import { Products, UpdateProductsForm } from "@/types/Products/ProductsTypes";
import useNotification from "antd/es/notification/useNotification";
import { Skeleton } from "antd/lib";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export default function UpdateProduct({ id }: { id: number }) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const productClass = new ProductClass("");
    const [product, setProduct] = useState<Products>();
    const [api, contextHolder] = useNotification();

    // FORM
    const [form] = Form.useForm();
    const [count, setCount] = useState('');

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

    useEffect(() => {
        if (product) {
            try {
                form.setFieldsValue(product);

                setCount(product.description);

                if (product.imagesUrl && Array.isArray(product.imagesUrl)) {
                    const files = product.imagesUrl.map((url, index) => ({
                        uid: String(index),
                        name: `image-${index}.png`,
                        url
                    }));

                    form.setFieldsValue({ images: files });
                } else {
                    setFileList([]);
                }

            } catch (e) {
                console.error("Erro ao carregar campos: ", e);
            }
        }
    }, [form, product]);

    useEffect(() => {
        async function getProduct() {
            const search = await productClass.getOne(id)
            if (search.product) setProduct(search.product);
        }

        if (id) getProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const finish = async () => {
        try {
            await form.validateFields();

            const values: UpdateProductsForm = form.getFieldsValue(true)

            const fileList = values.images;

            console.log(fileList)

            const images: string[] = [];

            fileList.map((file) => {
                if (file.url) {
                    images.push(file.url);
                } else if (file.thumbUrl) {
                    images.push(file.thumbUrl);
                }
            })

            try {
                const res = await productClass.update({
                    product_id: product!.id,
                    name: values.name,
                    description: values.description,
                    imagesUrl: images,
                    stock: values.stock,
                    price: Number(values.price),
                })

                if (res.success) {
                    api.success({
                        message: 'Sucesso',
                        description: 'Produto atualizado com sucesso.',
                        duration: 5,
                        showProgress: true,
                    })
                } else {
                    api.error({
                        message: 'Error',
                        description: 'Não foi possível atualizar o produto.',
                        duration: 5,
                        showProgress: true,
                    })
                }
            } catch (error) {
                console.error(error);
            }

        } catch (error) {
            console.error("Erro ao enviar o formulário", (error as Error).message);
        }
    };

    return (
        <>
            {contextHolder}
            <Header />
            <Container>
                {product ? (
                    <Form form={form} layout="vertical" requiredMark={false}>
                    <Form.Item
                        label="Fotos"
                        name="images"
                        extra="Insira ou remova fotos do seu produto - Máximo de 4 fotos"
                        rules={[{ required: true, message: 'Insira ao menos 1 (uma) foto.' }]}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList || []}
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
                    <Form.Item
                        label="Título"
                        name="name"
                        extra="Título do seu produto"
                        rules={[
                            { required: true, type: 'string', message: 'O campo título é obrigatório.' },
                        ]}
                    >
                        <Input size="large" placeholder="Samsung Galaxy S24" />
                    </Form.Item>
                    <Form.Item
                        label="Descrição"
                        name="description"
                        extra={`Descrição do o seu produto - ${count.length}/500`}
                        rules={[{ required: true, message: 'A descrição é obrigatória.' },
                        { max: 500, message: 'Máximo de 500 caracteres atingido' },
                        { min: 50, message: 'Mínimo de 50 caracteres' },
                        ]}
                    >
                        <TextArea style={{ maxHeight: '200px' }} size="large" onChange={(e) => setCount(e.currentTarget.value)} value={count} placeholder="Bicicleta com apenas 5 meses de uso..." />
                    </Form.Item>
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
                    <Form.Item
                        label="Preço"
                        name="price"
                        extra="Preço do seu produto"
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
                    <Button type="primary" size="large" onClick={finish}>
                        Atualizar Produto
                    </Button>
                </Form>
                ) : (
                    <Skeleton loading style={{ width: '80%', maxWidth: '500px', margin: '100px' }} />
                )}
            </Container>
        </>
    )
}

const Container = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 30px;
`;