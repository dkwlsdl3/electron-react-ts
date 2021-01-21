import request from 'request';

export const get = async (id: string, prodNum: string[]): Promise<string[][]> => {
    const results = [];
    for (let i = 0; i < prodNum.length; i++) {
        const r = await fetch(id, prodNum[i]);
        results.push(r);
    }
    return results;
};

const fetch = (id: string, prodNum: string): Promise<string[]> => {
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
