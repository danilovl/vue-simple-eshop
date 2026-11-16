<template>
    <article class="product-card">
        <div class="product-card-media">
            <router-link :to="detailRoute" tabindex="-1" aria-hidden="true">
                <img :src="product.image" :alt="product.title" loading="lazy" width="640" height="480"/>
            </router-link>
            <heart-favorite :product="product" class="product-card-favorite"/>
            <span v-if="inCart > 0" class="product-card-badge">
                <font-awesome-icon icon="fa-solid fa-check"/>
                {{ $filters.transFilter('text.in_cart') }} · {{ inCart }}
            </span>
        </div>

        <div class="product-card-body">
            <rating-stars :rating="product.rating" :count="product.ratingCount"/>

            <h3 class="product-card-title">
                <router-link :to="detailRoute">{{ product.title }}</router-link>
            </h3>

            <p class="product-card-description">
                {{ $filters.truncateFilter(product.description, 90) }}
            </p>

            <div class="product-card-footer">
                <span class="product-card-price">{{ $filters.currencyFilter(product.price) }}</span>
                <add-to-cart :product="product" size="sm"/>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import type {ProductModel} from '@/model/product-model'
import HeartFavorite from '@/components/button/HeartFavorite.vue'
import AddToCart from '@/components/button/AddToCart.vue'
import RatingStars from '@/components/ui/RatingStars.vue'
import {useCartStore} from '@/store/module/cart'

const props = defineProps<{
    product: ProductModel
}>()

const cartStore = useCartStore()

const detailRoute = computed(() => ({name: 'product_detail', params: {id: props.product.id}}))
const inCart = computed((): number => cartStore.totalItemByProduct(props.product))
</script>

<style scoped lang="scss">
.product-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    border: 1px solid var(--app-border);
    border-radius: var(--app-radius);
    background: var(--app-surface);
    box-shadow: var(--app-shadow-sm);
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: var(--app-shadow);
        border-color: transparent;

        img {
            transform: scale(1.05);
        }
    }
}

.product-card-media {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--app-surface-2);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
    }
}

.product-card-favorite {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    box-shadow: var(--app-shadow-sm);
}

.product-card-badge {
    position: absolute;
    left: 0.75rem;
    bottom: 0.75rem;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.3rem 0.65rem;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.78);
    backdrop-filter: blur(6px);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 600;
}

.product-card-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 1.125rem 1.125rem;
}

.product-card-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.35;

    a {
        color: var(--app-heading);
        text-decoration: none;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;

        &:hover {
            color: var(--bs-primary);
        }
    }
}

.product-card-description {
    margin: 0;
    color: var(--app-muted);
    font-size: 0.875rem;
    line-height: 1.5;
}

.product-card-footer {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: auto;
    padding-top: 0.75rem;
}

.product-card-price {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--app-heading);
}
</style>
