<template>
    <router-link
        v-if="!authStore.isAuthenticated"
        class="btn btn-sm btn-primary btn-pill ms-1 px-3"
        :to="{name: 'login'}"
    >
        <font-awesome-icon icon="fa-solid fa-user"/>
        <span class="d-none d-sm-inline">{{ $filters.transFilter('btn.login') }}</span>
    </router-link>

    <template v-else>
        <router-link
            class="btn-icon d-lg-none"
            :to="{name: 'admin_product_list'}"
            :aria-label="$filters.transFilter('text.user_account')"
        >
            <font-awesome-icon icon="fa-solid fa-user"/>
        </router-link>

        <button
            type="button"
            class="btn-icon btn-icon-danger"
            :aria-label="$filters.transFilter('btn.logout')"
            :title="$filters.transFilter('btn.logout')"
            @click="logoutUser"
        >
            <font-awesome-icon icon="fa-solid fa-right-from-bracket"/>
        </button>
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
