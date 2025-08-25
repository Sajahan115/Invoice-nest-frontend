import { Link, useNavigate } from "react-router-dom";
import Styles from "./BreadCrumb.module.css";
import { IoArrowBackCircleOutline } from "react-icons/io5";
interface itemsType {
  label: string;
  href?: string;
}
const BreadCrumb = ({ items }: { items: itemsType[] }) => {
  const navigate = useNavigate();
  return (
    <div className={Styles.breadcrumb}>
      <IoArrowBackCircleOutline
        className={Styles.backArrow}
        onClick={() => navigate("/users")}
      />
      <div className={Styles.pathContainer}>
        {items.map((item) => {
          return (
            <span key={item.label}>
              {item.href ? (
                <div>
                  <Link to={item.href}>
                    <h3>{item.label}</h3>
                  </Link>
                  <p className={Styles.separator}>/</p>
                </div>
              ) : (
                <h3>{item.label}</h3>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default BreadCrumb;
