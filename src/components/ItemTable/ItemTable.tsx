import { formatNumberIndian } from "../../utils/common";
import Styles from "./ItemTable.module.css";

interface Item {
  description: string;
  hsnCode: string;
  rate: number;
  quantity: number;
  netAmount: number;
}
const ItemTable = ({ items }: { items: Item[] }) => {
  return (
    <div className={Styles.tableWrapper}>
      <table className={Styles.table}>
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>Description</th>
            <th>HSN Code</th>
            <th>Rate</th>
            <th>Quantity</th>
            <th>Net Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}.</td>
              <td>{item.description}</td>
              <td>{item.hsnCode}</td>
              <td>{formatNumberIndian(item.rate.toFixed(2))}</td>
              <td>{formatNumberIndian(item.quantity)}</td>
              <td>{formatNumberIndian(item.netAmount.toFixed(2))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
