import React from "react";
import Styles from "./Table.module.css";

export interface Column<T> {
  key: string;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <div className={Styles.tableWrapper}>
      <table className={Styles.table}>
        <thead>
          <tr>
            <th>Sl No.</th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={Styles[`align-${col.align ?? "center"}`]}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}.</td>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={Styles[`align-${col.align ?? "center"}`]}
                >
                  {col.render
                    ? col.render(row[col.key as keyof T], row, index)
                    : (row[col.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
