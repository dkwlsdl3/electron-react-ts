import React, { useCallback, useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { CSVDownBtn, Input, SearchBtn, Table, TextArea } from '../components';
import { getKeyword, getAdditionalInfo } from '../services/service';
import { saveCSVFile } from '../services/remote';

export interface KeywordData {
    relKeyword: string;
    monthlyPcQcCnt: number | string;
    monthlyMobileQcCnt: number | string;
    monthlyAvePcClkCnt: number | string;
    monthlyAveMobileClkCnt: number | string;
    monthlyAvePcCtr: number | string;
    monthlyAveMobileCtr: number | string;
    plAvgDepth: number | string;
    compIdx: string;
    isSword: boolean;
    sCount: string;
    category: string;
}

const Keyword: React.FunctionComponent = () => {
    const [id, setId] = useState<string>('');
    const [pw, setPw] = useState<string>('');
    const [keyword, setKeyword] = useState<string[]>([]);
    const [data, setData] = useState<KeywordData[]>([]);
    const [pcFilter, setPcFilter] = useState<number>(0);
    const [mobileFilter, setMobileFilter] = useState<number>(0);
    const tEl = useRef<HTMLTableElement>(null);

    const handleIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setId(e.target.value);
    }, []);
    const handlePwChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPw(e.target.value);
    }, []);
    const handleKeyWordChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setKeyword(e.target.value.replaceAll(' ', '\n').split('\n'));
    }, []);
    const handlePcFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPcFilter(parseInt(e.target.value));
    }, []);
    const handleMobileFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMobileFilter(parseInt(e.target.value));
    }, []);
    const handleClick = useCallback(async () => {
        setData([]);
        const tmp = await getKeyword(id, pw, keyword);
        const res = tmp.filter((v) => {
            const pcCnt = typeof v.monthlyPcQcCnt === 'string' ? 1 : v.monthlyPcQcCnt;
            const mobileCnt = typeof v.monthlyMobileQcCnt === 'string' ? 1 : v.monthlyMobileQcCnt;
            return pcCnt >= pcFilter && mobileCnt >= mobileFilter;
        });
        setData(res);
    }, [id, pw, keyword, pcFilter, mobileFilter]);
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
            saveCSVFile(`${moment().format('YYMMDD')}_${keyword.join('-')}.csv`, res.join('\n'));
        }
    }, [keyword]);

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
                <TextArea placeholder="키워드 입력(최대 5개)" value={keyword.join('\n')} onChange={handleKeyWordChange} />
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
                <>
                    <CSVDownBtn handleClick={handleCSVdownClick} />
                    <div className="py-3">
                        처리종료 예상 시각{' '}
                        {moment()
                            .add(data.length + 1, 's')
                            .format('YYYY-MM-DD hh:mm:ss')}
                    </div>
                    <Table elementRef={tEl} headers={headers}>
                        <Rows data={data} />
                    </Table>
                </>
            )}
        </>
    );
};

const Rows = ({ data }: { data: KeywordData[] }) => {
    const rows = data.map((v, i) => {
        const [rowData, setRowData] = useState<KeywordData>(v);

        useEffect(() => {
            const t = setTimeout(async () => {
                const tmp = await getAdditionalInfo(v.relKeyword);
                setRowData({ ...rowData, ...tmp });
            }, i * 1000);
            return () => {
                clearTimeout(t);
            };
        }, []);

        return (
            <tr key={i} className="hover:bg-gray-100 border-b border-gray-200 py-10">
                <td className="px-4 py-4">{rowData.relKeyword}</td>
                <td className="px-4 py-4">{rowData.monthlyPcQcCnt}</td>
                <td className="px-4 py-4">{rowData.monthlyMobileQcCnt}</td>
                <td className="px-4 py-4">{rowData.isSword ? 'O' : 'X'}</td>
                <td className="px-4 py-4">{rowData.sCount}</td>
                <td className="px-4 py-4">{rowData.category}</td>
            </tr>
        );
    });

    return <>{rows}</>;
};

export default Keyword;
