<template>
    <div>
        <div class="page-header">
            <div>
                <h1>{{ $filters.transFilter('text.favorites') }}</h1>
                <p v-if="favoriteStore.itemCount > 0">{{ $filters.transFilter('text.found') }}: {{ favoriteStore.itemCount }}</p>
            </div>
            <button
                v-if="favoriteStore.itemCount > 0"
                type="button"
                class="btn btn-danger-soft btn-pill"
                @click="favoriteStore.clearFavoriteData()"
            >
                <font-awesome-icon icon="fa-solid fa-trash-can"/>
                {{ $filters.transFilter('btn.clear_favorite') }}
            </button>
        </div>

        <div v-if="favoriteStore.itemCount > 0" class="product-grid">
            <product-card
                v-for="product in favoriteStore.getFavorites"
                :key="String(product.id)"
                :product="product"
            />
        </div>

        <Empty
            v-else
            icon="fa-regular fa-heart"
            title="text.favorites_empty"
            text="text.favorites_empty_hint"
        />
    </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'
import Empty from '@/components/Empty.vue'
import {useFavoriteStore} from '@/store/module/favorite'

const favoriteStore = useFavoriteStore()
</script>

