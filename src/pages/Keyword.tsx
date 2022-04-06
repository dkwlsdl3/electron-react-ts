import React, { useCallback, useRef, useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { CSVDownBtn, DeleteBtn, Input, SearchBtn, Table, TextArea } from '../components';
import { getKeyword } from '../services/service';
import { saveCSVFile, saveExcelFile, showMessageBox } from '../services/remote';
import { AppDispatch, AppStore } from '../App';
import {
    KeywordData,
    setKeywordData,
    setKeywordMobileFilter,
    setKeywordPcFilter,
    setKeywordPw,
    setKeywordWords,
    setKeywrodId,
} from '../reducers';
import ExcelDownBtn from '../components/ExcelDownBtn';

const Keyword: React.FunctionComponent = () => {
    const dispatch = useContext(AppDispatch);
    const { keyword: state } = useContext(AppStore);
    const { id, pw, pcFilter, mobileFilter, words, data } = state;
    const tEl = useRef<HTMLTableElement>(null);
    const [timeoutList, setTimeoutList] = useState<number[]>([]);

    const handleIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setKeywrodId(e.target.value));
    }, []);
    const handlePwChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setKeywordPw(e.target.value));
    }, []);
    const handleWordChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setKeywordWords(e.target.value.replaceAll(' ', '\n').split('\n').slice(0, 5)));
    }, []);
    const handlePcFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setKeywordPcFilter(parseInt(e.target.value)));
    }, []);
    const handleMobileFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setKeywordMobileFilter(parseInt(e.target.value)));
    }, []);
    const handleClick = useCallback(() => {
        if (id && pw && words.length > 0) {
            getKeyword(state, dispatch).then((v) => setTimeoutList(v));
        } else {
            showMessageBox({ type: 'warning', message: '네이버 ID, 네이버 PW, 키워드를 입력하세요' });
        }
    }, [state]);
    const handleCSVdownClick = useCallback(() => {
        const res: string[] = [];
        if (tEl.current) {
            tEl.current.childNodes.forEach((v1) => {
                // v1 -> thead, tbody
                v1.childNodes.forEach((v2) => {
                    // v2 -> tr
                    const tr: string[] = [];
                    v2.childNodes.forEach((v3) => {
                        // v3 -> th, td
                        if (v3.textContent) {
                            tr.push(v3.textContent);
                        }
                    });
                    res.push(tr.join(','));
                });
            });
            saveCSVFile(`${moment().format('YYMMDD')}_${words.join('-')}.csv`, res.join('\n'));
        }
    }, [words]);
    const handleExceldownClick = useCallback(() => {
        const res: string[][] = [];
        if (tEl.current) {
            tEl.current.childNodes.forEach((v1) => {
                // v1 -> thead, tbody
                v1.childNodes.forEach((v2) => {
                    // v2 -> tr
                    const tr: string[] = [];
                    v2.childNodes.forEach((v3) => {
                        // v3 -> th, td
                        if (v3.textContent) {
                            tr.push(v3.textContent);
                        }
                    });
                    res.push(tr);
                });
            });
            saveExcelFile(`${moment().format('YYMMDD')}_${words.join('-')}.xlsx`, res);
        }
    }, [words]);
    const handleRemove = useCallback(() => {
        timeoutList.forEach((v) => window.clearTimeout(v));
        setTimeoutList([]);
        dispatch(setKeywordData([]));
    }, [timeoutList]);

    const headers = ['키워드', '월간 검색수(PC)', '월간 검색수(모바일)', '상품 키워드', '검색 상품수', '카테고리'];
    return (
        <>
            <div className="flex flex-col p-4 border border-gray-300 border-solid shadow-lg">
                <div className="flex items-end">
                    <div className="pr-2 w-1/2">
                        <Input placeholder="네이버 ID" value={id} onChange={handleIdChange} />
                    </div>
                    <div className="pl-2 w-1/2">
                        <Input type="password" placeholder="네이버 PW" value={pw} onChange={handlePwChange} />
                    </div>
                </div>
                <TextArea placeholder="키워드 입력(최대 5개)" value={words.join('\n')} onChange={handleWordChange} />
                <div className="pb-4">
                    <div>월간 검색수(PC) : {pcFilter}</div>
                    <input onChange={handlePcFilterChange} className="w-full" type="range" min="0" max="10000" step="10" value={pcFilter} />
                </div>
                <div className="pb-4">
                    <div>월간 검색수(모바일) : {mobileFilter}</div>
                    <input
                        onChange={handleMobileFilterChange}
                        className="w-full"
                        type="range"
                        min="0"
                        max="10000"
                        step="10"
                        value={mobileFilter}
                    />
                </div>
                <SearchBtn onClick={handleClick} />
            </div>
            {data.length > 0 && (
                <div className="py-8">
                    <DeleteBtn onClick={handleRemove} className="mb-2" />
                    <ExcelDownBtn onClick={handleExceldownClick} className="right-28" />
                    <CSVDownBtn onClick={handleCSVdownClick} />
                    <Table elementRef={tEl} headers={headers}>
                        <Rows data={data} />
                    </Table>
                </div>
            )}
        </>
    );
};

const Rows = ({ data }: { data: KeywordData[] }) => {
    const rows = data.map((v, i) => {
        return (
            <tr key={i} className="hover:bg-gray-100 border-b border-gray-200 py-10">
                <td className="px-4 py-4">{v.relKeyword}</td>
                <td className="px-4 py-4">{v.monthlyPcQcCnt}</td>
                <td className="px-4 py-4">{v.monthlyMobileQcCnt}</td>
                <td className="px-4 py-4">{v.isSword ? 'O' : 'X'}</td>
                <td className="px-4 py-4">{v.sCount}</td>
                <td className="px-4 py-4">{v.category}</td>
            </tr>
        );
    });

    return <>{rows}</>;
};

export default Keyword;
