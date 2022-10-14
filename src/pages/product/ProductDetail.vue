<template>
    <div v-if="product" class="card-body" >
        <div class="row">
            <div class="col-5">
                <img
                    :src="product.image"
                    alt="product image"
                    class="bd-placeholder-img card-img-top"
                    height=400
                    width=100%
                />
            </div>

            <div class="col-7">
                <p class="card-title">
                    {{ product.title }}

                    <heart-favorite :product="product" class="me-2"/>
                    <admin-edit :to="{ name: 'admin_product', params: { op: 'edit', id: product.id }}"/>
                </p>

                <p>
                    <font-awesome-icon icon="fa-solid fa-star"/>
                    {{ product.rating }} ({{ product.ratingCount }})
                </p>

                <p class="card-text">
                    {{ product.description }}
                </p>

                <p class="mt-4">
                    <font-awesome-icon icon="fa-solid fa-dollar-sign"/>
                    {{ $filters.currencyFilter(product.price) }}
                </p>

                <p class="align-items-center">
                    <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
                    {{ $filters.currencyFilter(cartStore.totalPriceByProduct(product)) }}
                    ({{ cartStore.totalItemByProduct(product) }})
                </p>
                <add-to-cart :product="product"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
import type {ProductModel} from '@/model/product-model'
import HeartFavorite from '@/components/button/HeartFavorite.vue'
import AddToCart from '@/components/button/AddToCart.vue'
import AdminEdit from '@/components/button/AdminEdit.vue'
import {useProductStore} from '@/store/module/product'
import {useCartStore} from '@/store/module/cart'

const route = useRoute()

const productStore = useProductStore()
const cartStore = useCartStore()

await productStore.initializeProduct(Number(route.params.id))
const product: ProductModel | null = productStore.getProduct()
</script>
