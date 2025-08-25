import { useEffect, useRef } from "react";
import Container from "../../components/Container/Container";
import Styles from "./PrintPreview.module.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useAppContext from "../../context/useAppContext";
import { useNavigate } from "react-router-dom";
import {
  formatDateToDDMMYYYY,
  formatNumberIndian,
  showToast,
} from "../../utils/common";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import Button from "../../components/Button/Button";
import api from "../../utils/axios";

const PrintPreview = () => {
  const { printContext, handleLoading } = useAppContext();
  console.log(printContext);

  const navigate = useNavigate();

  const printRef = useRef(null);

  const breadCrumbData = [
    {
      label: "Users",
      href: "/users",
    },
    {
      label: printContext?.buyerDetails?.companyName,
      href: `/users/${printContext?.buyerDetails.id}`,
    },
    {
      label: "Print Preview",
    },
  ];

  const prepareCanvas = async (element) => {
    element.style.width = "800px"; // Force desktop width
    element.style.maxWidth = "unset";

    return await html2canvas(element, {
      scale: 2,
      useCORS: true,
      windowWidth: 800, // Force desktop layout even on mobile
    });
  };

  const sendEmailHandler = async () => {
    const element = printRef.current;

    if (!element) return;

    const originalWidth = element.style.width;

    const canvas = await prepareCanvas(element);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((blob) => resolve(blob!), "image/png")
    );

    const emailBody = `
      Dear ${printContext?.buyerDetails.companyName},<br><br>

      Thank you for placing your trust in <strong>${
        printContext?.companyDetails.companyName
      }</strong> for your printing requirements.<br><br>

      Please find attached the invoice <strong>(#${
        printContext?.invoice.invoiceNumber
      })</strong> for your recent order placed on <strong>${formatDateToDDMMYYYY(
      printContext?.invoice.invoiceDate
    )}</strong>.<br>
      A preview image of the invoice has also been included for your convenience.<br><br>

      <strong>📌 Invoice Number:</strong> ${
        printContext?.invoice.invoiceNumber
      }<br>
      <strong>📅 Date:</strong> ${formatDateToDDMMYYYY(
        printContext?.invoice.invoiceDate
      )}<br>
      <strong>💰 Total Amount:</strong> ₹${formatNumberIndian(
        printContext?.invoice.totalAfterTax
      )}/-<br><br>

      Should you require a physical copy, feel free to download or print the attached image.<br><br>

      We sincerely appreciate your business and look forward to serving you again.<br><br>

      Best regards,<br>
      <strong>${printContext?.companyDetails.companyName}</strong><br>
      📞 ${printContext?.companyDetails.contact}
    `;

    const formData = new FormData();
    formData.append(
      "image",
      blob,
      `${printContext?.invoice.invoiceNumber}.png`
    );
    formData.append("to", "sajahankhan115@gmail.com");
    formData.append(
      "subject",
      `GST Invoice #${printContext?.invoice.invoiceNumber} from Manisha Printers - Thank You for Your Business!`
    );

    formData.append("body", emailBody);

    try {
      handleLoading(true, "Sending email...");
      const result = await api.post("/send-email", formData);
      console.log("Email sent successfully:", result.data);
      showToast("success", "Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to send email!"
      );
    } finally {
      handleLoading(false);
    }

    element.style.width = originalWidth;
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;

    if (!element) return;
    handleLoading(true, "Sending email...");
    const originalWidth = element.style.width;
    const canvas = await prepareCanvas(element);
    const imgData = canvas.toDataURL("image/png");

    // Create A4 PDF (595.28 x 841.89 pt at 72dpi = 794 x 1123 px at 96dpi)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4", // 595 x 842 points (~794 x 1123 px)
    });

    const pageWidth = pdf.internal.pageSize.getWidth();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save(`${printContext?.invoice.invoiceNumber}.pdf`);

    // Revert width back to original
    element.style.width = originalWidth;
    handleLoading(false);
  };

  useEffect(() => {
    if (!printContext) {
      navigate("/users");
    }
  });
  return (
    <Container>
      <BreadCrumb items={breadCrumbData} />
      <div
        ref={printRef}
        style={{ backgroundColor: "white", padding: "0.5rem" }}
      >
        <div className={Styles.invoice}>
          <h3 className={Styles.center}>Tax Invoice</h3>
          <h1 className={`${Styles.center} ${Styles.bold}`}>
            {printContext?.companyDetails.companyName}
          </h1>
          <p className={Styles.center}>
            <b>Deals: {printContext?.companyDetails.dealsIn}</b>
          </p>
          <p className={Styles.center}>
            {printContext?.companyDetails.address}
          </p>
          <p className={Styles.center}>
            Ph: +91 {printContext?.companyDetails.contact}, Email:{" "}
            {printContext?.companyDetails.email}
          </p>

          <div className={Styles.infoRow}>
            <div>GSTIN: {printContext?.companyDetails.gstIn}</div>
            <div>STATE: {printContext?.companyDetails.state.toUpperCase()}</div>
            <div>CODE: {printContext?.companyDetails.stateCode}</div>
          </div>

          <div className={Styles.buyerInfo}>
            <div className={Styles.buyerDetails}>
              <div className={Styles.buyer}>
                <p>Buyer : </p>
                <div className={Styles.companyName}>
                  <p>{printContext?.buyerDetails.companyName}</p>
                  <p>{printContext?.buyerDetails.address}</p>
                </div>
              </div>
              <p>Ph : +91 {printContext?.buyerDetails.contact}</p>
              <p>State : {printContext?.buyerDetails.state}</p>
              <p>Code : {printContext?.buyerDetails.stateCode}</p>
              <p>GSTIN : {printContext?.buyerDetails.gstIn}</p>
            </div>
            <div>
              <p>Invoice No. : {printContext?.invoice.invoiceNumber}</p>
              <p>
                Date : {formatDateToDDMMYYYY(printContext?.invoice.invoiceDate)}
              </p>

              <p>Delivery Date : </p>
            </div>
          </div>

          <table className={Styles.invoiceTable}>
            <thead>
              <tr>
                <th>Sl no.</th>
                <th>Description</th>
                <th>HSN</th>
                <th>Rate</th>
                <th>Quantity</th>
                <th className={Styles.netAmount}>Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {printContext?.invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}.</td>
                  <td>{item.description}</td>
                  <td>{item.hsnCode}</td>
                  <td>{formatNumberIndian(item.rate)}</td>
                  <td>{formatNumberIndian(item.quantity)}</td>
                  <td className={Styles.netAmount}>
                    {formatNumberIndian(item.netAmount)}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  Total
                </td>
                <td style={{ fontWeight: "bold" }} className={Styles.netAmount}>
                  {formatNumberIndian(printContext?.invoice.totalBeforeTax)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className={Styles.footer}>
            <div className={Styles.bankDetails}>
              <p>Our Bank Details</p>
              <p>
                A/c Name :{" "}
                {printContext?.companyDetails.bankDetails.accountName.toUpperCase()}
              </p>
              <p>
                A/c No. :{" "}
                {printContext?.companyDetails.bankDetails.accountNumber}
              </p>
              <p>
                IFSC No. :{" "}
                {printContext?.companyDetails.bankDetails.ifsc.toUpperCase()}
              </p>
              <p>
                Bank :{" "}
                {printContext?.companyDetails.bankDetails.bankName.toUpperCase()}
              </p>
              <p>
                Branch :{" "}
                {printContext?.companyDetails.bankDetails.branch.toUpperCase()}
              </p>
            </div>

            <table className={Styles.summaryTable}>
              <thead>
                <tr>
                  <th>SUMMERY</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Shipping & Packaging</td>
                  <td>{printContext?.invoice.shippingCharges}</td>
                </tr>
                <tr>
                  <td>CGST</td>
                  <td>{formatNumberIndian(printContext?.invoice.cgst)}</td>
                </tr>
                <tr>
                  <td>SGST</td>
                  <td>{formatNumberIndian(printContext?.invoice.sgst)}</td>
                </tr>
                <tr>
                  <td>IGST</td>
                  <td>{formatNumberIndian(printContext?.invoice.igst)}</td>
                </tr>
                <tr>
                  <td>Round off.</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Total Amount</td>
                  <td>
                    {formatNumberIndian(printContext?.invoice.totalAfterTax)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={Styles.bottomRow}>
            <div className={Styles.amountWords}>
              Amount in Words: {printContext?.invoice.amountInWords}
            </div>
            <div className={Styles.signature}>
              For Manisha Printers
              <br />
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>
      <div className={Styles.download}>
        <Button
          title="Download"
          variant="Success"
          onClick={handleDownloadPdf}
        />
        <Button
          title="Send Email"
          variant="Primary"
          onClick={sendEmailHandler}
        />
      </div>
    </Container>
  );
};

export default PrintPreview;
