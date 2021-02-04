export interface DeliveryState {
    id: string;
    prodNo: string[];
    data: string[][];
}
export const deliveryInitialState: DeliveryState = {
    id: '',
    prodNo: [],
    data: [],
};

export const SET_DELIVERY_ID = 'SET_DELIVERY_ID';
export function setDeliveryId(id: string) {
    return {
        type: SET_DELIVERY_ID,
        id,
    };
}

export const SET_DELIVERY_PROD_NO = 'SET_PROD_NO';
export function setDeliveryProdNo(prodNo: string[]) {
    return {
        type: SET_DELIVERY_PROD_NO,
        prodNo,
    };
}

export const SET_DELIVERY_DATA = 'SET_DELIVERY_DATA';
export function setDeliveryData(data: string[][]) {
    return {
        type: SET_DELIVERY_DATA,
        data,
    };
}

export const PUSH_DELIVERY_DATA = 'PUSH_DELIVERY_DATA';
export function pushDeliveryData(data: string[]) {
    return {
        type: PUSH_DELIVERY_DATA,
        data,
    };
}

export function deliveryReducer(state: DeliveryState, action: any) {
    switch (action.type) {
        case SET_DELIVERY_ID:
            return {
                ...state,
                id: action.id,
            };
        case SET_DELIVERY_PROD_NO:
            return {
                ...state,
                prodNo: action.prodNo,
            };
        case SET_DELIVERY_DATA:
            return {
                ...state,
                data: action.data,
            };
        case PUSH_DELIVERY_DATA:
            return {
                ...state,
                data: [...state.data, action.data],
            };
        default:
            return state;
    }
}
