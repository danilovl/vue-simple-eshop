import {computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import Axios from 'axios'
import type {ProductState} from '@/store/type/product'
import {ProductModel} from '@/model/product-model'
import ApiConstant from '@/constant/api-constant'
import {useLoaderStore} from '@/store/module/loader'
import {useAlertStore} from '@/store/module/alert'

export const useProductStore = defineStore('product', () => {
    const loaderStore = useLoaderStore()
    const alertStore = useAlertStore()

    const state = reactive<ProductState>({
        product: null
    })

    let requestId = 0

    const product = computed((): ProductModel | null => state.product)

    const getProduct = (): ProductModel | null => state.product

    const setProduct = (product: ProductModel | null): void => {
        state.product = product
    }

    const initializeProduct = async (productId: number): Promise<void> => {
        const currentRequest = ++requestId
        setProduct(null)

        try {
            const response = await loaderStore.withLoading(
                () => Axios.get(`${ApiConstant.PRODUCTS_URL}/${productId}`)
            )

            if (currentRequest === requestId) {
                setProduct(ProductModel.fromApi(response.data))
            }
        } catch (error) {
            if (currentRequest === requestId) {
                alertStore.addError(error)
            }
        }
    }

    return {
        product,
        getProduct,
        setProduct,
        initializeProduct
    }
})
