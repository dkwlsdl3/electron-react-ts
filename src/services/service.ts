import request from 'request';
import { bulkPushKeywordData, DeliveryState, KeywordData, KeywordState, pushDeliveryData, setKeywordAdditionalData } from '../reducers';
import { showMessageBox } from './remote';

export async function getDelivery(state: DeliveryState, dispatch: React.Dispatch<any>): Promise<void> {
    for (const prodNo of state.prodNo) {
        try {
            const result = await getNumberOfDeliveies(state.id, prodNo);
            dispatch(pushDeliveryData(result));
        } catch (e) {
            showMessageBox({ type: 'error', message: String(e) });
        }
    }
}

function getNumberOfDeliveies(id: string, prodNo: string) {
    const uri = `https://m.smartstore.naver.com/${id}/products/${prodNo}`;
    const options = {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        },
    };

    return new Promise<string[]>((resolve, reject) => {
        request.get(uri, options, (err, response, body) => {
            if (!err && response.statusCode === 200) {
                let result: any[] = [];
                if (!body.match(/평균.*의 배송기간/g)) {
                    result = ['0', '0', '0', '0'];
                } else {
                    const qnty = body // 배송 건수
                        .match(/평균.*의 배송기간/g)[0]
                        .replace(/<[\w\-"/\s_!=:%]+>/g, '')
                        .match(/\d+일 이[내|상]\d+건/g);
                    while (qnty.length < 4) {
                        qnty.unshift('3일 이내0건');
                    }
                    result = [...qnty].map((v) => v.split(' ')[1].slice(2, -1));
                }
                const value = body // 상품 가격
                    .match(/상품 가격.*<span class="roADTmiskI">원<\/span>/g)[0]
                    .replace(/<[\w\-"/\s_!=:%]+>/g, '')
                    .replace(/\W/g, '');
                const product_name = body // 상품 이름
                    .match(/스토어찜하기.*건 리뷰/g)[0]
                    .replace(/<[\w\-"/\s_!=:%]+>/g, '')
                    .replace(/<.+>/g, '')
                    .replace(/스토어찜하기/g, '')
                    .replace(/(BEST)?(평점)?[\d,]+건 리뷰/g, '');
                const sum = result.reduce((a, b) => parseInt(a) + parseInt(b), 0);
                const total = parseInt(value) * sum;
                resolve([
                    prodNo,
                    product_name,
                    ...result,
                    sum.toString(),
                    value.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    uri,
                ]);
            } else if (err) {
                reject(err);
            } else {
                reject(body.title);
            }
        });
    });
}

export async function getKeyword(state: KeywordState, dispatch: React.Dispatch<any>): Promise<number[]> {
    let timeoutList: number[] = [];
    try {
        const key = encodeURIComponent(state.words.join(','));
        const token = await getNaverADAuthToken(state.id, state.pw);
        const keywordData = await getKeywordData(key, token);

        const filteredData = keywordData.filter((v) => {
            const pcCnt = typeof v.monthlyPcQcCnt === 'string' ? 1 : v.monthlyPcQcCnt;
            const mobileCnt = typeof v.monthlyMobileQcCnt === 'string' ? 1 : v.monthlyMobileQcCnt;
            return pcCnt >= state.pcFilter && mobileCnt >= state.mobileFilter;
        });

        dispatch(bulkPushKeywordData(filteredData));
        filteredData.forEach((v, i) => {
            const timeoutId = window.setTimeout(() => {
                getKeywordAdditionalInfo(v.relKeyword, state.data.length + i, dispatch);
            }, i * 1000);
            timeoutList.push(timeoutId);
        });
    } catch (e) {
        showMessageBox({ type: 'error', message: String(e) });
        timeoutList.forEach((v) => window.clearTimeout(v));
        timeoutList = [];
    }
    return timeoutList;
}

function getNaverADAuthToken(id: string, pw: string) {
    const options = {
        uri: `https://searchad.naver.com/auth/login`,
        method: 'POST',
        body: { loginId: id, loginPwd: pw },
        json: true,
    };

    return new Promise<string>((resolve, reject) => {
        request.post(options, (err, response, body) => {
            if (!err && response.statusCode === 200 && body.token) {
                resolve(body.token);
            } else if (err) {
                reject(err);
            } else {
                reject(body.title);
            }
        });
    });
}

function getKeywordData(key: string, token: string) {
    const options = {
        uri: `https://manage.searchad.naver.com/keywordstool?format=json&hintKeywords=${key}&includeHintKeywords=0&showDetail=1`,
        headers: { authorization: `Bearer ${token}` },
    };

    return new Promise<KeywordData[]>((resolve, reject) => {
        request.get(options, (err, response, body) => {
            if (!err && response.statusCode === 200) {
                resolve(JSON.parse(body)['keywordList']);
            } else if (err) {
                reject(err);
            } else {
                reject(body.title);
            }
        });
    });
}

export async function getKeywordAdditionalInfo(key: string, index: number, dispatch: React.Dispatch<any>): Promise<void> {
    const encodedKey = encodeURIComponent(key);
    let isSword = false,
        sCount = '-',
        category = '-';
    try {
        const r = await getSwordCount(encodedKey);
        isSword = r[0];
        sCount = r[1];
        if (r[0]) {
            category = await getCategory(encodedKey);
        }
    } catch (e) {
        console.log(e);
    }

    const result = { isSword, sCount, category };
    dispatch(setKeywordAdditionalData(index, result));
}

function getSwordCount(key: string) {
    return new Promise<[boolean, string]>((resolve, reject) => {
        try {
            request.get(`https://m.search.naver.com/search.naver?query=${key}`, (err, response, body) => {
                if (!err && response.statusCode === 200) {
                    const text = body.replace(/ /gi, '').replace(/\n/gi, '').replace(/\t/gi, '');
                    const isSword = text.match(/네이버쇼핑/g)?.length > 0;
                    let sCount = '-';
                    const match = text.match(/쇼핑더보기<emclass="total_num_count">\(([\d,]*)건\)/);
                    if (isSword && match && match.length > 0) {
                        sCount = match[1].replace(/,/g, '');
                    }
                    resolve([isSword, sCount]);
                } else if (err) {
                    reject(err);
                } else {
                    reject(body.title);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

function getCategory(key: string) {
    return new Promise<string>((resolve, reject) => {
        try {
            request.get(`https://search.shopping.naver.com/search/all?query=${key}`, (err, response, body) => {
                const category: Array<string> = [];
                let res = '-';
                if (!err && response.statusCode === 200) {
                    const dp = new window.DOMParser();
                    const re = /<li class="basicList_item__0T9JD">.*<\/li>/;
                    const match = body.match(re);
                    const m = match && match.length > 0 ? match[0] : '<div></div>';
                    const doc = dp.parseFromString(m, 'text/html');
                    const tags = doc.querySelectorAll('li.basicList_item__0T9JD div.basicList_depth__SbZWF');
                    const childNodes = tags.length > 0 ? tags[0].childNodes : [];
                    childNodes.forEach((v: any) => {
                        category.push(v.textContent);
                    });
                    res = category.join('>');
                    resolve(res);
                } else if (err) {
                    reject(err);
                } else {
                    reject(body.title);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}
