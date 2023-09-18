<template>
    <div class="card shadow-sm">
        <img
            :src="product.image"
            alt="product image"
            class="bd-placeholder-img card-img-top"
            height=200
            width=200
        />
        <div class="card-body">
            <p class="card-title">
                {{ product.title }}
            </p>
            <p class="card-text">
                {{ $filters.truncateFilter(product.description) }}
            </p>

            <div class="d-flex justify-content-between align-items-center">
                <font-awesome-icon icon="fa-solid fa-dollar-sign"/>
                {{ $filters.currencyFilter(product.price) }}
            </div>

            <div class="d-flex justify-content-between align-items-center">
                <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
                {{ $filters.currencyFilter(cartStore.totalPriceByProduct(product)) }}
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="btn-group">
                    <div class="me-3">
                        <heart-favorite :product="product"/>
                    </div>
                    <div class="me-3">
                        <add-to-cart :product="product"/>
                    </div>
                    <div>
                        <font-awesome-icon
                            icon="fa-solid fa-angles-right"
                            class="cursor-pointer"
                            @click="toRoute({name: 'product_detail', params: { id: product.id }})"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import type {ProductModel} from '@/model/product-model'
import HeartFavorite from '@/components/button/HeartFavorite.vue'
import AddToCart from '@/components/button/AddToCart.vue'
import {useCartStore} from '@/store/module/cart'

interface Props {
    product: ProductModel
}

defineProps<Props>()

const cartStore = useCartStore()
const router = useRouter()

const toRoute = (route: Object): void => {
    router.push(route)
}
</script>
