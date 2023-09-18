<template>
    <font-awesome-icon
        v-if="authStore.isAuthenticated"
        icon="fa-solid fa-screwdriver-wrench"
        class="cursor-pointer"
        @click="toRoute(to)"
    />
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/store/module/auth'

interface Props {
    to: Object
}

defineProps<Props>()

const authStore = useAuthStore()
const router = useRouter()

const toRoute = (route: Object): void => {
    router.push(route)
}
</script>
