import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAppContext from "../context/useAppContext";
import { useEffect, useMemo, useState } from "react";
import { checkIfAdmin, getTokenPayload } from "../utils/common";

const isTokenValid = (exp?: number): boolean => {
  const currentTime = Date.now() / 1000;
  return exp ? exp > currentTime : false;
};

const PrivateRoute = () => {
  const { setUserDetails } = useAppContext();
  const location = useLocation();

  const [checkingToken, setCheckingToken] = useState(true);

  const token = sessionStorage.getItem("token");

  const payload = useMemo(
    () => (token ? getTokenPayload(token) : null),
    [token]
  );

  useEffect(() => {
    if (payload && isTokenValid(payload.exp)) {
      setUserDetails({
        id: payload.id,
        role: payload.role,
        username: payload.username,
      });
      setCheckingToken(false);
    } else {
      setCheckingToken(false);
    }
  }, [payload, setUserDetails]);

  if (checkingToken) return null;
  if (!token || !payload) return <Navigate to="/" replace />;

  const userId = payload.id;
  const currentPath = location.pathname;

  const allowedPaths = [
    `/users/${userId}`,
    "/profile",
    "/users/invoice/print-preview",
  ];

  if (!checkIfAdmin(payload) && !allowedPaths.includes(currentPath)) {
    return <Navigate to={`/users/${userId}`} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
