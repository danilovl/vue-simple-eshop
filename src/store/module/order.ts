import {reactive} from 'vue'
import {defineStore} from 'pinia'
import Axios from 'axios'
import type {AxiosResponse} from 'axios'
import type {OrderModel} from '@/model/order-model'
import type {OrderState} from '@/store/type/order'
import {AlertModel} from '@/model/alert-model'
import AlertConstant from '@/constant/alert-constant'
import ApiConstant from '@/constant/api-constant'
import {useAuthStore} from '@/store/module/auth'
import {useLoaderStore} from '@/store/module/loader'
import {useAlertStore} from '@/store/module/alert'
import {useCartStore} from '@/store/module/cart'

export const useOrderStore = defineStore('order', () => {
    const authStore = useAuthStore()
    const loaderStore = useLoaderStore()
    const alertStore = useAlertStore()
    const cartStore = useCartStore()

    const state = reactive<OrderState>({
        orders: []
    }) as OrderState

    function setOrders(data: any): void {
        state.orders = data
    }

    const changeOrderProcessed = (order: OrderModel): void => {
        order.processed = order.processed === null || !order.processed
    }

    const loadOrders = async (): Promise<any> => {
        loaderStore.setLoading(true)

        const data: any = await authStore.authenticatedAxios()
            .get(ApiConstant.ORDERS_URL)
            .then((response: AxiosResponse): AxiosResponse => {
                loaderStore.setLoading(false)

                return response.data
            })

        setOrders(data)
    }
    const getOrders = (): OrderModel[] => {
        return state.orders
    }

    const updateOrder = async (order: OrderModel): Promise<any> => {
        changeOrderProcessed(order)

        await authStore.authenticatedAxios().put(`${ApiConstant.ORDERS_URL}/${order.id}`, order)
    }

    const storeOrder = async (order: OrderModel): Promise<any> => {
        try {
            loaderStore.setLoading(true)

            order.basket = cartStore.getLines()

            const response = await Axios.post(ApiConstant.ORDERS_URL, order)
                .then((response: AxiosResponse): AxiosResponse => {
                    loaderStore.setLoading(false)

                    return response
                })

            return response.data.id
        } catch (error: any) {
            alertStore.addAlert(new AlertModel(AlertConstant.ERROR, error.message))
        }
    }

    return {
        getOrders,
        loadOrders,
        updateOrder,
        storeOrder,
        changeOrderProcessed
    }
})
