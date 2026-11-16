<template>
    <div>
        <section v-if="!searchTerm" class="perks">
            <div v-for="perk in perks" :key="perk.title" class="perk">
                <span class="perk-icon"><font-awesome-icon :icon="perk.icon"/></span>
                <div>
                    <div class="perk-title">{{ $filters.transFilter(perk.title) }}</div>
                    <div class="perk-hint">{{ $filters.transFilter(perk.hint) }}</div>
                </div>
            </div>
        </section>

        <section>
            <div class="page-header">
                <div>
                    <h1 v-if="searchTerm">
                        {{ $filters.transFilter('text.search_results') }} «{{ searchTerm }}»
                    </h1>
                    <h1 v-else>{{ $filters.transFilter('text.catalog') }}</h1>
                    <p v-if="totalCount > 0">{{ $filters.transFilter('text.found') }}: {{ totalCount }}</p>
                </div>
                <button
                    v-if="searchTerm"
                    type="button"
                    class="btn btn-ghost btn-pill"
                    @click="productsStore.setSearchTerm('')"
                >
                    <font-awesome-icon icon="fa-solid fa-rotate-left"/>
                    {{ $filters.transFilter('btn.reset_search') }}
                </button>
            </div>

            <div v-if="productsStore.isProducts()" class="product-grid">
                <product-card
                    v-for="product in productsStore.currentPageProducts"
                    :key="String(product.id)"
                    :product="product"
                />
            </div>
            <div v-else-if="loaderStore.isLoading" class="product-grid">
                <product-card-skeleton v-for="n in 8" :key="n"/>
            </div>
            <Empty v-else icon="fa-solid fa-magnifying-glass" title="text.empty" text="text.empty_hint">
                <button
                    v-if="searchTerm"
                    type="button"
                    class="btn btn-primary btn-pill"
                    @click="productsStore.setSearchTerm('')"
                >
                    <font-awesome-icon icon="fa-solid fa-rotate-left"/>
                    {{ $filters.transFilter('btn.reset_search') }}
                </button>
                <span v-else></span>
            </Empty>

            <page-control/>
        </section>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton.vue'
import PageControl from '@/components/PageControls.vue'
import Empty from '@/components/Empty.vue'
import {useProductsStore} from '@/store/module/products'
import {useLoaderStore} from '@/store/module/loader'

const productsStore = useProductsStore()
const loaderStore = useLoaderStore()

const searchTerm = computed((): string => productsStore.getSearchTerm())
const totalCount = computed((): number => productsStore.getState().totalCount)

const perks = [
    {icon: 'fa-solid fa-truck-fast', title: 'perk.free_shipping', hint: 'perk.free_shipping_hint'},
    {icon: 'fa-solid fa-shield-halved', title: 'perk.secure_payment', hint: 'perk.secure_payment_hint'},
    {icon: 'fa-solid fa-rotate-left', title: 'perk.returns', hint: 'perk.returns_hint'}
]

onMounted(async (): Promise<void> => {
    await productsStore.getData()
})
</script>

<style scoped lang="scss">
.perks {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 1rem;
    margin-bottom: 3rem;
}

.perk {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 1rem 1.25rem;
    border: 1px solid var(--app-border);
    border-radius: var(--app-radius);
    background: var(--app-surface);
}

.perk-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.875rem;
    background: var(--app-primary-soft);
    color: var(--bs-primary);
}

.perk-title {
    font-weight: 700;
}

.perk-hint {
    color: var(--app-muted);
    font-size: 0.8125rem;
}
</style>
