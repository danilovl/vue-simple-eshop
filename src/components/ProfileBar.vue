<template>
    <router-link
        v-if="!authStore.isAuthenticated"
        class="btn btn-outline-primary"
        :to="{name: 'login'}"
    >
        {{ $filters.transFilter('btn.login') }}
    </router-link>

    <template v-else>
        <router-link
            class="btn btn-outline-primary me-3"
            :to="{name: 'admin_product_list'}"
        >
            {{ $filters.transFilter('text.user_account') }}
        </router-link>

        <font-awesome-icon
            icon="fa-solid fa-right-from-bracket"
            class="cursor-pointer bg-dark text-white"
            @click="logoutUser"
        />
    </template>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/store/module/auth'

const authStore = useAuthStore()
const router = useRouter()

const logoutUser = async (): Promise<void> => {
    authStore.logout()
    await router.push({name: 'home'})
}
</script>
