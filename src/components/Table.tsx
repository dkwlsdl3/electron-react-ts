import React from 'react';

interface TableProps {
    headers: string[];
    elementRef?: React.RefObject<HTMLTableElement>;
}

const Table: React.FunctionComponent<TableProps> = ({ headers, children, elementRef }) => {
    const thead = headers.map((v, i) => (
        <th key={i} className="px-4 py-2 bg-gray-200">
            {v}
        </th>
    ));
    return (
        <table ref={elementRef} className="table-auto border-collapse w-full">
            <thead>
                <tr className="rounded-lg text-sm font-medium text-gray-700 text-left">{thead}</tr>
            </thead>
            <tbody>{children}</tbody>
        </table>
    );
};

export default Table;
