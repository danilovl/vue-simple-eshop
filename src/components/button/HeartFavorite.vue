<template>
    <button
        type="button"
        class="favorite-button"
        :class="{'is-active': isFavorite}"
        :aria-pressed="isFavorite"
        :aria-label="$filters.transFilter(isFavorite ? 'btn.remove_from_favorites' : 'btn.add_to_favorites')"
        :title="$filters.transFilter(isFavorite ? 'btn.remove_from_favorites' : 'btn.add_to_favorites')"
        @click="favoriteStore.addOrRemoveProduct(product)"
    >
        <font-awesome-icon :icon="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"/>
    </button>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import type {ProductModel} from '@/model/product-model'
import {useFavoriteStore} from '@/store/module/favorite'

const props = defineProps<{
    product: ProductModel
}>()

const favoriteStore = useFavoriteStore()

const isFavorite = computed((): boolean => favoriteStore.isProductIsFavorite(props.product))
</script>

<style scoped>
.favorite-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid var(--app-border);
    border-radius: 999px;
    background: var(--app-surface);
    color: var(--bs-body-color);
    cursor: pointer;
    transition: transform 0.15s ease, color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
}

.favorite-button:hover {
    color: var(--bs-danger);
    border-color: var(--bs-danger);
}

.favorite-button:active {
    transform: scale(0.9);
}

.favorite-button.is-active {
    color: #fff;
    background: var(--bs-danger);
    border-color: var(--bs-danger);
    animation: heart-pop 0.3s ease;
}

.favorite-button:focus-visible {
    outline: 2px solid var(--bs-primary);
    outline-offset: 2px;
}

@keyframes heart-pop {
    50% {
        transform: scale(1.18);
    }
}
</style>
