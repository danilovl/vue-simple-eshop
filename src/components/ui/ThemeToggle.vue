<template>
    <button
        type="button"
        class="btn-icon"
        :aria-label="$filters.transFilter('btn.toggle_theme')"
        :title="$filters.transFilter('btn.toggle_theme')"
        @click="themeStore.toggleTheme()"
    >
        <font-awesome-icon :icon="themeStore.isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"/>
    </button>
</template>

<script setup lang="ts">
import {useThemeStore} from '@/store/module/theme'

const themeStore = useThemeStore()
</script>
