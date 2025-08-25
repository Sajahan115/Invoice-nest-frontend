// Accordion.tsx
import React, { useState } from "react";
import Styles from "./Accordion.module.css";

const AccordionItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen((prev) => !prev);

  return (
    <div className={`${Styles.accordionItem} ${isOpen ? Styles.open : ""}`}>
      <button className={Styles.accordionHeader} onClick={toggleAccordion}>
        <p className={Styles.title}>{title}</p>
        <span className={`${Styles.arrow} ${isOpen ? Styles.rotate : ""}`}>
          &#9660;
        </span>
      </button>
      <div className={Styles.accordionContent}>
        <div className={Styles.accordionContentInner}>{children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
