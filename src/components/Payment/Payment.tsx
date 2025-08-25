import { useForm } from "react-hook-form";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Styles from "./Payment.module.css";
import useAppContext from "../../context/useAppContext";
import { showToast } from "../../utils/common";
import api from "../../utils/axios";
import { PaymentType } from "../../utils/interfaces";
import { useEffect } from "react";

interface PaymentProps {
  userId: number;
  closePaymentModal: () => void;
  getUserPayments: (userId: number) => void;
  getUserDetails: (userId: number) => void;
  isPaymentEditing: boolean;
  paymentToBeEdited?: PaymentType;
}

const Payment = ({
  userId,
  closePaymentModal,
  getUserPayments,
  getUserDetails,
  isPaymentEditing,
  paymentToBeEdited,
}: PaymentProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentDate: "",
      amount: "",
      payeeName: "",
    },
  });

  const { handleLoading } = useAppContext();

  const resetEditPaymentForm = (paymentToBeEdited: PaymentType) => {
    const defaultValues = {
      paymentDate: paymentToBeEdited.paymentDate?.split("T")[0] || "",
      amount: paymentToBeEdited.amount.toString() || "",
      payeeName: paymentToBeEdited.payeeName || "",
    };

    reset(defaultValues);
  };

  const submitPayment = async (data) => {
    try {
      handleLoading(true, "Submitting payment, please wait...");
      if (isPaymentEditing) {
        const payload = { ...data, paymentId: paymentToBeEdited.id };
        await api.put(`/payment/${userId}`, payload);
      } else {
        await api.post(`/payment/${userId}`, data);
      }
      showToast("success", "Payment submitted successfully!");
      closePaymentModal();
      reset();
      getUserPayments(Number(userId));
      getUserDetails(Number(userId));
    } catch (error) {
      console.log(error);
      showToast("error", error.response || "Failed to submit payment!");
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(paymentToBeEdited || {}).length) {
      resetEditPaymentForm(paymentToBeEdited);
    }
  }, [paymentToBeEdited]);

  return (
    <form onSubmit={handleSubmit(submitPayment)}>
      <div>
        <Input
          label="Date"
          name="paymentDate"
          type="date"
          placeholder="Enter payment date.."
          register={register}
          rules={{ required: "Payment date is required" }}
          error={errors.paymentDate}
        />
        <Input
          label="Amount"
          name="amount"
          type="number"
          placeholder="Enter amount.."
          register={register}
          rules={{ required: "Amount is required" }}
          error={errors.amount}
        />
        <Input
          label="Payee"
          name="payeeName"
          placeholder="Enter payee.."
          register={register}
          rules={{ required: "Payee is required" }}
          error={errors.payeeName}
        />
      </div>
      <div className={Styles.buttonContainer}>
        <Button title="Submit" type="submit" />
      </div>
    </form>
  );
};

export default Payment;
