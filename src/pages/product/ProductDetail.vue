<template>
    <div>
        <nav aria-label="breadcrumb" class="mb-4">
            <router-link :to="{name: 'home'}" class="back-link">
                <font-awesome-icon icon="fa-solid fa-arrow-left"/>
                {{ $filters.transFilter('text.back_to_catalog') }}
            </router-link>
        </nav>

        <div v-if="product" class="product-detail">
            <div class="product-gallery">
                <img :src="product.image" :alt="product.title" width="640" height="480"/>
                <heart-favorite :product="product" class="gallery-favorite"/>
            </div>

            <div class="product-info">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <rating-stars :rating="product.rating" :count="product.ratingCount"/>
                    <admin-edit :to="{ name: 'admin_product', params: { op: 'edit', id: product.id }}"/>
                </div>

                <h1 class="product-title">{{ product.title }}</h1>

                <div class="product-price">{{ $filters.currencyFilter(product.price) }}</div>

                <p class="product-description">{{ product.description }}</p>

                <div class="product-actions">
                    <add-to-cart :product="product" size="lg"/>
                    <span v-if="inCart > 0" class="in-cart-total">
                        {{ $filters.transFilter('text.in_cart') }}:
                        <strong>{{ $filters.currencyFilter(cartStore.totalPriceByProduct(product)) }}</strong>
                    </span>
                </div>

                <ul class="product-perks">
                    <li>
                        <font-awesome-icon icon="fa-solid fa-truck-fast"/>
                        <div>
                            <strong>{{ $filters.transFilter('perk.free_shipping') }}</strong>
                            <span>{{ $filters.transFilter('perk.free_shipping_hint') }}</span>
                        </div>
                    </li>
                    <li>
                        <font-awesome-icon icon="fa-solid fa-rotate-left"/>
                        <div>
                            <strong>{{ $filters.transFilter('perk.returns') }}</strong>
                            <span>{{ $filters.transFilter('perk.returns_hint') }}</span>
                        </div>
                    </li>
                    <li>
                        <font-awesome-icon icon="fa-solid fa-shield-halved"/>
                        <div>
                            <strong>{{ $filters.transFilter('perk.secure_payment') }}</strong>
                            <span>{{ $filters.transFilter('perk.secure_payment_hint') }}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div v-else-if="loaderStore.isLoading" class="product-detail" aria-hidden="true">
            <span class="skeleton" style="aspect-ratio: 4 / 3; border-radius: var(--app-radius-lg)"></span>
            <div class="d-flex flex-column gap-3">
                <span class="skeleton" style="width: 30%; height: 1rem"></span>
                <span class="skeleton" style="width: 80%; height: 2.5rem"></span>
                <span class="skeleton" style="width: 25%; height: 2rem"></span>
                <span class="skeleton" style="width: 100%; height: 6rem"></span>
            </div>
        </div>

        <Empty v-else title="text.product_not_found" text="text.page_not_found_hint"/>
    </div>
</template>

<script setup lang="ts">
import {computed, watch} from 'vue'
import {useRoute} from 'vue-router'
import HeartFavorite from '@/components/button/HeartFavorite.vue'
import AddToCart from '@/components/button/AddToCart.vue'
import AdminEdit from '@/components/button/AdminEdit.vue'
import RatingStars from '@/components/ui/RatingStars.vue'
import Empty from '@/components/Empty.vue'
import {useProductStore} from '@/store/module/product'
import {useCartStore} from '@/store/module/cart'
import {useLoaderStore} from '@/store/module/loader'

const route = useRoute()

const productStore = useProductStore()
const cartStore = useCartStore()
const loaderStore = useLoaderStore()

const product = computed(() => productStore.product)
const inCart = computed((): number => product.value ? cartStore.totalItemByProduct(product.value) : 0)

await productStore.initializeProduct(Number(route.params.id))

watch(
    () => route.params.id,
    (id, oldId): void => {
        if (id !== undefined && id !== oldId && route.name === 'product_detail') {
            void productStore.initializeProduct(Number(id))
        }
    }
)
</script>

<style scoped lang="scss">
.back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--app-muted);
    font-weight: 600;
    text-decoration: none;

    &:hover {
        color: var(--bs-primary);
        text-decoration: none;
    }
}

.product-detail {
    display: grid;
    gap: 2.5rem;

    @media (min-width: 992px) {
        grid-template-columns: 1.1fr 1fr;
        gap: 3.5rem;
        align-items: start;
    }
}

.product-gallery {
    position: relative;
    overflow: hidden;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface-2);
    box-shadow: var(--app-shadow);

    img {
        display: block;
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
    }
}

.gallery-favorite {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
    font-size: 1.125rem;
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    @media (min-width: 992px) {
        position: sticky;
        top: calc(var(--app-header-height) + 1.5rem);
    }
}

.product-title {
    margin: 0;
    font-size: clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
}

.product-price {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--bs-primary);
}

.product-description {
    margin: 0;
    color: var(--app-muted);
    font-size: 1rem;
    line-height: 1.7;
}

.product-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 0;
    border-top: 1px solid var(--app-border);
    border-bottom: 1px solid var(--app-border);
}

.in-cart-total {
    color: var(--app-muted);
}

.product-perks {
    display: grid;
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
        display: flex;
        align-items: flex-start;
        gap: 0.875rem;

        > svg {
            flex-shrink: 0;
            width: 1.125rem;
            margin-top: 0.2rem;
            color: var(--bs-primary);
        }

        div {
            display: flex;
            flex-direction: column;
        }

        span {
            color: var(--app-muted);
            font-size: 0.875rem;
        }
    }
}
</style>
