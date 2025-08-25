import Styles from "./Register.module.css";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { banks, stateCodes } from "../../data/Data";
import { useForm } from "react-hook-form";
import api from "../../utils/axios";
import useAppContext from "../../context/useAppContext";
import { showToast } from "../../utils/common";
import Container from "../../components/Container/Container";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import Button from "../../components/Button/Button";

type FormValues = {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  state: { value: string; label: string } | null;
  gstin: string;
  bank_name: { value: string; label: string } | null;
  account_number: string;
  ifsc_code: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>();
  const { handleLoading } = useAppContext();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      state_code: data.state?.value,
      state: data.state?.label,
      bank_name: data.bank_name?.value,
    };
    try {
      handleLoading(true, "Registering user, please wait...");
      await api.post("/user/register", payload);
      showToast("success", "User registered successfully!");
      navigate("/users");
    } catch (error) {
      showToast(
        "error",
        error.response.data?.message || "User registration failed!"
      );
      console.log(error);
    } finally {
      handleLoading(false);
    }
  };

  return (
    <Container>
      <BreadCrumb items={[{ label: "Add Clients" }]} />
      <form className={Styles.loginContainer} onSubmit={handleSubmit(onSubmit)}>
        <div className={Styles.card}>
          <div className={Styles.form}>
            <Input
              name="username"
              placeholder="Enter username.."
              label="Username"
              register={register}
              error={errors.username}
              rules={{ required: "Fill Username" }}
            />
            <Input
              name="name"
              placeholder="Enter name.."
              label="Name"
              register={register}
              error={errors.name}
              rules={{ required: "Fill Name" }}
            />
            <Input
              name="password"
              type="password"
              placeholder="Enter password.."
              label="Password"
              register={register}
              error={errors.password}
              rules={{
                required: "Fill Password",
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                  message:
                    "Password must contain at least one letter, one number, and one special character",
                },
              }}
            />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password.."
              label="Confirm Password"
              register={register}
              error={errors.confirmPassword}
              rules={{
                required: "Confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              }}
            />

            <Input
              name="email"
              placeholder="Enter email.."
              label="Email"
              register={register}
              error={errors.email}
              rules={{
                required: "Fill Email",
                pattern: {
                  value:
                    /^(?!.*\.\.)[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
                  message: "Invalid email format",
                },
              }}
            />
            <Input
              name="phone"
              placeholder="Enter contact.."
              label="Contact"
              register={register}
              error={errors.phone}
              rules={{
                required: "Fill Contact",
                maxLength: { value: 10, message: "Contact must be 10 digits" },
                minLength: { value: 10, message: "Contact must be 10 digits" },
              }}
            />
            <Input
              name="address"
              type="textArea"
              placeholder="Enter address.."
              label="Address"
              className="fullWidth"
              register={register}
              control={control}
              error={errors.address}
              rules={{
                required: "Fill Address",
              }}
            />
            <Input
              name="state"
              placeholder="Select state.."
              label="State"
              type="select"
              options={stateCodes}
              control={control}
              error={errors.state}
              rules={{ required: "Select State" }}
            />
            <Input
              name="gstin"
              placeholder="Enter gstin.."
              label="GSTIN"
              register={register}
              error={errors.gstin}
              rules={{
                required: "Fill GSTIN",
              }}
            />
            <Input
              name="bank_name"
              placeholder="Select bank name.."
              label="Bank Name"
              type="select"
              options={banks}
              className="fullWidth"
              control={control}
              error={errors.bank_name}
              rules={{ required: "Select Bank" }}
            />
            <Input
              name="account_number"
              placeholder="Enter account number.."
              label="Account Number"
              register={register}
              error={errors.account_number}
              rules={{
                required: "Fill Account Number",
              }}
            />
            <Input
              name="ifsc_code"
              placeholder="Enter IFSC code.."
              label="IFSC Code"
              register={register}
              error={errors.ifsc_code}
              rules={{
                required: "Fill IFSC Code",
              }}
            />
          </div>
          <Button title="Register" type="submit" />
        </div>
      </form>
    </Container>
  );
};

export default Register;
