import {computed, reactive, watch} from 'vue'
import {defineStore} from 'pinia'
import type {ProductModel} from '@/model/product-model'
import type {CartState} from '@/store/type/cart'
import {BasketModel} from '@/model/basket-model'

const LOCAL_STORAGE_NAME = 'cart'

export const useCartStore = defineStore('cart', () => {
    const state = reactive<CartState>({
        lines: []
    })

    let initialized = false

    const findLine = (product: ProductModel): BasketModel | undefined => {
        return state.lines.find((line: BasketModel): boolean => line.product.id === product.id)
    }

    const itemCount = computed((): number => {
        return state.lines.reduce((total: number, line: BasketModel): number => total + line.quantity, 0)
    })

    const totalPrice = computed((): number => {
        return state.lines.reduce((total: number, line: BasketModel): number => total + line.getTotalPrice(), 0)
    })

    const lines = computed((): BasketModel[] => state.lines)

    const getCartLineByProduct = (product: ProductModel): BasketModel | null => {
        const cartLine = findLine(product)

        return cartLine !== undefined && cartLine.quantity > 0 ? cartLine : null
    }

    const totalItemByProduct = (product: ProductModel): number => {
        return getCartLineByProduct(product)?.quantity ?? 0
    }

    const totalPriceByProduct = (product: ProductModel): number => {
        return getCartLineByProduct(product)?.getTotalPrice() ?? 0
    }

    const isProductInCart = (product: ProductModel): boolean => {
        return getCartLineByProduct(product) !== null
    }

    const removeEmptyLines = (): void => {
        state.lines = state.lines.filter((line: BasketModel): boolean => line.quantity > 0)
    }

    const addProduct = (product: ProductModel): void => {
        const cartLine = findLine(product)

        if (cartLine !== undefined) {
            cartLine.quantity++
        } else {
            state.lines.push(new BasketModel(product, 1))
        }
    }

    const changeQuantity = (line: BasketModel, quantity: number): void => {
        const normalized = Math.floor(Number(quantity))
        line.quantity = Number.isFinite(normalized) && normalized > 0 ? normalized : 1
    }

    const removeProduct = (product: ProductModel): void => {
        const cartLine = findLine(product)
        if (!cartLine) {
            return
        }

        if (cartLine.quantity > 0) {
            cartLine.quantity--
        }

        removeEmptyLines()
    }

    const getLines = (): BasketModel[] => state.lines

    const getLinesSnapshot = (): BasketModel[] => {
        return state.lines.map((line: BasketModel): BasketModel => new BasketModel({...line.product}, line.quantity))
    }

    const removeLine = (lineToRemove: BasketModel): void => {
        state.lines = state.lines.filter((line: BasketModel): boolean => line !== lineToRemove)
    }

    const setCartData = (data: BasketModel[]): void => {
        state.lines = data
    }

    const loadCartData = (): void => {
        const data = localStorage.getItem(LOCAL_STORAGE_NAME)
        if (!data) {
            return
        }

        try {
            const parsed: unknown = JSON.parse(data)
            if (!Array.isArray(parsed)) {
                return
            }

            const basket = parsed
                .filter((item: any): boolean => item?.product?.id != null && Number(item.quantity) > 0)
                .map((item: any): BasketModel => new BasketModel(item.product, Math.floor(Number(item.quantity))))

            setCartData(basket)
        } catch {
            localStorage.removeItem(LOCAL_STORAGE_NAME)
        }
    }

    const storeCartData = (): void => {
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(state.lines))
    }

    const clearCartData = (): void => {
        setCartData([])
    }

    const initializeCart = (): void => {
        if (initialized) {
            return
        }
        initialized = true

        loadCartData()

        watch(
            (): BasketModel[] => state.lines,
            (): void => storeCartData(),
            {deep: true}
        )
    }

    return {
        lines,
        itemCount,
        totalPrice,
        totalItemByProduct,
        totalPriceByProduct,
        isProductInCart,
        getLines,
        getLinesSnapshot,
        addProduct,
        changeQuantity,
        removeProduct,
        removeLine,
        initializeCart,
        clearCartData
    }
})
