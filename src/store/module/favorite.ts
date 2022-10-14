import {computed, reactive, watch} from 'vue'
import {defineStore} from 'pinia'
import type {ProductModel} from '@/model/product-model'
import type {FavoriteState} from '@/store/type/favorite'

export const useFavoriteStore = defineStore('favorite', ()  => {
    const state = reactive<FavoriteState>({
        favorites: []
    }) as FavoriteState

    const itemCount = computed((): number | string => {
        const length = state.favorites.length

        return length > 0 ? length : '0'
    })

    const getFavorites = computed((): ProductModel[] => {
        return state.favorites
    })

    const isProductIsFavorite = (product: ProductModel): boolean => {
        const favoriteProduct = state.favorites.find((line: any): boolean => line.id === product.id)

        return favoriteProduct !== undefined
    }

    function setFavoriteData(data: any): void {
        state.favorites = data
    }

    function loadFavoriteData(): void {
        const data = localStorage.getItem('favorite')
        if (data) {
            setFavoriteData(JSON.parse(data))
        }
    }

    function storeFavoriteData(): void {
        localStorage.setItem('favorite', JSON.stringify(state.favorites))
    }

    const clearFavoriteData = (): void => {
        setFavoriteData([])
    }

    const initializeFavorite = (): void => {
        loadFavoriteData()

        watch(
            (): ProductModel[] => state.favorites,
            (): void => storeFavoriteData(),
            {deep: true}
        )
    }

    const addProduct = (product: ProductModel): void => {
        const line = state.favorites.find((line: any): boolean => line.id === product.id)

        if (line === undefined) {
            state.favorites.push(product)
        }
    }
    const removeProduct = (product: ProductModel): void => {
        const filterFavorites = state.favorites.filter((line: any): boolean => line.id !== product.id)

        setFavoriteData(filterFavorites)
    }

    const addOrRemoveProduct = (product: ProductModel): void => {
        const line = state.favorites.find((line: any): boolean => line.id === product.id)

        if (line === undefined) {
            addProduct(product)
        } else {
            removeProduct(product)
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
