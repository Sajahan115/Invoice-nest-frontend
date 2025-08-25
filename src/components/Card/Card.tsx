import { useEffect, useState } from "react";
import { formatDateToDDMMYYYY, formatNumberIndian } from "../../utils/common";
import Styles from "./Card.module.css";

interface userType {
  _id: number;
  name: string;
  totalBillAmount: number;
  totalPaymentAmount: number;
  lastInvoiceNumber: string;
  lastInvoiceAmount: number;
  lastInvoiceDate: string;
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
}

interface CardProps {
  user: userType;
  bgColor: string;
  onClick?: () => void;
}

const Card = ({ user, bgColor, onClick }: CardProps) => {
  const [balanceState, setBalanceState] = useState<"Advance" | "Remaining">(
    "Advance"
  );
  const [balanceStateAmount, setBalanceStateAmount] = useState<number>(0);

  const balanceStateHandler = () => {
    if (user?.totalBillAmount > user?.totalPaymentAmount) {
      setBalanceState("Remaining");
      setBalanceStateAmount(user?.totalBillAmount - user?.totalPaymentAmount);
    } else if (user?.totalBillAmount - user?.totalPaymentAmount === 0) {
      setBalanceState("Remaining");
      setBalanceStateAmount(0);
    } else {
      setBalanceState("Advance");
      setBalanceStateAmount(user?.totalPaymentAmount - user?.totalBillAmount);
    }
  };

  useEffect(() => {
    balanceStateHandler();
  }, [user]);
  return (
    <div
      className={Styles.card}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      <div className={Styles.header}>
        <h3>{user?.name.toUpperCase()}</h3>
      </div>
      <div className={Styles.content}>
        {/* Row 1 */}
        <div className={Styles.row}>
          {balanceStateAmount !== null && balanceStateAmount !== undefined ? (
            <div className={Styles.col}>
              <p>
                <b>{balanceState} -</b> Rs.
                {formatNumberIndian(balanceStateAmount) || 0}/-
              </p>
            </div>
          ) : (
            ""
          )}
          <div className={Styles.rightCol}>
            <div className={Styles.amountBlock}>
              <div className={Styles.inlineLabel}>
                <p className={Styles.label}>Last Payment -</p>
                <div className={Styles.amountDate}>
                  {user?.lastPaymentAmount ? (
                    <>
                      <p>Rs.{formatNumberIndian(user?.lastPaymentAmount)}/-</p>
                      <p className={Styles.date}>
                        on {formatDateToDDMMYYYY(user?.lastPaymentDate)}
                      </p>
                    </>
                  ) : (
                    <p>N/A</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className={Styles.row}>
          <div className={Styles.col}>
            <p>
              <b>Last Invoice</b> - {user?.lastInvoiceNumber || "N/A"}
            </p>
          </div>
          <div className={Styles.rightCol}>
            <div className={Styles.amountBlock}>
              <div className={Styles.inlineLabel}>
                <p className={Styles.label}>Last Invoice Amount -</p>
                <div className={Styles.amountDate}>
                  {user?.lastInvoiceAmount ? (
                    <>
                      <p>Rs.{formatNumberIndian(user?.lastInvoiceAmount)}/-</p>
                      <p className={Styles.date}>
                        on {formatDateToDDMMYYYY(user?.lastInvoiceDate)}
                      </p>
                    </>
                  ) : (
                    <p>N/A</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
