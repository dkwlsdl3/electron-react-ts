import React, { useCallback, useContext } from 'react';
import { CSVDownBtn, DeleteBtn, Input, SearchBtn, Table, TextArea } from '../components';
import { getDelivery } from '../services/service';
import moment from 'moment';
import { shell } from 'electron';
import { saveCSVFile, showMessageBox } from '../services/remote';
import { AppDispatch, AppStore } from '../App';
import { setDeliveryData, setDeliveryId, setDeliveryProdNo } from '../reducers/delivery';

const Delivery = () => {
    const dispatch = useContext(AppDispatch);
    const { delivery: state } = useContext(AppStore);
    const { id, prodNo, data } = state;
    const headers = ['상품번호', '1일 이내', '2일 이내', '3일 이내', '4일 이상', '합계', '상품페이지'];

    const handleIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setDeliveryId(e.target.value));
    }, []);
    const handleProdNoChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setDeliveryProdNo(e.target.value.replaceAll(' ', '\n').split('\n')));
    }, []);
    const handleClick = useCallback(() => {
        if (id && prodNo.length > 0) {
            getDelivery(state, dispatch);
        } else {
            showMessageBox({ type: 'warning', message: '판매자 ID와 상품번호를 입력하세요' });
        }
    }, [state]);
    const handleCSVdownClick = useCallback(() => {
        const res: string[] = [headers.join(',')];
        data.forEach((v) => {
            res.push(v.join(','));
        });
        saveCSVFile(`${moment().format('YYMMDD')}_${id}.csv`, res.join('\n'));
    }, [data]);
    const handleRemove = useCallback(() => {
        dispatch(setDeliveryData([]));
    }, []);
    return (
        <>
            <div className="flex flex-col border border-gray-300 border-solid p-4 shadow-lg">
                <Input placeholder="판매자 ID" value={id} onChange={handleIdChange} />
                <TextArea placeholder="상품번호" value={prodNo.join('\n')} onChange={handleProdNoChange} />
                <SearchBtn onClick={handleClick} />
            </div>
            {data.length > 0 && (
                <div className="py-8">
                    <DeleteBtn onClick={handleRemove} className="mb-2" />
                    <CSVDownBtn onClick={handleCSVdownClick} />
                    <Table headers={headers}>{<Rows data={data} />}</Table>
                </div>
            )}
        </>
    );
};

const Rows = ({ data }: { data: string[][] }) => {
    const rows = data.map((v, i) => {
        const td = v.slice(1, -1).map((val, j) => (
            <td className="px-4 py-4" key={j}>
                {val}
            </td>
        ));
        const handleSiteLinkClick = () => shell.openExternal(v.slice(-1)[0]);

        return (
            <tr className="hover:bg-gray-100 border-b border-gray-200 py-10" key={i}>
                <td className="px-4 py-4">{v[0]}</td>
                {td}
                <td className="px-4 py-4">
                    <button
                        className="bg-transparent font-bold rounded hover:bg-green-500 hover:text-white py-2 px-6 inline-flex items-center"
                        onClick={handleSiteLinkClick}
                    >
                        <i className="fas fa-search"></i>
                    </button>
                </td>
            </tr>
        );
    });

    return <>{rows}</>;
};

export default Delivery;
