import request from 'request';
import { KeywordData } from '../pages/Keyword';

export const getDelivery = async (id: string, prodNum: string[]): Promise<string[][]> => {
    const results = [];
    for (let i = 0; i < prodNum.length; i++) {
        const r = await fetchDelivery(id, prodNum[i]);
        results.push(r);
    }
    return results;
};

const fetchDelivery = (id: string, prodNum: string): Promise<string[]> => {
    const uri = `https://m.smartstore.naver.com/${id}/products/${prodNum}`;
    const options = {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        },
    };
    return new Promise((resolve) => {
        request.get(uri, options, (err, response, body) => {
            if (!err && response.statusCode.toString() === '200') {
                let str = body.match(/평균.*의 배송기간/g)[0];
                str = str.replace(/<[\w\-"/\s_!=:%]+>/g, '');
                const array = [...str.match(/\d+일 이[내|상]\d+건/g)];
                const result = array.map((v) => v.split(' ')[1].slice(2, -1));
                resolve([prodNum, ...result, result.reduce((a, b) => parseInt(a) + parseInt(b), 0).toString(), uri]);
            }
        });
    });
};

export const getKeyword = async (id: string, pw: string, keyword: string[]): Promise<KeywordData[]> => {
    const key = encodeURIComponent(keyword.join(','));
    const options = {
        uri: `https://manage.searchad.naver.com/keywordstool?format=json&hintKeywords=${key}&includeHintKeywords=0&showDetail=1`,
        headers: { authorization: `Bearer ${await getNaverADAuthToken(id, pw)}` },
    };

    return new Promise((resolve) => {
        request.get(options, (err, response, body) => {
            if (!err && response.statusCode === 200) {
                resolve(JSON.parse(body)['keywordList']);
            }
        });
    });
};

export const getNaverADAuthToken = async (id: string, pw: string): Promise<string[][]> => {
    const options = {
        uri: `https://searchad.naver.com/auth/login`,
        method: 'POST',
        body: { loginId: id, loginPwd: pw },
        json: true,
    };

    return new Promise((resolve) => {
        request.post(options, (err, response, body) => {
            if (!err && response.statusCode === 200 && body.token) {
                resolve(body.token);
            }
        });
    });
};

export const getAdditionalInfo = async (key: string) => {
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

    return { isSword, sCount, category };
};

const getSwordCount = async (key: string): Promise<[boolean, string]> => {
    return new Promise((resolve, reject) => {
        try {
            request.get(`https://search.naver.com/search.naver?query=${key}`, (err, response, body) => {
                if (!err && response.statusCode === 200) {
                    const text = body.replace(/ /gi, '').replace(/\n/gi, '').replace(/\t/gi, '');
                    const isSword = text.match(/네이버쇼핑/g)?.length > 0;
                    let sCount = '-';
                    const match = text.match(/쇼핑더보기<emclass="total_num_text">\(([\d,]*)\)/);
                    if (isSword && match && match.length > 0) {
                        sCount = match[1];
                    }
                    resolve([isSword, sCount]);
                } else {
                    reject(err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getCategory = async (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            request.get(`https://search.shopping.naver.com/search/all?query=${key}`, (err, response, body) => {
                const category: Array<string> = [];
                let res = '-';
                if (!err && response.statusCode === 200) {
                    let dp = new window.DOMParser();
                    const re = /<li class="basicList_item__2XT81">.*<\/li>/;
                    const sBody = body.slice(0, body.length / 5);
                    const match = sBody.match(re);
                    const m = match && match.length > 0 ? match[0] : '<div></div>';
                    let doc = dp.parseFromString(m, 'text/html');
                    const tags = doc.querySelectorAll('li.basicList_item__2XT81 div.basicList_depth__2QIie');
                    const childNodes = tags.length > 0 ? tags[0].childNodes : [];
                    childNodes.forEach((v: any) => {
                        category.push(v.text);
                    });
                    res = category.join('>');
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};
