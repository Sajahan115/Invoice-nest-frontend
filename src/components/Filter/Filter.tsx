import { useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Styles from "./Filter.module.css";
import { getFinancialYearOptions } from "../../utils/common";

const Filter = ({
  setFilterUrl,
  filterData,
  onFilterChange,
  activeTab,
  getUserInvoices,
  getUserPayments,
  userId,
}) => {
  const startFinancialYear = "2022-23";
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    onFilterChange({
      financialYear: null,
      startDate: "",
      endDate: "",
    });
    setErrors({});
    activeTab === "Invoices"
      ? getUserInvoices(userId)
      : getUserPayments(userId);
  };

  const validate = () => {
    const { financialYear, startDate, endDate } = filterData;
    const newErrors: { [key: string]: string } = {};
    const hasFY = !!financialYear;
    const hasDates = !!startDate && !!endDate;

    if ((hasFY && hasDates) || (!hasFY && !hasDates)) {
      newErrors.form =
        "Select either Financial Year or Start+End Dates, not both or neither.";
    }

    if (hasDates) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        newErrors.startDate = "Start date must be before end date.";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { financialYear, startDate, endDate } = filterData;

    const searchPartOfUrl = `?financialYear=${
      financialYear?.value || ""
    }&startDate=${startDate}&endDate=${endDate}`;

    console.log(searchPartOfUrl);
    setFilterUrl(searchPartOfUrl);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Financial Year"
        name="financialYear"
        type="select"
        placeholder="Select Financial Year"
        options={getFinancialYearOptions(startFinancialYear)}
        value={filterData.financialYear}
        onChange={(val) =>
          onFilterChange({ ...filterData, financialYear: val })
        }
      />

      <Input
        label="Start Date"
        name="startDate"
        type="date"
        placeholder="Select start date.."
        value={filterData.startDate}
        onChange={(val) => onFilterChange({ ...filterData, startDate: val })}
        error={errors.startDate ? { message: errors.startDate } : undefined}
      />

      <Input
        label="End Date"
        name="endDate"
        type="date"
        placeholder="Select end date.."
        value={filterData.endDate}
        onChange={(val) => onFilterChange({ ...filterData, endDate: val })}
        error={errors.endDate ? { message: errors.endDate } : undefined}
      />

      {errors.form && <p className={Styles.error}>{errors.form}</p>}

      <div className={Styles.buttonContainer}>
        <Button title="Reset" variant="Danger" onClick={resetForm} />
        <Button title="Submit" type="submit" />
      </div>
    </form>
  );
};

export default Filter;
