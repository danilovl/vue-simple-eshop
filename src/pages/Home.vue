<template>
    <div>
        <div v-if="productsStore.isProducts()">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 mb-3">
                <div v-for="(product,index) in productsStore.processedCurrentPageProducts()" :key="index">
                    <div class="col">
                        <product-card :product="product"/>
                    </div>
                </div>
            </div>
            <page-control/>
        </div>
        <empty v-else-if="!loaderStore.isLoading"/>
    </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import PageControl from '@/components/PageControls.vue'
import Empty from '@/components/Empty.vue'
import {useProductsStore} from '@/store/module/products'
import {useCartStore} from '@/store/module/cart'
import {useLoaderStore} from '@/store/module/loader'

const productsStore = useProductsStore()
const cartStore = useCartStore()
const loaderStore = useLoaderStore()

cartStore.initializeCart()

onMounted(async (): Promise<any> => {
    await productsStore.getData()
})
</script>
