<template>
    <font-awesome-icon
        icon="fa-solid fa-plus"
        class="cursor-pointer"
        @click="cartStore.addProduct(product)"
    />

    <font-awesome-icon
        v-if="cartStore.isProductInCart(product)"
        icon="fa-solid fa-minus"
        class="cursor-pointer ms-2"
        @click="cartStore.removeProduct(product)"
    />
</template>

<script setup lang="ts">
import type {ProductModel} from '@/model/product-model'
import {useCartStore} from '@/store/module/cart'

interface Props {
    product: ProductModel
}

defineProps<Props>()

const cartStore = useCartStore()
</script>
