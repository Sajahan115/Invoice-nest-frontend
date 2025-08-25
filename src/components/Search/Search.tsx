import Styles from "./Search.module.css";

interface SearchProps {
  value: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search = ({ value, onChange, placeholder }: SearchProps) => {
  return (
    <input
      type="search"
      placeholder={placeholder || "Search..."}
      className={Styles.search}
      value={value}
      onChange={onChange}
    />
  );
};

export default Search;
