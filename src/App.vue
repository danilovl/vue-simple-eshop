<template>
  <router-view v-slot="{ Component }">
    <suspense>
      <component :is="Component"/>
    </suspense>
  </router-view>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted} from 'vue'
import {useLocaleStore} from '@/store/module/locale'
import {useAuthStore} from '@/store/module/auth'
import {useCartStore} from '@/store/module/cart'
import {useFavoriteStore} from '@/store/module/favorite'

export default defineComponent({
    name: 'App',
    setup(): void {
        const localeStore = useLocaleStore()
        const authStore = useAuthStore()
        const cartStore = useCartStore()
        const favoriteStore = useFavoriteStore()

        onMounted(async (): Promise<any> => {
            localeStore.initializeLocale()
            await authStore.initializeAuthenticate()
            cartStore.initializeCart()
            favoriteStore.initializeFavorite()
        })

        const app = getCurrentInstance()
        const version = app?.appContext.config.globalProperties.$version
        version()
    }
})
</script>
