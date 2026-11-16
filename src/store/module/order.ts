import {computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import Axios from 'axios'
import type {OrderModel} from '@/model/order-model'
import type {OrderState} from '@/store/type/order'
import ApiConstant from '@/constant/api-constant'
import transFilter from '@/filter/trans-filter'
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
    })

    const orders = computed((): OrderModel[] => state.orders)

    function setOrders(data: OrderModel[]): void {
        state.orders = data
    }

    const getOrders = (): OrderModel[] => state.orders

    const loadOrders = async (): Promise<void> => {
        try {
            const response = await loaderStore.withLoading(
                () => authStore.authenticatedAxios().get<OrderModel[]>(ApiConstant.ORDERS_URL)
            )
            setOrders(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            alertStore.addError(error)
        }
    }

    const updateOrder = async (order: OrderModel): Promise<void> => {
        const processed = !order.processed

        try {
            await loaderStore.withLoading(
                () => authStore.authenticatedAxios().put(`${ApiConstant.ORDERS_URL}/${order.id}`, {...order, processed})
            )
            order.processed = processed
        } catch (error) {
            alertStore.addError(error)
        }
    }

    const storeOrder = async (order: OrderModel): Promise<number | null> => {
        try {
            order.basket = cartStore.getLinesSnapshot()

            const response = await loaderStore.withLoading(
                () => Axios.post(ApiConstant.ORDERS_URL, order)
            )

            return response.data?.id ?? null
        } catch {
            alertStore.addError(transFilter('alert.order_failed'))

            return null
        }
    }

    return {
        orders,
        getOrders,
        loadOrders,
        updateOrder,
        storeOrder
    }
})
