import {computed, reactive, watch} from 'vue'
import {defineStore} from 'pinia'
import type {ProductModel} from '@/model/product-model'
import type {CartState} from '@/store/type/cart'
import {BasketModel} from '@/model/basket-model'

const LOCAL_STORAGE_NAME: string = 'cart'

export const useCartStore = defineStore('cart', ()  => {
    const state = reactive<CartState>({
        lines: []
    }) as CartState

    const itemCount = computed((): string | number => {
        const count = state.lines.reduce((total: any, line: any): number => total + line.quantity, 0)
        if (count === 0) {
            return '0'
        }

        return count
    })

    const totalPrice = computed((): number => {
        return state.lines.reduce((total: number, line: BasketModel): number => {
            return total + (line.quantity * line.product.price)
        }, 0)
    })

    const totalItemByProduct = (product: ProductModel): number => {
        const cart = getCartLineByProduct(product)

        return cart !== null ? cart.quantity : 0
    }

    const totalPriceByProduct = (product: ProductModel): number => {
        const cart = getCartLineByProduct(product)

        return cart !== null ? cart.getTotalPrice() : 0
    }

    const isProductInCart = (product: ProductModel): boolean => {
        const cartLine = state.lines.find((line: BasketModel): boolean => {
            return line.product.id === product.id && line.quantity > 0
        })

        return cartLine !== undefined
    }

    const getCartLineByProduct = (product: ProductModel): BasketModel | null => {
        const cartLine = state.lines.find((line: BasketModel): boolean => {
            return line.product.id === product.id && line.quantity > 0
        })

        return cartLine !== undefined ? cartLine : null
    }

    const addProduct = (product: ProductModel): void => {
        const cartLine = state.lines.find((line: BasketModel): boolean => {
            return line.product.id === product.id
        })

        if (cartLine != null) {
            cartLine.quantity++
        } else {
            const cartLine = reactive<BasketModel>(new BasketModel(product, 1))
            state.lines.push(cartLine)
        }
    }

    const changeQuantity = (line: BasketModel, quantity: number): void => {
        line.quantity = quantity
    }

    const removeProduct = (product: ProductModel): void => {
        const cartLine = state.lines.find((line: BasketModel): boolean => {
            return line.product.id === product.id
        })

        if (!cartLine) {
            return
        }

        if (cartLine.quantity > 0) {
            cartLine.quantity--
            removeEmptyLine()
        }
    }

    const getLines = (): BasketModel[] => {
        return state.lines
    }

    const removeLine = (lineToRemove: any): void => {
        const index = state.lines.findIndex((line: BasketModel): boolean => line === lineToRemove)

        if (index > -1) {
            state.lines.splice(index, 1)
        }
    }

    const removeEmptyLine = (): void => {
        let indexToRemove: number | null = null

        state.lines.forEach((line: BasketModel, index: number): void => {
            if (line.quantity === 0) {
                indexToRemove = index
            }
        })

        if (indexToRemove === null) {
            return
        }

        state.lines.splice(indexToRemove, 1)
        removeEmptyLine()
    }

    const setCartData = (data: BasketModel[]): void => {
        state.lines = data
    }

    const loadCartData = (): void => {
        const data = localStorage.getItem(LOCAL_STORAGE_NAME)
        if (!data) {
            return
        }

        const basket = JSON.parse(data).map((data: any): BasketModel => {
            return new BasketModel(
                data.product,
                data.quantity
            )
        })

        setCartData(basket)
    }

    const storeCartData = (): void => {
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(state.lines))
    }

    const clearCartData = (): void => {
        setCartData([])
    }

    const initializeCart = (): void => {
        loadCartData()

        watch(
            (): BasketModel[] => state.lines,
            (): void => storeCartData(),
            {deep: true}
        )
    }

    return {
        itemCount,
        totalPrice,
        totalItemByProduct,
        totalPriceByProduct,
        isProductInCart,
        getLines,
        addProduct,
        changeQuantity,
        removeProduct,
        removeLine,
        initializeCart,
        clearCartData
    }
})
