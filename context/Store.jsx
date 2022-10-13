import React from 'react';
import Cookies from 'js-cookie';
import {createContext, useReducer} from 'react';

export const Store = createContext(); 



const initialState = {
    darkMode: Cookies.get('darkMode') === 'ON'? true : false,
    cart:{
        // JSON.parse convert Cookies.get(cartItems) to js obj
        cartItems: Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [],
        shippingAddress: Cookies.get('shippingAddress') ? JSON.parse(Cookies.get('shippingAddress')) : {},
        paymentMethod: Cookies.get('shippingAddress') ? Cookies.get('paymentMethod'): '',
    },
    userInfo: Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null,
};



function reducer(state, action){
    switch(action.type){
        case 'DARK_MODE_ON':
            return {...state, darkMode: true};
        
        case 'DARK_MODE_OFF':
            return {...state, darkMode: false};

        case 'CART_ADD_ITEM':{
            const newItem = action.payload;
            const existingItem = state.cart.cartItems.find((item) => item._key === newItem._key)
            
            const cartItems = existingItem ? state.cart.cartItems.map((item) =>item._key === existingItem._key ? newItem: item
            ): [...state.cart.cartItems, newItem];            
            // JSON.stringify convert js to text cos cookies can only read text not js obj
            Cookies.set('cartItems', JSON.stringify(cartItems))
            return {...state, cart: {...state.cart, cartItems}} 
        }

        case 'CART_REMOVE_ITEM':{
            const cartItems = state.cart.cartItems.filter((item) => item._key !== action.payload._key);
            Cookies.set('cartItems', JSON.stringify(cartItems));
            return {...state, cart: {...state.cart, cartItems}}
        }

        case 'CART_CLEAR': 
        return {...state, cart:{...state.cart, cartItems:[]}}

        case 'SAVE_SHIPPING_ADDRESS':
            return {...state, cart: {...state.cart, shippingAddress:action.payload},};

        case 'SAVE_PAYMENT_METHOD':
            return {...state, cart: {...state.cart, paymentMethod:action.payload},};

        case 'USER_LOGIN':
            return{...state, userInfo: action.payload}

        case 'USER_LOGOUT':
            return{...state, userInfo: null, cartItems: [], shippingAddress:{}}
        
        default:
            return state;
    }
}

export function StoreProvider({children}){
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch};
    return(
        <Store.Provider value={value}>
            {children}
        </Store.Provider>
    )
}