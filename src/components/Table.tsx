import React from 'react';
import { shell } from 'electron';

interface TableProps {
    rows: string[][];
}

export const Table: React.FC<TableProps> = (props) => {
    return (
        <div className="mx-auto w-11/12 overflow-x-auto">
            <table className="table-auto border-collapse  w-full">
                <thead>
                    <tr className="rounded-lg text-sm font-medium text-gray-700 text-left">
                        <th className="px-4 py-2 bg-gray-200">상품번호</th>
                        <th className="px-4 py-2 bg-gray-200">1일 이내</th>
                        <th className="px-4 py-2 bg-gray-200">2일 이내</th>
                        <th className="px-4 py-2 bg-gray-200">3일 이내</th>
                        <th className="px-4 py-2 bg-gray-200">4일 이상</th>
                        <th className="px-4 py-2 bg-gray-200">합계</th>
                        <th className="px-4 py-2 bg-gray-200">상품페이지</th>
                    </tr>
                </thead>
                <tbody>
                    {props.rows.map((v, i) => {
                        const td = v.slice(1, -1);
                        return (
                            <tr className="hover:bg-gray-100 border-b border-gray-200 py-10" key={i.toString()}>
                                <td className="px-4 py-4">{v[0]}</td>
                                {td.map((val, j) => (
                                    <td className="px-4 py-4" key={j.toString()}>
                                        {val}
                                    </td>
                                ))}
                                <td className="px-4 py-4">
                                    <button
                                        className="bg-transparent font-bold rounded hover:bg-green-500 hover:text-white py-2 px-6 inline-flex items-center"
                                        onClick={() => {
                                            shell.openExternal(v.slice(-1)[0]);
                                        }}
                                    >
                                        <i className="fas fa-search"></i>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
