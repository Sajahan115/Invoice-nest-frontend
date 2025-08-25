import { useEffect } from "react";
import Styles from "./User.module.css";
import { useForm } from "react-hook-form";
import useAppContext from "../../context/useAppContext";
import { banks, stateCodes } from "../../data/Data";
import { showToast } from "../../utils/common";
import api from "../../utils/axios";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { UserProfileType } from "../../utils/interfaces";

type EditFormValues = {
  name: string;
  email: string;
  contact: string;
  address: string;
  state: { value: string; label: string } | null;
  gstNo: string;
  bankName: { value: string; label: string } | null;
  accountNumber: string;
  ifsc: string;
};

type EditUserInputField = {
  name: keyof EditFormValues;
  label: string;
  placeholder: string;
  type?: "text" | "password" | "select" | "textArea";
  className?: string;
  textAreaWidth?: string;
  rules?: any;
  options?: { label: string; value: string }[];
};

type UserProps = {
  userId: number;
  isEditing: boolean;
  editHandler: () => void;
  profileDetails: UserProfileType | null;
  setProfileDetails: React.Dispatch<React.SetStateAction<UserProfileType>>;
  isAdmin: boolean;
};
const User = ({
  userId,
  isEditing,
  editHandler,
  profileDetails,
  setProfileDetails,
  isAdmin,
}: UserProps) => {
  const { handleLoading } = useAppContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EditFormValues>({
    defaultValues: {
      name: "",
      contact: "",
      address: "",
      state: null,
      gstNo: "",
      bankName: null,
      accountNumber: "",
      ifsc: "",
    },
  });

  const editUserFormFields: EditUserInputField[] = [
    {
      name: "name",
      label: "Company Name",
      placeholder: "Enter Company Name..",
      rules: { required: "Fill Name" },
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter Email..",
      rules: {
        required: "Fill Email",
        maxLength: {
          value: 100,
          message: "Email must be less than 100 characters",
        },
        pattern: {
          value:
            /^(?!.*\.\.)[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
          message: "Invalid email format",
        },
      },
    },
    {
      name: "contact",
      label: "Contact",
      placeholder: "Enter Contact..",
      rules: {
        required: "Fill Contact",
        maxLength: { value: 10, message: "Contact must be 10 digits" },
        minLength: { value: 10, message: "Contact must be 10 digits" },
      },
    },
    {
      name: "address",
      label: "Address",
      placeholder: "Enter Address..",
      type: "textArea",
      className: "fullWidth",
      textAreaWidth: "100%",
      rules: { required: "Fill Address" },
    },
    {
      name: "state",
      label: "State",
      placeholder: "Select State..",
      type: "select",
      options: stateCodes,
      rules: { required: "Select State" },
    },
    {
      name: "gstNo",
      label: "GST No.",
      placeholder: "Enter GST No..",
      rules: { required: "Fill GSTIN" },
    },
    {
      name: "accountNumber",
      label: "Account No.",
      placeholder: "Enter Account Number..",
      rules: { required: "Fill Account Number" },
    },
    {
      name: "ifsc",
      label: "IFSC Code",
      placeholder: "Enter IFSC Code..",
      rules: { required: "Fill IFSC Code" },
    },
    {
      name: "bankName",
      label: "Bank Name",
      placeholder: "Select Bank..",
      type: "select",
      options: banks,
      className: "fullWidth",
      rules: { required: "Select Bank" },
    },
  ];

  const resetEditForm = (data) => {
    reset({
      name: data?.name || "",
      email: data?.email || "",
      contact: data?.contact || "",
      address: data?.address || "",
      state: stateCodes.find((s) => s.value === data?.stateCode) || null,
      gstNo: data?.gstNo || "",
      bankName:
        banks.find((bank) => bank.value === data?.bankDetails?.bankName) ||
        null,
      accountNumber: data?.bankDetails?.accountNumber || "",
      ifsc: data?.bankDetails?.ifsc || "",
    });
  };

  const cancelHandler = () => {
    resetEditForm(profileDetails);
    editHandler();
  };

  const preparePayload = (data: EditFormValues) => {
    return {
      name: data.name,
      email: data.email,
      address: data.address,
      contact: data.contact,
      state: data.state?.label,
      stateCode: data.state?.value,
      gstNo: data.gstNo,
      accountNumber: data.accountNumber,
      ifsc: data.ifsc,
      bankName: data.bankName?.value,
    };
  };

  const onSubmitForm = async (data) => {
    try {
      handleLoading(true, "Updating user details, please wait...");
      console.log(data);
      const payload = preparePayload(data);
      const result = await api.put(`/user/${userId}`, payload);
      resetEditForm(result.data?.data);
      setProfileDetails(result.data?.data);
      showToast("success", "User details updated successfully!");
      editHandler();
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        error.response.data?.message || "Failed to update user details!"
      );
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    resetEditForm(profileDetails);
  }, [profileDetails]);

  const renderButtons = () => {
    if (isEditing) {
      return (
        <>
          <Button
            title="Submit"
            type="submit"
            onClick={handleSubmit(onSubmitForm)}
          />
          <Button title="Cancel" variant="Danger" onClick={cancelHandler} />
        </>
      );
    }
    return <Button title="Edit" onClick={editHandler} />;
  };
  return (
    <>
      <form className={Styles.formContainer}>
        {editUserFormFields.map((field) => (
          <Input
            key={field.name}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type || "text"}
            className={field.className}
            textAreaWidth={field.textAreaWidth}
            register={register}
            control={control}
            options={field.options}
            isInputDisabled={!isEditing}
            error={errors[field.name]}
            rules={field.rules}
          />
        ))}
      </form>
      {isAdmin && (
        <div className={Styles.buttonContainer}>{renderButtons()}</div>
      )}
    </>
  );
};

export default User;
