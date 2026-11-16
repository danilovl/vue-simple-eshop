<template>
    <form class="search" role="search" @submit.prevent="applySearch">
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="search-icon"/>
        <input
            v-model="searchTerm"
            class="search-input"
            type="search"
            :placeholder="$filters.transFilter('btn.search')"
            :aria-label="$filters.transFilter('btn.search')"
        >
        <button
            v-if="searchTerm"
            type="button"
            class="search-clear"
            :aria-label="$filters.transFilter('btn.reset_search')"
            @click="searchTerm = ''"
        >
            <font-awesome-icon icon="fa-solid fa-xmark"/>
        </button>
    </form>
</template>

<script setup lang="ts">
import {onBeforeUnmount, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useProductsStore} from '@/store/module/products'

const SEARCH_DEBOUNCE_MS = 400

const productsStore = useProductsStore()
const route = useRoute()
const router = useRouter()
const searchTerm = ref<string>(productsStore.getSearchTerm())

let timer: ReturnType<typeof setTimeout> | undefined

const applySearch = async (): Promise<void> => {
    clearTimeout(timer)
    await productsStore.setSearchTerm(searchTerm.value)

    if (route.name !== 'home' && route.name !== 'product_list') {
        await router.push({name: 'home'})
    }
}

watch(searchTerm, (value: string): void => {
    clearTimeout(timer)

    if (value.trim() === productsStore.getSearchTerm()) {
        return
    }

    timer = setTimeout((): void => {
        void applySearch()
    }, SEARCH_DEBOUNCE_MS)
})

watch(() => productsStore.getSearchTerm(), (value: string): void => {
    if (value !== searchTerm.value.trim()) {
        searchTerm.value = value
    }
})

onBeforeUnmount((): void => clearTimeout(timer))
</script>

<style scoped>
.search {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
}

.search-icon {
    position: absolute;
    left: 1rem;
    color: var(--app-muted);
    pointer-events: none;
}

.search-input {
    width: 100%;
    height: 2.75rem;
    padding: 0 2.5rem 0 2.75rem;
    border: 1px solid var(--app-border);
    border-radius: 999px;
    background: var(--app-surface-2);
    color: var(--bs-body-color);
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.search-input::placeholder {
    color: var(--app-muted);
}

.search-input:focus {
    outline: none;
    background: var(--app-surface);
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 4px var(--app-primary-soft);
}

.search-input::-webkit-search-cancel-button {
    -webkit-appearance: none;
}

.search-clear {
    position: absolute;
    right: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border: 0;
    border-radius: 999px;
    background: var(--app-surface-3);
    color: var(--bs-body-color);
    font-size: 0.75rem;
    cursor: pointer;
}
</style>
