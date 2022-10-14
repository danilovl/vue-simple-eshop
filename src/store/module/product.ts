import {reactive} from 'vue'
import {defineStore} from 'pinia'
import Axios from 'axios'
import type {AxiosResponse} from 'axios'
import type {ProductState} from '@/store/type/product'
import {ProductModel} from '@/model/product-model'
import {AlertModel} from '@/model/alert-model'
import AlertConstant from '@/constant/alert-constant'
import ApiConstant from '@/constant/api-constant'
import {useLoaderStore} from '@/store/module/loader'
import {useAlertStore} from '@/store/module/alert'

export const useProductStore = defineStore('product', () => {
    const loaderStore = useLoaderStore()
    const alertStore = useAlertStore()

    const state = reactive<ProductState>({
        product: null
    }) as ProductState

    const getProduct = (): ProductModel | null => {
        return state.product
    }

    const setProduct = (product: ProductModel): void => {
        state.product = product
    }

    const initializeProduct = async (productId: number): Promise<any> => {
        try {
            loaderStore.setLoading(true)

            const url = `${ApiConstant.PRODUCTS_URL}/${productId}`
            const response = await Axios.get(url)
                .then((response: AxiosResponse): AxiosResponse => {
                    loaderStore.setLoading(false)

                    return response
                })

            const product = new ProductModel(
                response.data.id,
                response.data.title,
                response.data.description,
                response.data.price,
                response.data.rating,
                response.data.ratingCount,
                response.data.image
            )

            setProduct(product)
        } catch (error: any) {
            const alert: AlertModel = new AlertModel(AlertConstant.ERROR, error.message)

            alertStore.addAlert(alert)
        }

        loaderStore.setLoading(false)
    }

    return {
        getProduct,
        setProduct,
        initializeProduct
    }
})
