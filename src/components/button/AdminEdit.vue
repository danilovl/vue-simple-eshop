<template>
    <router-link
        v-if="authStore.isAuthenticated"
        :to="to"
        class="btn btn-sm btn-ghost btn-pill"
    >
        <font-awesome-icon icon="fa-solid fa-pen"/>
        {{ $filters.transFilter('btn.edit') }}
    </router-link>
</template>

<script setup lang="ts">
import type {RouteLocationRaw} from 'vue-router'
import {useAuthStore} from '@/store/module/auth'

defineProps<{
    to: RouteLocationRaw
}>()

const authStore = useAuthStore()
</script>
