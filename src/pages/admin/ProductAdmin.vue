<template>
    <div>
        <div class="surface">
            <div class="admin-toolbar">
                <div>
                    <h2 class="admin-toolbar-title">{{ $filters.transFilter('btn.products') }}</h2>
                    <span class="text-secondary small">{{ $filters.transFilter('text.found') }}: {{ productsStore.getState().totalCount }}</span>
                </div>
                <router-link class="btn btn-primary btn-pill" :to="{ name: 'admin_product', params: { op: 'create'}}">
                    <font-awesome-icon icon="fa-solid fa-plus"/>
                    {{ $filters.transFilter('btn.create_product') }}
                </router-link>
            </div>
    
            <div class="table-responsive">
                <table class="table table-hover table-modern">
                    <thead>
                    <tr>
                        <th>{{ $filters.transFilter('text.product') }}</th>
                        <th class="d-none d-md-table-cell">{{ $filters.transFilter('text.rating') }}</th>
                        <th class="text-end">{{ $filters.transFilter('text.price') }}</th>
                        <th class="text-end">{{ $filters.transFilter('text.action') }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="product in productsStore.currentPageProducts" :key="String(product.id)">
                        <td>
                            <div class="product-cell">
                                <img :src="product.image" :alt="product.title" width="56" height="42" loading="lazy"/>
                                <div class="product-cell-text">
                                    <span class="product-cell-title">{{ product.title }}</span>
                                    <span class="product-cell-meta">#{{ product.id }} · {{ $filters.truncateFilter(product.description, 60) }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="d-none d-md-table-cell">
                            <rating-stars :rating="product.rating" :count="product.ratingCount"/>
                        </td>
                        <td class="text-end fw-bold text-nowrap">{{ $filters.currencyFilter(product.price) }}</td>
                        <td class="text-end">
                            <div class="d-inline-flex gap-1">
                                <router-link
                                    class="btn-icon btn-icon-sm btn-icon-primary"
                                    :to="{name: 'admin_product', params: {op: 'edit', id: product.id}}"
                                    :aria-label="$filters.transFilter('btn.edit')"
                                    :title="$filters.transFilter('btn.edit')"
                                >
                                    <font-awesome-icon icon="fa-solid fa-pen"/>
                                </router-link>
                                <router-link
                                    class="btn-icon btn-icon-sm"
                                    :to="{ name: 'product_detail', params: { id: product.id }}"
                                    :aria-label="$filters.transFilter('btn.view')"
                                    :title="$filters.transFilter('btn.view')"
                                >
                                    <font-awesome-icon icon="fa-solid fa-eye"/>
                                </router-link>
                                <button
                                    type="button"
                                    class="btn-icon btn-icon-sm btn-icon-danger"
                                    :disabled="loaderStore.isLoading"
                                    :aria-label="$filters.transFilter('btn.delete')"
                                    :title="$filters.transFilter('btn.delete')"
                                    @click="handleRemove(product)"
                                >
                                    <font-awesome-icon icon="fa-solid fa-trash-can"/>
                                </button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <page-control/>
    </div>
</template>

<script setup lang="ts">
import type {ProductModel} from '@/model/product-model'
import PageControl from '@/components/PageControls.vue'
import RatingStars from '@/components/ui/RatingStars.vue'
import {useProductsStore} from '@/store/module/products'
import {useLoaderStore} from '@/store/module/loader'
import transFilter from '@/filter/trans-filter'

const productsStore = useProductsStore()
const loaderStore = useLoaderStore()

await productsStore.getData()

const handleRemove = async (product: ProductModel): Promise<void> => {
    if (!window.confirm(`${transFilter('btn.delete')}: «${product.title}»?`)) {
        return
    }

    await productsStore.removeProduct(product)
}
</script>

<style scoped>
.admin-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--app-border);
}

.admin-toolbar-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 800;
}

.product-cell {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    min-width: 16rem;
}

.product-cell img {
    width: 3.5rem;
    height: 2.625rem;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: 0.5rem;
}

.product-cell-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.product-cell-title {
    font-weight: 700;
}

.product-cell-meta {
    color: var(--app-muted);
    font-size: 0.8125rem;
}
</style>
