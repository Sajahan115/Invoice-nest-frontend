import { useEffect, useState } from "react";
import Container from "../Container/Container";
import Styles from "./SubHeader.module.css";
import { useNavigate } from "react-router-dom";

const SubHeader = () => {
  const [hide, setHide] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If user scrolls down, hide subheader
      if (currentScrollY > lastScrollY) {
        setHide(true);
      } else {
        setHide(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`${Styles.subHeader} ${hide ? Styles.hide : ""}`}>
      <Container mainContent={false}>
        <div className={Styles.subHeaderContent}>
          <p onClick={() => navigate("/add-user")}>Add Clients</p>
          <p>Download All</p>
          <p>Download Selected</p>
        </div>
      </Container>
    </div>
  );
};

export default SubHeader;
