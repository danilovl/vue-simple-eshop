<template>
    <form class="d-flex">
        <select v-model="locale" class="form-select me-2">
            <option v-for="option in localeStore.getLocalesSelect" :value="option.value">
                {{ option.text }}
            </option>
        </select>
    </form>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useLocaleStore} from '@/store/module/locale'

const localeStore = useLocaleStore()

const locale = computed({
    get(): string {
        return localeStore.getLocale
    },
    set(locale: string): void {
        localeStore.setLocale(locale)
    }
})
</script>
