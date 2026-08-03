import { COLUMNS } from "../../constants/columns";
import type { TableRowItem } from "../../types";

type TableRow = {
  data : TableRowItem;
}

export const TableRow = ({ data }: TableRow) => {
    return (
        <tr>
            {COLUMNS.map((column) => {
              const cellValue = column.dataIndex ? data[column.dataIndex] : "";
              return (
                <td key={column.dataIndex}>
                  {cellValue}
                </td>
              );
            })}
        </tr>
    );
};
