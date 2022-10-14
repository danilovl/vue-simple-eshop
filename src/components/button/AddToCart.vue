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
import {ProductModel} from '@/model/product-model'
import {useCartStore} from '@/store/module/cart'

defineProps({
    product: {
        type: [ProductModel, Object],
        required: true
    }
})

const cartStore = useCartStore()
</script>
