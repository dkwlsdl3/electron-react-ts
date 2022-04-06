/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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

export interface KeywordState {
    id: string;
    pw: string;
    words: string[];
    data: KeywordData[];
    pcFilter: number;
    mobileFilter: number;
}
export const keywordInitialState: KeywordState = {
    id: '',
    pw: '',
    words: [],
    data: [],
    pcFilter: 0,
    mobileFilter: 0,
};

export const SET_KEYWORD_ID = 'SET_KEYWORD_ID';
export function setKeywrodId(id: string) {
    return {
        type: SET_KEYWORD_ID,
        id,
    };
}

export const SET_KEYWORD_PW = 'SET_KEYWORD_PW';
export function setKeywordPw(pw: string) {
    return {
        type: SET_KEYWORD_PW,
        pw,
    };
}

export const SET_KEYWORD_PC_FILTER = 'SET_KEYWORD_PC_FILTER';
export function setKeywordPcFilter(pcFilter: number) {
    return {
        type: SET_KEYWORD_PC_FILTER,
        pcFilter,
    };
}

export const SET_KEYWORD_MOBILE_FILTER = 'SET_KEYWORD_MOBILE_FILTER';
export function setKeywordMobileFilter(mobileFilter: number) {
    return {
        type: SET_KEYWORD_MOBILE_FILTER,
        mobileFilter,
    };
}

export const SET_KEYWORD_WORDS = 'SET_KEYWORD_WORDS';
export function setKeywordWords(words: string[]) {
    return {
        type: SET_KEYWORD_WORDS,
        words,
    };
}

export const SET_KEYWORD_DATA = 'SET_KEYWORD_DATA';
export function setKeywordData(data: KeywordData[]) {
    return {
        type: SET_KEYWORD_DATA,
        data,
    };
}

export const PUSH_KEYWORD_DATA = 'PUSH_KEYWORD_DATA';
export function pushKeywordData(data: KeywordData) {
    return {
        type: PUSH_KEYWORD_DATA,
        data,
    };
}

export const BULK_PUSH_KEYWORD_DATA = 'BULK_PUSH_KEYWORD_DATA';
export function bulkPushKeywordData(data: KeywordData[]) {
    return {
        type: BULK_PUSH_KEYWORD_DATA,
        data,
    };
}

export const SET_KEYWORD_ADDITIONAL_DATA = 'SET_KEYWORD_ADDITIONAL_DATA';
export function setKeywordAdditionalData(index: number, additionalData: { isSword: boolean; sCount: string; category: string }) {
    return {
        type: SET_KEYWORD_ADDITIONAL_DATA,
        index,
        additionalData,
    };
}

export function keywordReducer(state: KeywordState, action: any): KeywordState {
    switch (action.type) {
        case SET_KEYWORD_ID: {
            return {
                ...state,
                id: action.id,
            };
        }
        case SET_KEYWORD_PW: {
            return {
                ...state,
                pw: action.pw,
            };
        }
        case SET_KEYWORD_PC_FILTER: {
            return {
                ...state,
                pcFilter: action.pcFilter,
            };
        }
        case SET_KEYWORD_MOBILE_FILTER: {
            return {
                ...state,
                mobileFilter: action.mobileFilter,
            };
        }
        case SET_KEYWORD_WORDS: {
            return {
                ...state,
                words: action.words,
            };
        }
        case SET_KEYWORD_DATA: {
            return {
                ...state,
                data: action.data,
            };
        }
        case PUSH_KEYWORD_DATA: {
            return {
                ...state,
                data: [...state.data, action.data],
            };
        }
        case BULK_PUSH_KEYWORD_DATA: {
            return {
                ...state,
                data: [...state.data, ...action.data],
            };
        }
        case SET_KEYWORD_ADDITIONAL_DATA: {
            if (state.data.length <= 0) {
                return state;
            }
            const newData = [...state.data];
            newData[action.index] = { ...state.data[action.index], ...action.additionalData };
            return {
                ...state,
                data: newData,
            };
        }
        default:
            return state;
    }
}
