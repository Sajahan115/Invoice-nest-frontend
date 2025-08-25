import { useFieldArray, useForm } from "react-hook-form";
import Input from "../Input/Input";
import Styles from "./Invoice.module.css";
import Button from "../Button/Button";
import useAppContext from "../../context/useAppContext";
import api from "../../utils/axios";
import { showToast } from "../../utils/common";
import { useEffect } from "react";

export interface InvoiceItem {
  itemId: number;
  description: string;
  hsnCode: string;
  rate: number;
  quantity: number;
  netAmount: number;
}

interface InvoiceToBeEdited {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string; // or Date if you parse it
  shippingCharges: string;
  cgst: string;
  sgst: string;
  igst: string;
  totalBeforeTax: string;
  totalAfterTax: string;
  amountInWords: string;
  items: InvoiceItem[];
}

interface InvoiceProps {
  userId: number;
  setIsOpenInvoiceModal: React.Dispatch<React.SetStateAction<boolean>>;
  getUserInvoices: (userId: number) => void;
  getUserDetails: (userId: number) => void;
  isInvoiceEditing: boolean;
  invoiceToBeEdited?: InvoiceToBeEdited;
  closeInvoiceModal: () => void;
}

const Invoice = ({
  userId,
  setIsOpenInvoiceModal,
  getUserInvoices,
  getUserDetails,
  isInvoiceEditing,
  invoiceToBeEdited,
  closeInvoiceModal,
}: InvoiceProps) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceDate: "",
      shippingCharges: "",
      items: [
        {
          itemId: "",
          description: "",
          hsnCode: "",
          quantity: "",
          rate: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const { handleLoading } = useAppContext();

  const addItem = () => {
    append({
      itemId: "",
      description: "",
      hsnCode: "",
      quantity: "",
      rate: "",
    });
  };

  const resetEditInvoiceForm = (invoiceToBeEdited: InvoiceToBeEdited) => {
    const defaultValues = {
      invoiceDate: invoiceToBeEdited.invoiceDate?.split("T")[0] || "", // "2025-01-01"
      shippingCharges: invoiceToBeEdited.shippingCharges || "",
      items: invoiceToBeEdited.items.map((item) => ({
        itemId: item.itemId.toString() ?? "",
        description: item.description || "",
        hsnCode: item.hsnCode || "",
        quantity: item.quantity.toString() ?? "",
        rate: item.rate.toString() ?? "",
      })),
    };
    reset(defaultValues);
  };

  const submitInvoice = async (data) => {
    try {
      handleLoading(true, "Submitting invoice, please wait...");

      if (isInvoiceEditing) {
        const payload = {
          ...data,
          userId,
          shippingCharges: Number(data.shippingCharges),
        };

        await api.put(`/invoice/${invoiceToBeEdited?.invoiceId}`, payload);
      } else {
        // remove itemId if creating invoice
        const payload = {
          ...data,
          userId,
          shippingCharges: Number(data.shippingCharges),
          items: data.items.map(({ itemId, ...rest }) => rest),
        };
        await api.post("/invoice", payload);
      }

      showToast("success", "Invoice submitted successfully!");
      closeInvoiceModal();
      setIsOpenInvoiceModal(false);
      reset();
      getUserInvoices(Number(userId));
      getUserDetails(Number(userId));
    } catch (error) {
      console.log(error);
      showToast("error", "Failed to submit invoice!");
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(invoiceToBeEdited || {}).length) {
      resetEditInvoiceForm(invoiceToBeEdited);
    }
  }, [invoiceToBeEdited]);

  return (
    <form className={Styles.invoiceForm} onSubmit={handleSubmit(submitInvoice)}>
      <div className={Styles.invoiceHeader}>
        <Input
          label="Invoice Date"
          name="invoiceDate"
          placeholder="DD-MM-YYYY"
          type="date"
          register={register}
          rules={{ required: "Invoice date is required" }}
          error={errors.invoiceDate}
        />

        <Input
          label="Shipping Charges"
          name="shippingCharges"
          placeholder="Enter Shipping Charges.."
          type="number"
          register={register}
          error={errors.shippingCharges}
        />
      </div>

      <div className={Styles.invoiceItems}>
        {fields.map((_, index) => (
          <div className={Styles.invoiceItem} key={index}>
            <input
              type="hidden"
              {...register(`items.${index}.itemId`)}
              defaultValue={fields[index]?.itemId}
            />
            <Input
              label="Description"
              name={`items[${index}].description`}
              placeholder="Enter Description.."
              register={register}
              rules={{ required: "Description is required" }}
              error={errors.items?.[index]?.description}
            />
            <Input
              label="HSN Code"
              name={`items[${index}].hsnCode`}
              placeholder="Enter HSN.."
              register={register}
              rules={{ required: "HSN Code is required" }}
              error={errors.items?.[index]?.hsnCode}
            />
            <Input
              label="Quantity"
              name={`items[${index}].quantity`}
              type="number"
              placeholder="Enter Quantity.."
              register={register}
              rules={{
                required: "Quantity is required",
                min: { value: 1, message: "Minimum quantity is 1" },
                valueAsNumber: true,
              }}
              error={errors.items?.[index]?.quantity}
            />
            <Input
              label="Rate"
              name={`items[${index}].rate`}
              type="number"
              step="0.01"
              placeholder="Enter rate.."
              register={register}
              rules={{
                required: "Rate is required",
                min: { value: 0.01, message: "Minimum rate is 0.01" },
                valueAsNumber: true,
              }}
              error={errors.items?.[index]?.rate}
            />
            <p
              onClick={() => remove(index)}
              className={`${Styles.removeButton} ${
                index === 0 && Styles.removeButtonHidden
              }`}
            >
              X
            </p>
          </div>
        ))}
        <Button title="Add Item" onClick={addItem} />
      </div>
      <div className={Styles.buttonContainer}>
        <Button title="Submit" type="submit" />
      </div>
    </form>
  );
};

export default Invoice;
