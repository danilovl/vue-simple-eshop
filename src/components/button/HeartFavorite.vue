<template>
    <font-awesome-icon
        icon="fa-regular fa-heart"
        class="cursor-pointer"
        :beat="favoriteStore.isProductIsFavorite(product)"
        @click="favoriteStore.addOrRemoveProduct(product)"
    />
</template>

<script setup lang="ts">
import {ProductModel} from '@/model/product-model'
import {useFavoriteStore} from '@/store/module/favorite'

defineProps({
    product: {
        type: [ProductModel, Object],
        required: true
    }
})

const favoriteStore = useFavoriteStore()
</script>
