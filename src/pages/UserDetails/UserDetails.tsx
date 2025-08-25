import { useEffect, useState } from "react";
import Styles from "./UserDetails.module.css";
import Container from "../../components/Container/Container";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import useAppContext from "../../context/useAppContext";
import Modal from "../../components/Modal/Modal";
import User from "../../components/User/User";
import api from "../../utils/axios";
import {
  checkIfAdmin,
  exportPaymentFormat,
  exportToExcel,
  formatDateToDDMMYYYY,
  formatNumberIndian,
  getTokenPayload,
  showToast,
} from "../../utils/common";
import AccordionItem from "../../components/Accordion/Accordion";
import Button from "../../components/Button/Button";
import Invoice from "../../components/Invoice/Invoice";
import {
  ExportInvoiceRow,
  ExportPaymentRow,
  InvoiceItem,
  InvoiceType,
  PaymentType,
  UserProfileType,
} from "../../utils/interfaces";
import Table, { Column } from "../../components/Table/Table";
import Payment from "../../components/Payment/Payment";
import Search from "../../components/Search/Search";
import Filter from "../../components/Filter/Filter";

const UserDetails = () => {
  const [profileDetails, setProfileDetails] = useState<UserProfileType | null>(
    null
  );
  const [adminDetails, setAdminDetails] = useState<UserProfileType | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterUrl, setFilterUrl] = useState<string>("");
  const [filterData, setFilterData] = useState({
    financialYear: null,
    startDate: "",
    endDate: "",
  });
  const [allInvoices, setAllInvoices] = useState<InvoiceType[] | null>(null);
  const [invoices, setInvoices] = useState<InvoiceType[] | null>(null);
  const [allPayments, setAllPayments] = useState<PaymentType[] | null>(null);
  const [payments, setPayments] = useState<PaymentType[] | null>(null);
  const [exportInvoices, setExportInvoices] = useState<
    ExportInvoiceRow[] | null
  >(null);

  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState<boolean>(false);
  const [isOpenInvoiceModal, setIsOpenInvoiceModal] = useState<boolean>(false);
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false);

  const [paymentToBeDeleted, setPaymentToBeDeleted] =
    useState<PaymentType | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"Invoices" | "Payments">(
    "Invoices"
  );
  const [isInvoiceEditing, setIsInvoiceEditing] = useState<boolean>(false);
  const [invoiceToBeEdited, setInvoiceToBeEdited] =
    useState<InvoiceType | null>(null);
  const [isPaymentEditing, setIsPaymentEditing] = useState<boolean>(false);
  const [paymentToBeEdited, setPaymentToBeEdited] =
    useState<PaymentType | null>(null);

  const { userId } = useParams();

  const navigate = useNavigate();

  const { handleLoading, userDetails, setPrintContext } = useAppContext();

  const dataFromToken = getTokenPayload(sessionStorage.getItem("token"));
  const adminId = userDetails?.id || dataFromToken?.id;

  const breadCrumbData = [
    {
      label: "Users",
      href: "/users",
    },
    {
      label:
        profileDetails && profileDetails.name
          ? profileDetails.name.toUpperCase()
          : "User Details",
    },
  ];

  const invoiceColumns: Column<InvoiceItem>[] = [
    { key: "description", header: "Description", align: "left" },
    { key: "hsnCode", header: "HSN Code", align: "center" },
    {
      key: "rate",
      header: "Rate",
      align: "right",
      render: (value: number) => formatNumberIndian(value.toFixed(2)),
    },
    {
      key: "quantity",
      header: "Quantity",
      align: "right",
      render: (value: number) => formatNumberIndian(value),
    },
    {
      key: "netAmount",
      header: "Net Amount",
      align: "right",
      render: (value: number) => formatNumberIndian(value.toFixed(2)),
    },
  ];

  const paymentColumns: Column<PaymentType>[] = [
    {
      key: "paymentDate",
      header: "Date",
      align: "left",
      render: (value: string) => formatDateToDDMMYYYY(value),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (value: number) => formatNumberIndian(value),
    },
    {
      key: "payeeName",
      header: "Payee",
      align: "left",
      render: (value: string) => value.toUpperCase(),
    },
    ...(checkIfAdmin(dataFromToken)
      ? [
          {
            key: "actions",
            header: "Action",
            align: "center",
            render: (_: any, row: PaymentType) => (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <Button
                  title="Edit"
                  onClick={() => paymentEditHandler(row.id)}
                />
                <Button
                  title="Delete"
                  variant="Danger"
                  onClick={() => paymentDeleteHandler(row.id)}
                />
              </div>
            ),
          } as Column<PaymentType>,
        ]
      : []),
  ];

  const handleExport = (
    data: ExportInvoiceRow[] | ExportPaymentRow[],
    fileName: string
  ) => {
    exportToExcel(data, fileName);
  };

  const handleFilterChange = (newData) => {
    setFilterData(newData);
  };

  const editHandler = () => {
    setIsEditing(!isEditing);
  };

  const isFilterApplied = () => {
    const { financialYear, startDate, endDate } = filterData;
    const hasFY = financialYear !== null;
    const hasDates = startDate !== "" && endDate !== "";

    return hasFY || hasDates;
  };

  const paymentDeleteHandler = (id: number) => {
    setPaymentToBeDeleted(payments?.find((payment) => payment.id === id));
    setIsOpenDeleteModal(true);
  };

  const paymentEditHandler = (id: number) => {
    console.log(id);
    setIsPaymentEditing(true);
    setPaymentToBeEdited(payments?.find((payment) => payment.id === id));
    setIsOpenPaymentModal(true);
  };

  const closeModalHandler = () => {
    setIsEditing(false);
    setIsOpenDetailsModal(false);
  };

  const invoiceEditHandler = (isEditing: boolean, invoiceId: number) => {
    setIsInvoiceEditing(isEditing);
    setInvoiceToBeEdited(
      invoices?.find((invoice) => invoice.invoiceId === invoiceId)
    );
    setIsOpenInvoiceModal(isEditing);
  };

  const getUserDetails = async (userId: number) => {
    try {
      if (!userId || isNaN(userId)) return;
      handleLoading(true, "Fetching user details, please wait...");
      const result = await api(`/user/${userId}`);
      // for now only admin can print invoice
      const adminResult = await api(`/user/${adminId}`);
      setAdminDetails(adminResult.data?.data);
      const data = result.data?.data;
      setProfileDetails(data);
    } catch (error) {
      console.log(error);
      showToast("error", error.response || "Failed to fetch user details!");
    } finally {
      handleLoading(false);
    }
  };

  const getUserInvoices = async (userId: number, filterUrl = "") => {
    try {
      if (!userId || isNaN(userId)) return;
      handleLoading(true, "Fetching invoices, please wait...");
      const result = await api(`/invoice/${userId}${filterUrl}`);
      const data = result.data?.data;
      setInvoices(data);
      setAllInvoices(data);
      const exportData: ExportInvoiceRow[] = data.map(
        (invoice: InvoiceType) => ({
          "Invoice Date": formatDateToDDMMYYYY(invoice.invoiceDate),
          "Invoice No": invoice.invoiceNumber,
          Amount: formatNumberIndian(invoice.totalAfterTax),
        })
      );
      setExportInvoices(exportData);
      setIsOpenFilterModal(false);
      setFilterUrl("");
    } catch (error) {
      console.log(error);
      showToast("error", error.response || "Failed to fetch invoices!");
    } finally {
      handleLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (activeTab === "Invoices") {
      const filtered = allInvoices.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(query.trim()) ||
          formatDateToDDMMYYYY(invoice.invoiceDate)
            .toLowerCase()
            .includes(query.trim()) ||
          invoice.totalAfterTax.toString().includes(query.trim())
      );
      setInvoices(filtered);
    } else {
      const filtered = allPayments.filter(
        (payment) =>
          payment.amount.toString().includes(query.trim()) ||
          payment.payeeName.toLowerCase().includes(query.trim()) ||
          formatDateToDDMMYYYY(payment.paymentDate)
            .toLowerCase()
            .includes(query.trim())
      );

      setPayments(filtered);
    }
  };

  const getUserPayments = async (userId: number, filterUrl = "") => {
    try {
      handleLoading(true, "Fetching payments, please wait...");
      const result = await api(`/payment/${userId}${filterUrl}`);
      const data = result.data?.data;
      setPayments(data);
      setAllPayments(data);
      setIsOpenFilterModal(false);
      setFilterUrl("");
    } catch (error) {
      console.log(error);
      showToast("error", error.response || "Failed to fetch payments!");
    } finally {
      handleLoading(false);
    }
  };

  const deletePayment = async () => {
    try {
      handleLoading(true, "Deleting payments, please wait...");
      const payload = {
        paymentId: paymentToBeDeleted?.id,
      };
      await api.delete(`/payment/${userId}`, { data: payload });
      closeDeleteModal();
      getUserPayments(Number(userId));
      getUserDetails(Number(userId));
    } catch (error) {
      console.log(error);
      showToast("error", error.response || "Failed to delete payments!");
    } finally {
      handleLoading(false);
    }
  };

  const tabHandler = (tab: "Invoices" | "Payments") => {
    setSearchQuery("");
    setFilterData({
      financialYear: null,
      startDate: "",
      endDate: "",
    });
    if (tab === "Payments") setInvoices(allInvoices);
    else setPayments(allPayments);
    setActiveTab(tab);
  };

  const printContextHandler = (invoice: InvoiceType) => {
    setPrintContext({
      buyerDetails: {
        id: profileDetails?._id,
        companyName: profileDetails?.name,
        address: profileDetails?.address,
        contact: profileDetails?.contact,
        gstIn: profileDetails?.gstNo,
        state: profileDetails?.state,
        stateCode: profileDetails?.stateCode,
        bankDetails: {
          accountNumber: profileDetails?.bankDetails.accountNumber,
          ifsc: profileDetails?.bankDetails.ifsc,
          bankName: profileDetails?.bankDetails.bankName,
          accountName: profileDetails?.name,
        },
      },
      companyDetails: {
        companyName: adminDetails?.name,
        address: adminDetails?.address,
        contact: adminDetails?.contact,
        gstIn: adminDetails?.gstNo,
        state: adminDetails?.state,
        stateCode: adminDetails?.stateCode,
        dealsIn: "All types of Printed Items",
        email: "manishaprinters780@gmail.com",
        bankDetails: {
          accountName: adminDetails?.name,
          accountNumber: adminDetails?.bankDetails.accountNumber,
          bankName: adminDetails?.bankDetails.bankName,
          ifsc: adminDetails?.bankDetails.ifsc,
          branch: "Mecheda",
        },
      },
      invoice: {
        invoiceId: invoice.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        shippingCharges: invoice.shippingCharges,
        cgst: invoice.cgst,
        sgst: invoice.sgst,
        igst: invoice.igst,
        totalBeforeTax: invoice.totalBeforeTax,
        totalAfterTax: invoice.totalAfterTax,
        amountInWords: invoice.amountInWords,
        items: invoice.items,
      },
    });
    navigate("/users/invoice/print-preview");
  };

  const closeInvoiceModal = () => {
    setIsOpenInvoiceModal(false);

    // reset invoiceEditing status so that title changes back to "Add Invoice"
    if (isInvoiceEditing) {
      setInvoiceToBeEdited(null);
      setIsInvoiceEditing(false);
    }
  };

  const closeFilterModal = () => {
    setIsOpenFilterModal(false);
  };

  const closeDeleteModal = () => {
    setIsOpenDeleteModal(false);
    setPaymentToBeDeleted(null);
  };

  const closePaymentModal = () => {
    setIsOpenPaymentModal(false);

    // reset paymentEditing status so that title changes back to "Add Invoice"
    if (isPaymentEditing) {
      setPaymentToBeEdited(null);
      setIsPaymentEditing(false);
    }
  };

  useEffect(() => {
    getUserDetails(Number(userId));
  }, [userId]);

  useEffect(() => {
    if (activeTab === "Invoices" && filterUrl !== "") {
      getUserInvoices(Number(userId), filterUrl);
    } else if (activeTab === "Payments" && filterUrl !== "") {
      getUserPayments(Number(userId), filterUrl);
    }
  }, [filterUrl]);

  useEffect(() => {
    if (activeTab === "Invoices") {
      getUserInvoices(Number(userId));
    } else if (activeTab === "Payments") {
      getUserPayments(Number(userId));
    }

    setFilterUrl("");
  }, [activeTab]);

  const UserDetailsCard = () => {
    return (
      <div>
        <div className={Styles.card}>
          <div className={Styles.cardItem}>
            <p>Name :</p>
            <p>{profileDetails?.name}</p>
          </div>
          <div className={Styles.cardItem}>
            <p>Contact :</p>
            <p>{profileDetails?.contact}</p>
          </div>
          <div className={Styles.cardItem}>
            <p>Total Bill :</p>
            <p>{formatNumberIndian(profileDetails?.totalBillAmount)}</p>
          </div>
          <div className={Styles.cardItem}>
            <p>Total Paid :</p>
            <p>{formatNumberIndian(profileDetails?.totalPaymentAmount)}</p>
          </div>
          <div
            className={Styles.showFullDetails}
            onClick={() => setIsOpenDetailsModal(true)}
          >
            <p>Show Full Details</p>
          </div>
        </div>
      </div>
    );
  };

  const UserDetailsTabs = () => {
    return (
      <div className={Styles.userDetailsTabs}>
        <div
          className={`${Styles.tabs} ${
            activeTab === "Invoices" ? Styles.activeTab : ""
          }`}
          onClick={() => tabHandler("Invoices")}
        >
          <p>Invoices</p>
        </div>
        <div
          className={`${Styles.tabs} ${
            activeTab === "Payments" ? Styles.activeTab : ""
          }`}
          onClick={() => tabHandler("Payments")}
        >
          <p>Payments</p>
        </div>
      </div>
    );
  };

  const InvoiceTab = () => {
    return (
      <div className={`${activeTab === "Invoices" && Styles.activeTabContent}`}>
        {checkIfAdmin(dataFromToken) && <ActionButtons />}
        <Modal
          isOpen={isOpenInvoiceModal}
          onClose={closeInvoiceModal}
          title={
            isInvoiceEditing
              ? `Edit #${invoiceToBeEdited.invoiceNumber}`
              : "Add Invoice"
          }
        >
          <Invoice
            userId={profileDetails?._id}
            setIsOpenInvoiceModal={setIsOpenInvoiceModal}
            closeInvoiceModal={closeInvoiceModal}
            getUserInvoices={getUserInvoices}
            getUserDetails={getUserDetails}
            isInvoiceEditing={isInvoiceEditing}
            invoiceToBeEdited={invoiceToBeEdited}
          />
        </Modal>

        {invoices &&
          invoices?.length > 0 &&
          invoices.map((invoice) => {
            return (
              <AccordionItem
                title={`Invoice #${invoice.invoiceNumber}`}
                key={invoice.invoiceId}
              >
                <div className={Styles.invoiceAction}>
                  <span>
                    Date : {formatDateToDDMMYYYY(invoice.invoiceDate)}
                  </span>
                  {checkIfAdmin(dataFromToken) && (
                    <div className={Styles.invoiceActionButtons}>
                      <Button
                        title="Edit"
                        variant="Primary"
                        onClick={() =>
                          invoiceEditHandler(true, invoice.invoiceId)
                        }
                      />
                      <Button
                        title="Print"
                        variant="Success"
                        onClick={() => printContextHandler(invoice)}
                      />
                    </div>
                  )}
                </div>
                <div>
                  {/* <ItemTable items={invoice.items} /> */}
                  <Table columns={invoiceColumns} data={invoice.items} />
                  <div className={Styles.summaryWrapper}>
                    <div className={Styles.subItems}>
                      <div className={Styles.item}>
                        <p className={Styles.label}>Total</p>
                        <p className={Styles.value}>
                          {formatNumberIndian(invoice.totalBeforeTax)}
                        </p>
                      </div>
                      <div className={Styles.item}>
                        <p className={Styles.label}>Shipping & Packaging</p>
                        <p className={Styles.value}>
                          {formatNumberIndian(invoice.shippingCharges)}
                        </p>
                      </div>
                      <div className={Styles.item}>
                        <p className={Styles.label}>
                          {Number(invoice.cgst) > 0 ? "9% CGST" : "CGST"}
                        </p>
                        <p className={Styles.value}>
                          {formatNumberIndian(invoice.cgst)}
                        </p>
                      </div>
                      <div className={Styles.item}>
                        <p className={Styles.label}>
                          {Number(invoice.sgst) > 0 ? "9% SGST" : "SGST"}
                        </p>
                        <p className={Styles.value}>
                          {formatNumberIndian(invoice.sgst)}
                        </p>
                      </div>
                      <div className={Styles.item}>
                        <p className={Styles.label}>
                          {Number(invoice.igst) > 0 ? "18% IGST" : "IGST"}
                        </p>
                        <p className={Styles.value}>
                          {formatNumberIndian(invoice.igst)}
                        </p>
                      </div>

                      <div className={Styles.separator}></div>
                      <div className={Styles.item}>
                        <p className={Styles.label}>Total Amount</p>
                        <p className={Styles.value}>
                          {formatNumberIndian(invoice.totalAfterTax)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            );
          })}
        {invoices?.length === 0 && (
          <p className={Styles.noInvoice}>
            No invoices found! Try creating one.
          </p>
        )}
      </div>
    );
  };

  const PaymentTab = () => {
    return (
      <div className={`${activeTab === "Payments" && Styles.activeTabContent}`}>
        {checkIfAdmin(dataFromToken) && <ActionButtons />}
        <Modal
          isOpen={isOpenPaymentModal}
          onClose={closePaymentModal}
          title={isPaymentEditing ? "Edit Payment" : "Add Payment"}
        >
          <Payment
            userId={Number(userId)}
            closePaymentModal={closePaymentModal}
            getUserPayments={getUserPayments}
            getUserDetails={getUserDetails}
            isPaymentEditing={isPaymentEditing}
            paymentToBeEdited={paymentToBeEdited}
          />
        </Modal>
        <Modal
          isOpen={isOpenDeleteModal}
          onClose={closeDeleteModal}
          title="Delete Payment"
        >
          <div className={Styles.deleteModal}>
            <p>
              Delete payment {formatNumberIndian(paymentToBeDeleted?.amount)} on{" "}
              {formatDateToDDMMYYYY(paymentToBeDeleted?.paymentDate)} ?
            </p>
            <div className={Styles.deleteModalButtons}>
              <Button title="Yes" variant="Danger" onClick={deletePayment} />
              <Button
                title="No"
                variant="Secondary"
                onClick={closeDeleteModal}
              />
            </div>
          </div>
        </Modal>

        {payments?.length > 0 && (
          <Table columns={paymentColumns} data={payments} />
        )}
        {payments?.length === 0 && (
          <p className={Styles.noInvoice}>No payment found! Try adding one.</p>
        )}
      </div>
    );
  };

  const ActionButtons = () => {
    if (activeTab === "Invoices") {
      return (
        <div className={Styles.actionButtonContainer}>
          <Button title="Add" onClick={() => setIsOpenInvoiceModal(true)} />
          <div className={Styles.relativeWrapper}>
            <Button title="Filter" onClick={() => setIsOpenFilterModal(true)} />
            {isFilterApplied() && <span className={Styles.redDot}></span>}
          </div>
          <Button
            title="Download"
            variant="Success"
            onClick={() =>
              handleExport(exportInvoices, `${profileDetails.name} Invoices`)
            }
          />
        </div>
      );
    } else {
      return (
        <div className={Styles.actionButtonContainer}>
          <Button title="Add" onClick={() => setIsOpenPaymentModal(true)} />
          <div className={Styles.relativeWrapper}>
            <Button title="Filter" onClick={() => setIsOpenFilterModal(true)} />
            {isFilterApplied() && <span className={Styles.redDot}></span>}
          </div>
          <Button
            title="Download"
            variant="Success"
            onClick={() =>
              handleExport(
                exportPaymentFormat(payments),
                `${profileDetails.name} Payments`
              )
            }
          />
        </div>
      );
    }
  };

  return (
    <Container>
      {checkIfAdmin(dataFromToken) && <BreadCrumb items={breadCrumbData} />}
      <div>
        <UserDetailsCard />
        <Modal
          isOpen={isOpenDetailsModal}
          onClose={closeModalHandler}
          title="User Details"
        >
          <User
            editHandler={editHandler}
            isEditing={isEditing}
            userId={Number(userId)}
            profileDetails={profileDetails}
            setProfileDetails={setProfileDetails}
            isAdmin={checkIfAdmin(dataFromToken)}
          />
        </Modal>
        <Modal
          isOpen={isOpenFilterModal}
          onClose={closeFilterModal}
          title={`Filter ${activeTab === "Invoices" ? "Invoices" : "Payments"}`}
        >
          <Filter
            setFilterUrl={setFilterUrl}
            filterData={filterData}
            onFilterChange={handleFilterChange}
            activeTab={activeTab}
            getUserInvoices={getUserInvoices}
            getUserPayments={getUserPayments}
            userId={Number(userId)}
          />
        </Modal>
        <div className={Styles.searchContainer}>
          <Search
            onChange={handleSearchChange}
            value={searchQuery}
            placeholder={`Search ${
              activeTab === "Invoices" ? "Invoices.." : "Payments.."
            }`}
          />
        </div>
        <UserDetailsTabs />

        {activeTab === "Invoices" ? <InvoiceTab /> : <PaymentTab />}
      </div>
    </Container>
  );
};

export default UserDetails;
