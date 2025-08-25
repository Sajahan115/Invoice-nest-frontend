import useAppContext from "../../context/useAppContext";
import Styles from "./Spinner.module.css";
const Spinner = () => {
  const { message, loading } = useAppContext();

  if (!loading) {
    return null;
  }
  return (
    <div className={Styles.spinnerContainer}>
      <div className={Styles.spinner}>
        <div className={Styles.loader}></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Spinner;
