import {beforeEach, afterEach, describe, expect, it, vi} from 'vitest'
import {nextTick} from 'vue'
import {createPinia, setActivePinia} from 'pinia'
import {ProductModel} from '@/model/product-model'
import {useCartStore} from '@/store/module/cart'
import {useFavoriteStore} from '@/store/module/favorite'
import {useLocaleStore} from '@/store/module/locale'
import {useAlertStore} from '@/store/module/alert'
import {useLoaderStore} from '@/store/module/loader'
import transFilter from '@/filter/trans-filter'

const product = (id: number, price = 10): ProductModel =>
    new ProductModel(id, `Product ${id}`, 'Description', price, 5, 1, 'https://example.com/image.jpg')

beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
})

describe('cart store', () => {
    it('adds, counts and removes products', () => {
        const cart = useCartStore()

        cart.addProduct(product(1, 10))
        cart.addProduct(product(1, 10))
        cart.addProduct(product(2, 5))

        expect(cart.itemCount).toBe(3)
        expect(cart.totalPrice).toBe(25)
        expect(cart.totalItemByProduct(product(1))).toBe(2)

        cart.removeProduct(product(2))
        expect(cart.isProductInCart(product(2))).toBe(false)
        expect(cart.lines).toHaveLength(1)
    })

    it('normalizes invalid quantities', () => {
        const cart = useCartStore()
        cart.addProduct(product(1))
        const line = cart.getLines()[0]!

        cart.changeQuantity(line, -5)
        expect(line.quantity).toBe(1)

        cart.changeQuantity(line, 3.7)
        expect(line.quantity).toBe(3)
    })

    it('persists to localStorage and registers the watcher only once', async () => {
        const setItem = vi.spyOn(Storage.prototype, 'setItem')
        const cart = useCartStore()

        cart.initializeCart()
        cart.initializeCart()
        cart.addProduct(product(1))
        await nextTick()

        expect(setItem.mock.calls.filter(([key]) => key === 'cart')).toHaveLength(1)
        setItem.mockRestore()
    })

    it('survives corrupted localStorage data', () => {
        localStorage.setItem('cart', '{not json')
        const cart = useCartStore()

        expect(() => cart.initializeCart()).not.toThrow()
        expect(cart.lines).toHaveLength(0)
    })

    it('returns a detached snapshot of lines for orders', () => {
        const cart = useCartStore()
        cart.addProduct(product(1))

        const snapshot = cart.getLinesSnapshot()
        cart.clearCartData()

        expect(snapshot).toHaveLength(1)
        expect(snapshot[0]!.quantity).toBe(1)
    })
})

describe('favorite store', () => {
    it('toggles favorites and counts them as a number', () => {
        const favorite = useFavoriteStore()

        expect(favorite.itemCount).toBe(0)

        favorite.addOrRemoveProduct(product(1))
        expect(favorite.isProductIsFavorite(product(1))).toBe(true)
        expect(favorite.itemCount).toBe(1)

        favorite.addOrRemoveProduct(product(1))
        expect(favorite.itemCount).toBe(0)
    })
})

describe('locale store and translations', () => {
    it('ignores unknown locales from localStorage', () => {
        localStorage.setItem('locale', 'xx')
        const locale = useLocaleStore()
        locale.initializeLocale()

        expect(locale.getLocale).toBe('en')
        expect(transFilter('btn.login')).toBe('Login')
    })

    it('translates to the selected locale', () => {
        useLocaleStore().setLocale('ru')

        expect(transFilter('btn.login')).not.toBe('Login')
        expect(transFilter('missing.key')).toContain('not found')
    })
})

describe('alert store', () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    it('removes alerts automatically after a timeout', () => {
        vi.useFakeTimers()
        const alert = useAlertStore()

        alert.addSuccess('Saved')
        expect(alert.alerts).toHaveLength(1)

        vi.advanceTimersByTime(3000)
        expect(alert.alerts).toHaveLength(0)
    })
})

describe('loader store', () => {
    it('stays active until all parallel requests finish', async () => {
        const loader = useLoaderStore()
        let resolveFirst!: () => void

        const first = loader.withLoading(() => new Promise<void>(resolve => (resolveFirst = resolve)))
        await loader.withLoading(async () => undefined)

        expect(loader.isLoading).toBe(true)

        resolveFirst()
        await first

        expect(loader.isLoading).toBe(false)
    })

    it('resets on errors', async () => {
        const loader = useLoaderStore()

        await expect(loader.withLoading(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail')
        expect(loader.isLoading).toBe(false)
    })
})
