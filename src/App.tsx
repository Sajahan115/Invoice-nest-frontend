import { ToastContainer } from "react-toastify";

import Spinner from "./components/Spinner/Spinner";
import { AppProvider } from "./context/AppContext";
import AppRoutes from "./routes/router";

function App() {
  return (
    <div>
      <AppProvider>
        <Spinner />
        <AppRoutes />
        <ToastContainer />
      </AppProvider>
    </div>
  );
}

export default App;
