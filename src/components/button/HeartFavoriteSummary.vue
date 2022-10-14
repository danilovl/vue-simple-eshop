<template>
    <div class="me-1">
        <router-link
            class="btn btn-sm bg-dark text-white"
            :to="{name: 'favorite'}"
            :disabled="favoriteStore.itemCount === 0"
        >
            <font-awesome-icon icon="fa-regular fa-heart"/>
            {{ favoriteStore.itemCount }}
        </router-link>
    </div>
</template>

<script setup lang="ts">
import {useFavoriteStore} from '@/store/module/favorite'

const favoriteStore = useFavoriteStore()
</script>
