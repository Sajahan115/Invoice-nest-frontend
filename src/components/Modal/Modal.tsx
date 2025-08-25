import React from "react";
import Styles from "./Modal.module.css"; // Import CSS Module
// import Button from "../Button/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className={Styles.overlay}>
      <div className={Styles.modal}>
        <button className={Styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {title && <h2 className={Styles.title}>{title}</h2>}
        <div className={Styles.content}>{children}</div>
        {/* <div className={Styles.modalFooter}>{footer()}</div> */}
      </div>
    </div>
  );
};

export default Modal;
