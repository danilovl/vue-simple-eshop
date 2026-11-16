import {computed, reactive, watch} from 'vue'
import {defineStore} from 'pinia'
import type {ProductModel} from '@/model/product-model'
import type {FavoriteState} from '@/store/type/favorite'

const LOCAL_STORAGE_NAME = 'favorite'

export const useFavoriteStore = defineStore('favorite', () => {
    const state = reactive<FavoriteState>({
        favorites: []
    })

    let initialized = false

    const itemCount = computed((): number => state.favorites.length)

    const getFavorites = computed((): ProductModel[] => state.favorites)

    const isProductIsFavorite = (product: ProductModel): boolean => {
        return state.favorites.some((line: ProductModel): boolean => line.id === product.id)
    }

    function setFavoriteData(data: ProductModel[]): void {
        state.favorites = data
    }

    function loadFavoriteData(): void {
        const data = localStorage.getItem(LOCAL_STORAGE_NAME)
        if (!data) {
            return
        }

        try {
            const parsed: unknown = JSON.parse(data)
            if (Array.isArray(parsed)) {
                setFavoriteData(parsed.filter((item: any): boolean => item?.id != null))
            }
        } catch {
            localStorage.removeItem(LOCAL_STORAGE_NAME)
        }
    }

    function storeFavoriteData(): void {
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(state.favorites))
    }

    const clearFavoriteData = (): void => {
        setFavoriteData([])
    }

    const initializeFavorite = (): void => {
        if (initialized) {
            return
        }
        initialized = true

        loadFavoriteData()

        watch(
            (): ProductModel[] => state.favorites,
            (): void => storeFavoriteData(),
            {deep: true}
        )
    }

    const addProduct = (product: ProductModel): void => {
        if (!isProductIsFavorite(product)) {
            state.favorites.push(product)
        }
    }

    const removeProduct = (product: ProductModel): void => {
        setFavoriteData(state.favorites.filter((line: ProductModel): boolean => line.id !== product.id))
    }

    const addOrRemoveProduct = (product: ProductModel): void => {
        if (isProductIsFavorite(product)) {
            removeProduct(product)
        } else {
            addProduct(product)
        }
    }

    return {
        itemCount,
        getFavorites,
        isProductIsFavorite,
        initializeFavorite,
        addOrRemoveProduct,
        addProduct,
        removeProduct,
        clearFavoriteData
    }
})
