import {computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import Axios from 'axios'
import {ProductModel} from '@/model/product-model'
import type {ProductsState} from '@/store/type/products'
import ApiConstant from '@/constant/api-constant'
import transFilter from '@/filter/trans-filter'
import {useLoaderStore} from '@/store/module/loader'
import {useAlertStore} from '@/store/module/alert'
import {useAuthStore} from '@/store/module/auth'

export const useProductsStore = defineStore('products', () => {
    const loaderStore = useLoaderStore()
    const alertStore = useAlertStore()
    const authStore = useAuthStore()

    const state = reactive<ProductsState>({
        currentPage: 1,
        pageSize: 12,
        totalVisible: 8,
        pages: {},
        serverPageCount: 0,
        searchTerm: '',
        totalCount: 0
    })

    // Only the response to the latest request is applied, so stale responses cannot overwrite newer ones.
    let requestId = 0

    const getState = (): ProductsState => state

    const getCurrentPage = (): number => state.currentPage

    const pageCount = (): number => state.serverPageCount

    const getSearchTerm = (): string => state.searchTerm

    const currentPageProducts = computed((): ProductModel[] => state.pages[state.currentPage] ?? [])

    const processedCurrentPageProducts = (): ProductModel[] => currentPageProducts.value

    const isProducts = (): boolean => currentPageProducts.value.length > 0

    function setTotalCount(count: number): void {
        state.totalCount = Number.isFinite(count) ? count : 0
        state.serverPageCount = Math.ceil(state.totalCount / state.pageSize)
    }

    function clearPages(): void {
        state.pages = {}
    }

    function buildPageUrl(page: number): string {
        const params = new URLSearchParams({
            _page: String(page),
            _limit: String(state.pageSize)
        })

        if (state.searchTerm !== '') {
            params.set('q', state.searchTerm)
        }

        return `${ApiConstant.PRODUCTS_URL}?${params.toString()}`
    }

    async function fetchPage(page: number): Promise<void> {
        const currentRequest = ++requestId

        try {
            const response = await loaderStore.withLoading(() => Axios.get(buildPageUrl(page)))
            if (currentRequest !== requestId) {
                return
            }

            const data: unknown[] = Array.isArray(response.data) ? response.data : []
            setTotalCount(Number(response.headers['x-total-count'] ?? data.length))
            state.pages[page] = data.map(item => ProductModel.fromApi(item))
        } catch (error) {
            if (currentRequest === requestId) {
                alertStore.addError(error)
            }
        }
    }

    const setCurrentPage = (page: number): void => {
        state.currentPage = page

        if (!state.pages[page]) {
            void fetchPage(page)
        }
    }

    const getData = async (): Promise<void> => {
        await fetchPage(state.currentPage)
    }

    const reloadCurrentPage = async (): Promise<void> => {
        clearPages()
        await fetchPage(state.currentPage)

        if (state.currentPage > 1 && state.currentPage > state.serverPageCount) {
            state.currentPage = Math.max(1, state.serverPageCount)
            await fetchPage(state.currentPage)
        }
    }

    const addProduct = async (product: ProductModel): Promise<boolean> => {
        try {
            const {id: _id, ...payload} = product
            await loaderStore.withLoading(
                () => authStore.authenticatedAxios().post(ApiConstant.PRODUCTS_URL, payload)
            )

            alertStore.addSuccess(transFilter('alert.product_has_been_added'))
        } catch (error) {
            alertStore.addError(error)

            return false
        }

        await reloadCurrentPage()

        return true
    }

    const removeProduct = async (product: ProductModel): Promise<boolean> => {
        try {
            await loaderStore.withLoading(
                () => authStore.authenticatedAxios().delete(`${ApiConstant.PRODUCTS_URL}/${product.id}`)
            )

            alertStore.addSuccess(transFilter('alert.product_has_been_removed'))
        } catch (error) {
            alertStore.addError(error)

            return false
        }

        await reloadCurrentPage()

        return true
    }

    function updateProductState(product: ProductModel): void {
        Object.values(state.pages).forEach((products: ProductModel[]): void => {
            const index = products.findIndex((item: ProductModel): boolean => item.id === product.id)
            if (index > -1) {
                products[index] = product
            }
        })
    }

    const updateProduct = async (product: ProductModel): Promise<boolean> => {
        try {
            const response = await loaderStore.withLoading(
                () => authStore.authenticatedAxios().put(`${ApiConstant.PRODUCTS_URL}/${product.id}`, product)
            )

            updateProductState(ProductModel.fromApi(response.data ?? product))
            alertStore.addSuccess(transFilter('alert.product_has_been_updated'))

            return true
        } catch (error) {
            alertStore.addError(error)

            return false
        }
    }

    const setSearchTerm = async (searchTerm: string): Promise<void> => {
        const normalized = searchTerm.trim()
        if (normalized === state.searchTerm) {
            return
        }

        clearPages()
        state.searchTerm = normalized
        state.currentPage = 1
        await fetchPage(1)
    }

    const getProduct = async (id: number): Promise<ProductModel | null> => {
        try {
            const response = await loaderStore.withLoading(() => Axios.get(`${ApiConstant.PRODUCTS_URL}/${id}`))

            return ProductModel.fromApi(response.data)
        } catch (error) {
            alertStore.addError(error)

            return null
        }
    }

    return {
        currentPageProducts,
        getState,
        getData,
        getCurrentPage,
        processedCurrentPageProducts,
        pageCount,
        getSearchTerm,
        setSearchTerm,
        getProduct,
        setCurrentPage,
        removeProduct,
        addProduct,
        updateProduct,
        isProducts
    }
})
