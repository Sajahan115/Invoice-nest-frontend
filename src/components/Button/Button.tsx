import Styles from "./Button.module.css";

interface ButtonProps {
  title: string;
  variant?: "Primary" | "Secondary" | "Danger" | "Success";
  type?: "button" | "submit";
  onClick?: () => void;
}

const Button = ({
  title,
  variant = "Primary",
  type = "button",
  onClick = () => {},
}: ButtonProps) => {
  const classNameHandler = () => {
    if (variant === "Primary") return Styles.primaryButton;
    else if (variant === "Secondary") return Styles.secondaryButton;
    else if (variant === "Success") return Styles.successButton;
    return Styles.dangerButton;
  };
  return (
    <button
      type={type}
      className={`${Styles.custButton} ${classNameHandler()}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
