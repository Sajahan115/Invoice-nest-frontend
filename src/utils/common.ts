import { jwtDecode } from "jwt-decode";
import { cssTransition, toast, ToastOptions } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PaymentType } from "./interfaces";

type JWTPayload = {
  exp?: number;
  iat?: number;
  id?: number;
  role?: string;
  username?: string;
};

const bounce = cssTransition({
  enter: "animate__animated animate__bounceIn",
  exit: "animate__animated animate__bounceOut",
});

const toastConfig: ToastOptions = {
  transition: bounce,
  position: "bottom-center",
  autoClose: 2000,
  hideProgressBar: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: false,
  closeButton: false,
};

export const showToast = (toastType: "success" | "error", message: string) => {
  if (toastType === "success") {
    toast.success(message, {
      ...toastConfig,
      className: "custom-toast-success",
    });
  } else if (toastType === "error") {
    toast.error(message, {
      ...toastConfig,
      className: "custom-toast-error",
    });
  }
};

export const getTokenPayload = (token: string): JWTPayload | undefined => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.log("Invalid token", error);
  }
};

export const checkIfAdmin = (payload: JWTPayload) => payload?.role === "admin";

export const formatDateToDDMMYYYY = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export function formatNumberIndian(num: number | string): string {
  if (num) {
    const parts = num?.toString().split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1] ? "." + parts[1] : "";

    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);

    const formatted =
      otherNumbers !== ""
        ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
        : lastThree;

    return formatted + decimalPart;
  }

  return;
}

export const exportToExcel = (data: any[], fileName: string = "data") => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const dataBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(dataBlob, `${fileName}.xlsx`);
};

export const exportPaymentFormat = (data: PaymentType[]) => {
  return data.map((payment) => ({
    "Payment Date": formatDateToDDMMYYYY(payment.paymentDate),
    "Payee Name": payment.payeeName,
    Amount: formatNumberIndian(payment.amount),
  }));
};

export const getFinancialYearOptions = (startYearString: string) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentFinancialYear =
    currentMonth >= 3 ? currentYear : currentYear - 1;
  // const startYear = Number(startYearString.split("-")[0]);
  const [startYear] = startYearString.split("-").map(Number);

  const options = [];

  for (let year = startYear; year <= currentFinancialYear; year++) {
    const label = `${year}-${(year + 1).toString().slice(-2)}`;
    options.push({ label, value: label });
  }

  return options;
};
