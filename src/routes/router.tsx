import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "../Layout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import PrivateRoute from "./PrivateRoute";
import Users from "../pages/Users/Users";
import Profile from "../pages/Profile/Profile";
import UserDetails from "../pages/UserDetails/UserDetails";
import PrintPreview from "../pages/PrintPreview/PrintPreview";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route index element={<Login />} />
        <Route path="/" element={<Layout />}>
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-user" element={<Register />} />
            <Route path="/users/:userId" element={<UserDetails />} />
            <Route
              path="/users/invoice/print-preview"
              element={<PrintPreview />}
            />
          </Route>

          {/* Catch-All */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
