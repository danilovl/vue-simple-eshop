<template>
    <div v-if="productsStore.pageCount() > 1" class="d-flex justify-content-center mt-5">
        <vue-awesome-paginate
            v-model="page"
            :total-items="productsStore.getState().totalCount"
            :items-per-page="productsStore.getState().pageSize"
            :max-pages-shown="5"
            :on-click="onClickHandler"
        />
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useProductsStore} from '@/store/module/products'

const productsStore = useProductsStore()

const page = computed({
    get(): number {
        return productsStore.getCurrentPage()
    },
    set(page: number): void {
        productsStore.setCurrentPage(page)
    }
})

const onClickHandler = (pageNumber: number): void => {
    page.value = pageNumber
    window.scrollTo({top: 0, behavior: 'smooth'})
}
</script>
