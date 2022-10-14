<template>
    <div>
        <router-link
            class="btn btn-success"
            :to="{ name: 'admin_product', params: { op: 'create'}}"
        >
            {{ $filters.transFilter('btn.create_product') }}
        </router-link>

        <table class="table">
            <thead>
            <tr>
                <th class="text-left">{{ $filters.transFilter('text.id') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.title') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.description') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.price') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.rating') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.rating_count') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.image') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.action') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="product in productsStore.processedCurrentPageProducts()" :key="product.id">
                <td>{{ product.id }}</td>
                <td>{{ product.title }}</td>
                <td>{{ $filters.truncateFilter(product.description, 300) }}</td>
                <td>{{ $filters.currencyFilter(product.price) }}</td>
                <td>{{ product.rating }}</td>
                <td>{{ product.ratingCount }}</td>
                <td>
                    <img
                        :src="product.image"
                        alt="product image"
                        height="50"
                        width="50"
                    />
                </td>
                <td class="text-center product-admin-action">
                    <button class="btn btn-warning me-3" v-on:click="handleEdit(product)">
                        {{ $filters.transFilter('btn.edit') }}
                    </button>

                    <router-link
                        class="btn btn-success me-3"
                        :to="{ name: 'product_detail', params: { id: product.id }}"
                    >
                        {{ $filters.transFilter('btn.detail') }}
                    </router-link>

                    <button class="btn btn-danger" v-on:click="productsStore.removeProduct(product)">
                        {{ $filters.transFilter('btn.delete') }}
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <page-control/>
    </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import type {ProductModel} from '@/model/product-model'
import PageControl from '@/components/PageControls.vue'
import {useProductsStore} from '@/store/module/products'

const router = useRouter()
const productsStore = useProductsStore()

await productsStore.getData()

const handleEdit = (product: ProductModel): void => {
    router.push({name: 'admin_product', params: {op: 'edit', id: product.id}})
}
</script>
