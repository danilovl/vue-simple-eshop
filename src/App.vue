<template>
  <router-view v-slot="{ Component }">
    <suspense>
      <component :is="Component" v-if="Component"/>
    </suspense>
  </router-view>
</template>

<script setup lang="ts">
import {getCurrentInstance} from 'vue'
import {useLocaleStore} from '@/store/module/locale'
import {useAuthStore} from '@/store/module/auth'
import {useCartStore} from '@/store/module/cart'
import {useFavoriteStore} from '@/store/module/favorite'
import {useThemeStore} from '@/store/module/theme'

useThemeStore().initializeTheme()
useLocaleStore().initializeLocale()
useCartStore().initializeCart()
useFavoriteStore().initializeFavorite()

void useAuthStore().initializeAuthenticate()

getCurrentInstance()?.appContext.config.globalProperties.$version()
</script>
