<template>
    <div v-if="productsStore.pageCount() > 0" class="text-center">
        <vue-awesome-paginate
            :total-items="productsStore.getState().totalCount"
            :items-per-page="productsStore.getState().pageSize"
            :max-pages-shown="productsStore.getState().totalVisible"
            v-model="page"
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
    page.value = pageNumber;
};
</script>

<style>
.pagination-container {
    display: flex;
    column-gap: 10px;
}

.paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
}

.paginate-buttons:hover {
    background-color: #d8d8d8;
}

.active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
}

.active-page:hover {
    background-color: #2988c8;
}
</style>
