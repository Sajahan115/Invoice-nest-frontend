import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import SubHeader from "./components/SubHeader/SubHeader";
import { checkIfAdmin, getTokenPayload } from "./utils/common";

const Layout = () => {
  const dataFromToken = getTokenPayload(sessionStorage.getItem("token"));
  return (
    <main>
      <Header />
      {checkIfAdmin(dataFromToken) && <SubHeader />}
      <Outlet />
    </main>
  );
};

export default Layout;
