import React, { useState, useCallback } from 'react';
import { hot } from 'react-hot-loader';
import { get } from './service';
import { shell } from 'electron';

const App = () => {
    const [id, setId] = useState<string>('');
    const [prodNo, setProdNo] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setId(e.target.value);
    };
    const handleProdNoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProdNo(e.target.value.split('\n'));
    };

    const handleClick = useCallback(async () => {
        setResponse(await get(id, prodNo));
    }, [id, prodNo, response]);

    return (
        <div>
            <input type="text" value={id} onChange={handleIdChange} />
            <br />
            <textarea value={prodNo.join('\n')} onChange={handleProdNoChange} />
            <br />
            <button onClick={handleClick}>go</button>
            <br />
            {response.length >= 0 && <Table rows={response} />}
        </div>
    );
};

interface TableProps {
    rows: string[];
}

const Table = (props: TableProps) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>상품번호</th>
                    <th>1일 이내</th>
                    <th>2일 이내</th>
                    <th>3일 이내</th>
                    <th>4일 이상</th>
                    <th>합계</th>
                    <th>url</th>
                </tr>
            </thead>
            <tbody>
                {props.rows.map((v, i) => {
                    const content = v.split(',');
                    const td = content.slice(1, -1);
                    return (
                        <tr key={i.toString()}>
                            <td>{content[0]}</td>
                            {td.map((val, j) => (
                                <td key={j.toString()}>{val}</td>
                            ))}
                            <td>
                                <button
                                    onClick={() => {
                                        shell.openExternal(content.slice(-1)[0]);
                                    }}
                                >
                                    페이지
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default hot(module)(App);
