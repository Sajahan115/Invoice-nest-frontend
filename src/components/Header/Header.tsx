import Styles from "./Header.module.css";
import Logo from "../../assets/Logo.png";
import Container from "../Container/Container";
import { FaUserCircle } from "react-icons/fa";
import useAppContext from "../../context/useAppContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import api from "../../utils/axios";
// import { useTheme } from "../../utils/useTheme";
// import { MdDarkMode, MdLightMode } from "react-icons/md";

const Header = () => {
  const { userDetails } = useAppContext();
  // const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout API failed:", error);
    }

    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className={Styles.header}>
      <Container mainContent={false}>
        <div className={Styles.content}>
          <Link to="/users">
            <img src={Logo} alt="invoice-nest-logo" />
          </Link>
          <div className={Styles.userContainer}>
            {/* <div onClick={toggleTheme} className={Styles.themeToggle}>
              {theme === "dark" ? (
                <MdLightMode size={22} />
              ) : (
                <MdDarkMode size={22} />
              )}
            </div> */}
            <Link className={Styles.user} to="/profile">
              <FaUserCircle className={Styles.userIcon} />
              <p>
                {userDetails?.role === "admin"
                  ? "Admin"
                  : userDetails?.username}
              </p>
            </Link>
            <Button title="Logout" onClick={logOut} variant="Danger" />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
