import React from 'react';
import Image from 'next/image';
import { Modal } from '@mui/material';


interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
  }

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, email }) => {
  const handleBackdropClick = (event: { target: any; currentTarget: any; }) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Modal 
      open={isOpen} 
      onClose={onClose}
      aria-labelledby="success-modal"
      BackdropProps={{
        onClick: handleBackdropClick
      }}
    >
      <div 
        className="fixed inset-0 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        <div 
          className="relative flex flex-col bg-white py-8 px-6 rounded-lg items-center justify-center shadow-lg w-96 mx-4"
          onClick={(e) => e.stopPropagation()} // Prevent clicks on the content from closing the modal
        >
          <div>
            <Image
              src="/successImage.png"
              alt="Success"
              width={350}
              height={200}
              className="w-full mb-4"
            />
          </div>
          <h3 className="text-xl font-semibold mb-4">
            Thank you for registering!
          </h3>
          <p className="text-center text-base px-4">
            A confirmation email has been sent to {email || 'your email address'}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;