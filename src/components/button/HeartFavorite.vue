<template>
    <font-awesome-icon
        icon="fa-regular fa-heart"
        class="cursor-pointer"
        :beat="favoriteStore.isProductIsFavorite(product)"
        @click="favoriteStore.addOrRemoveProduct(product)"
    />
</template>

<script setup lang="ts">
import type {ProductModel} from '@/model/product-model'
import {useFavoriteStore} from '@/store/module/favorite'

interface Props {
    product: ProductModel
}

defineProps<Props>()
const favoriteStore = useFavoriteStore()
</script>
