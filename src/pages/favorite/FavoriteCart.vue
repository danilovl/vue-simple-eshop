<template>
    <h3 class="text-center mb-4">
        {{ $filters.transFilter('text.favorites') }}
    </h3>

    <div v-if="favoriteStore.getFavorites.length > 0">
        <button class="btn btn-danger mb-4" @click="favoriteStore.clearFavoriteData()">
            {{ $filters.transFilter('btn.clear_favorite') }}
        </button>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 mb-3">
            <div v-for="(product,index) in favoriteStore.getFavorites" :key="index">
                <div class="col">
                    <product-card :product="product"/>
                </div>
            </div>
        </div>
    </div>
    <Empty v-else/>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'
import Empty from '@/components/Empty.vue'
import {useFavoriteStore} from '@/store/module/favorite'

const favoriteStore = useFavoriteStore()
</script>
