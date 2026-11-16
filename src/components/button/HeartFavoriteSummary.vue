<template>
    <router-link
        class="btn-icon"
        :to="{name: 'favorite'}"
        :aria-label="`${$filters.transFilter('text.favorites')}: ${favoriteStore.itemCount}`"
    >
        <font-awesome-icon icon="fa-regular fa-heart"/>
        <span v-if="favoriteStore.itemCount > 0" class="counter-badge">{{ favoriteStore.itemCount }}</span>
    </router-link>
</template>

<script setup lang="ts">
import {useFavoriteStore} from '@/store/module/favorite'

const favoriteStore = useFavoriteStore()
</script>
