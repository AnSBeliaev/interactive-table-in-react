import { TableRow } from "./components";
import { TableHead } from "./components";
import { COLUMNS } from "./constants/columns";
import type { ColumnItem, TableData, TableRowItem } from "./types";

type TableArgs = {
    data: TableData;
}

export const Table = ({ data }: TableArgs) => {
    return (
        <table>
            <thead>
                <tr>
                    {COLUMNS.map((headItem: ColumnItem) => {
                        return <TableHead key={headItem.dataIndex} item={headItem.title} />;
                    })}
                </tr>
            </thead>
            <tbody>
                {data.documents?.map((tableRowItem: TableRowItem) => {
                    return <TableRow key={tableRowItem.id} data={tableRowItem} />;
                })}
            </tbody>
        </table>
    );
};
