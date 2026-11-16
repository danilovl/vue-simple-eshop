const BASE_URL: string = import.meta.env.VITE_API_URL
    || `${window.location.protocol}//${window.location.hostname}:3500`

const PRODUCTS_URL = `${BASE_URL}/products`
const ORDERS_URL = `${BASE_URL}/orders`
const LOGIN_URL = `${BASE_URL}/login`
const VERIFY_TOKEN_URL = `${BASE_URL}/verify-token`

export default {
    BASE_URL,
    PRODUCTS_URL,
    ORDERS_URL,
    LOGIN_URL,
    VERIFY_TOKEN_URL
}
