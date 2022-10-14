<template>
    <form class="d-flex">
        <input
            class="form-control me-2"
            type="search"
            v-model="searchTerm"
            :placeholder="$filters.transFilter('btn.search')"
        >
    </form>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {useProductsStore} from '@/store/module/products'

const productsStore = useProductsStore()
const searchTerm = ref<string>(productsStore.getSearchTerm())

watch(
    (): string => searchTerm.value,
    (searchTerm: string) => productsStore.setSearchTerm(searchTerm)
)
</script>
