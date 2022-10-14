import {reactive} from 'vue'
import {defineStore} from 'pinia'
import Axios from 'axios'
import type {AxiosResponse} from 'axios'
import {ProductModel} from '@/model/product-model'
import type {ProductsState} from '@/store/type/products'
import {AlertModel} from '@/model/alert-model'
import AlertConstant from '@/constant/alert-constant'
import {PageModel} from '@/model/page-model'
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
        pageSize: 6,
        totalVisible: 8,
        pages: [],
        serverPageCount: 0,
        showSearch: false,
        searchTerm: '',
        totalCount: 0
    }) as ProductsState

    const getState = (): ProductsState => {
        return state
    }

    const getCurrentPage = (): number => {
        return state.currentPage
    }

    const pageCount = (): number => {
        return state.serverPageCount
    }

    const getSearchTerm = (): string => {
        return state.searchTerm
    }

    const processedCurrentPageProducts = (): ProductModel[] => {
        return state.pages[state.currentPage]
    }

    const isProducts = (): boolean => {
        return state.pages[state.currentPage] && state.pages[state.currentPage].length > 0
    }

    function setPageCount(count: number): void {
        state.serverPageCount = Math.ceil(Number(count) / state.pageSize)
    }

    function addPage(page: PageModel) {
        for (let i = 0; i < page.pageCount; i++) {
            state.pages[page.currentPage + i] = page.data.slice(i * state.pageSize, (i * state.pageSize) + state.pageSize)
        }
    }

    async function getPage(getPageCount = 1): Promise<any> {
        let url = `${ApiConstant.PRODUCTS_URL}?_page=${state.currentPage}` +
            `&_limit=${state.pageSize * getPageCount}`

        if (state.searchTerm !== '') {
            url += `&q=${state.searchTerm}`
        }

        loaderStore.setLoading(true)

        const response = await Axios.get(url)
            .then((response: AxiosResponse): AxiosResponse => {
                loaderStore.setLoading(false)

                return response
            })

        state.totalCount = Number(response.headers['x-total-count'])
        setPageCount(state.totalCount)

        const page = new PageModel(state.currentPage, getPageCount, response.data)
        addPage(page)
    }

    const setCurrentPage = (page: number): void => {
        state.currentPage = page

        if (!state.pages[page]) {
            getPage()
        }
    }

    const getData = async (): Promise<any> => {
        await getPage(1)
    }

    function clearPages(): void {
        state.pages = []
    }

    const addProduct = async (product: ProductModel): Promise<any> => {
        try {
            loaderStore.setLoading(true)

            await authStore.authenticatedAxios()
                .post(ApiConstant.PRODUCTS_URL, product)
                .then((response: AxiosResponse): AxiosResponse => {
                    loaderStore.setLoading(false)

                    return response.data
                })

            const alert = new AlertModel(AlertConstant.SUCCESS, transFilter('alert.product_has_been_added'))
            alertStore.addAlert(alert)

            if (state.pages[state.currentPage]) {
                state.pages[state.currentPage].unshift(product)
            }
        } catch (error: any) {
            const alert = new AlertModel(AlertConstant.ERROR, error.message)
            alertStore.addAlert(alert)

            loaderStore.setLoading(false)
        }
    }

    const removeProduct = async (product: ProductModel): Promise<any> => {
        loaderStore.setLoading(true)

        try {
            await authStore.authenticatedAxios()
                .delete(`${ApiConstant.PRODUCTS_URL}/${product.id}`)
                .then((): void => {
                    loaderStore.setLoading(false)
                })

            const alert = new AlertModel(AlertConstant.SUCCESS, transFilter('alert.product_has_been_removed'))
            alertStore.addAlert(alert)
        } catch (error: any) {
            const alert = new AlertModel(AlertConstant.ERROR, error.message)
            alertStore.addAlert(alert)

            loaderStore.setLoading(false)
        }

        clearPages()
        await getPage(1)
    }

    function updateProductState(product: ProductModel): void {
        Object.keys(state.pages).forEach((pageIndex: any): void => {
            const objects = state.pages[pageIndex]

            objects.forEach((key: any): void => {
                const p = objects[pageIndex]
                if (p && p.id === product.id) {
                    objects[key] = product
                }
            })
        })
    }

    const updateProduct = async (product: ProductModel): Promise<any> => {
        try {
            loaderStore.setLoading(true)

            await authStore.authenticatedAxios()
                .put(`${ApiConstant.PRODUCTS_URL}/${product.id}`, product)
                .then((): void => {
                    loaderStore.setLoading(false)
                })

            const alert = new AlertModel(AlertConstant.SUCCESS, transFilter('alert.product_has_been_updated'))
            alertStore.addAlert(alert)
        } catch (error: any) {
            const alert = new AlertModel(AlertConstant.ERROR, error.message)
            alertStore.addAlert(alert)

            loaderStore.setLoading(false)
        }

        updateProductState(product)
    }

    const setSearchTerm = async (searchTerm: string): Promise<any> => {
        clearPages()
        state.searchTerm = searchTerm
        setCurrentPage(1)
        await getPage(1)
    }

    const getProduct = async (id: number): Promise<ProductModel> => {
        loaderStore.setLoading(true)

        const response = await Axios.get(`${ApiConstant.PRODUCTS_URL}/${id}`)
            .then((response: AxiosResponse): AxiosResponse => {
                loaderStore.setLoading(false)

                return response
            })

        return new ProductModel(
            response.data.id,
            response.data.title,
            response.data.description,
            response.data.price,
            response.data.rating,
            response.data.ratingCount,
            response.data.image
        )
    }

    return {
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
