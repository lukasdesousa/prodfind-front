import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { LogoutOutlined } from "@ant-design/icons";
import { logoutAction } from '@/utils/functions/Logout';
import { useRouter } from 'next/navigation';

const LogOut: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    logoutAction();
    router.push('/')
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button style={{marginBottom: '60px'}} type="primary" onClick={showModal}>
        Sair <LogoutOutlined />
      </Button>
      <Modal
        title="Sair"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        okText="Sim, sair."
        cancelText="Cancelar"
        onCancel={handleCancel}
      >
        <p>Tem certeza que deseja sair de sua conta?</p>
      </Modal>
    </>
  );
};

export default LogOut;