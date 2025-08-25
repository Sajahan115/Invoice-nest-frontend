import Select from "react-select";
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

import Styles from "./Input.module.css";

interface InputProps {
  name: string;
  type?: "text" | "password" | "textArea" | "select" | "date" | "number";
  placeholder: string;
  label: string;
  step?: string;
  textAreaWidth?: string;
  isInputDisabled?: boolean;
  className?: string;
  options?: { value: string; label: string }[];
  control?: Control<any>;
  rules?: RegisterOptions;
  register?: UseFormRegister<any>;
  value?:
    | string
    | number
    | { value: string; label: string }
    | null
    | readonly string[];
  onChange?: (value: any) => void;
  error?:
    | FieldError
    | Merge<
        FieldError,
        FieldErrorsImpl<{
          value: string;
          label: string;
        }>
      >;
}
const Input = ({
  name,
  textAreaWidth = "auto",
  type = "text",
  placeholder,
  label,
  step = undefined,
  className = "",
  options = [],
  control,
  rules,
  register,
  error,
  isInputDisabled = false,
  value,
  onChange,
}: InputProps) => {
  const currentDate = new Date().toISOString().split("T")[0];

  const Render = () => {
    if (type === "textArea") {
      if (control) {
        return (
          <Controller
            disabled={isInputDisabled}
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder={placeholder}
                id={name}
                style={{
                  minHeight: "4rem",
                  fontFamily: "nunito",
                  fontSize: "1rem",
                  width: textAreaWidth,
                }}
              />
            )}
          />
        );
      } else {
        return (
          <textarea
            id={name}
            placeholder={placeholder}
            value={
              typeof value === "string" || typeof value === "number"
                ? value
                : ""
            }
            onChange={(e) => onChange?.(e.target.value)}
            disabled={isInputDisabled}
            style={{
              minHeight: "4rem",
              fontFamily: "nunito",
              fontSize: "1rem",
              width: textAreaWidth,
            }}
          />
        );
      }
    }

    if (type === "select") {
      if (control) {
        return (
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
              <Select
                {...field}
                options={options}
                inputId={name}
                maxMenuHeight={150}
                isClearable
                placeholder={placeholder}
                className={Styles.custSelect}
                isDisabled={isInputDisabled}
                menuPosition="fixed"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            )}
          />
        );
      } else {
        return (
          <Select
            value={
              typeof value === "object" && value !== null && "value" in value
                ? options?.find((opt) => opt.value === value.value)
                : null
            }
            onChange={(selected) => onChange?.(selected)}
            options={options}
            inputId={name}
            maxMenuHeight={150}
            isClearable
            placeholder={placeholder}
            className={Styles.custSelect}
            isDisabled={isInputDisabled}
            menuPosition="fixed"
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />
        );
      }
    }

    // Input (text, password, number, date)
    return (
      <input
        disabled={isInputDisabled}
        type={type}
        placeholder={placeholder}
        id={name}
        max={type === "date" ? currentDate : undefined}
        onWheel={(e) => {
          if (type === "number") {
            e.currentTarget.blur();
          }
        }}
        step={type === "number" && Number(step) ? step : undefined}
        {...(register ? register(name, rules) : {})}
        value={
          register
            ? undefined
            : typeof value === "string" ||
              typeof value === "number" ||
              Array.isArray(value)
            ? value
            : "" // fallback if value is an object (e.g. react-select option)
        }
        onChange={register ? undefined : (e) => onChange?.(e.target.value)}
      />
    );
  };

  return (
    <div
      className={`${Styles.inputContainer} ${Styles[className]} ${
        isInputDisabled && Styles.disabledDiv
      }`}
    >
      <label
        htmlFor={name}
        className={isInputDisabled ? Styles.disabledLabel : ""}
      >
        {label}
      </label>
      <Render />
      {error && <p className={Styles.error}>{error.message}</p>}
    </div>
  );
};

export default Input;
