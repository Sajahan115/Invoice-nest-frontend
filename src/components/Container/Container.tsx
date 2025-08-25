import Styles from "./Container.module.css";
interface ContainerProps {
  children: React.ReactNode;
  mainContent?: boolean;
}
const Container = ({ children, mainContent = true }: ContainerProps) => {
  const renderContent = () => {
    if (mainContent) {
      return (
        <div className={Styles.container}>
          <div className={Styles.mainContent}>{children}</div>
        </div>
      );
    }
    return <div className={Styles.container}>{children}</div>;
  };
  return renderContent();
};

export default Container;
