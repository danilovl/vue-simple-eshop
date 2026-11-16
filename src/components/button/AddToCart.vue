<template>
    <div v-if="quantity > 0" class="qty-stepper" :class="{'qty-stepper-lg': size === 'lg', 'qty-stepper-sm': size === 'sm'}">
        <button
            type="button"
            :aria-label="$filters.transFilter('btn.remove_from_cart')"
            @click="cartStore.removeProduct(product)"
        >
            <font-awesome-icon :icon="quantity === 1 ? 'fa-solid fa-trash-can' : 'fa-solid fa-minus'"/>
        </button>
        <span class="qty-value" aria-live="polite">{{ quantity }}</span>
        <button
            type="button"
            :aria-label="$filters.transFilter('btn.add_to_cart')"
            @click="cartStore.addProduct(product)"
        >
            <font-awesome-icon icon="fa-solid fa-plus"/>
        </button>
    </div>

    <button
        v-else-if="size === 'sm'"
        type="button"
        class="btn btn-primary add-round"
        :aria-label="$filters.transFilter('btn.add_to_cart')"
        :title="$filters.transFilter('btn.add_to_cart')"
        @click="cartStore.addProduct(product)"
    >
        <font-awesome-icon icon="fa-solid fa-plus"/>
        <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
    </button>

    <button
        v-else
        type="button"
        class="btn btn-primary btn-pill"
        :class="{'btn-lg': size === 'lg'}"
        @click="cartStore.addProduct(product)"
    >
        <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
        <span>{{ $filters.transFilter('btn.add_to_cart') }}</span>
    </button>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import type {ProductModel} from '@/model/product-model'
import {useCartStore} from '@/store/module/cart'

const props = withDefaults(defineProps<{
    product: ProductModel
    size?: 'sm' | 'md' | 'lg'
}>(), {
    size: 'md'
})

const cartStore = useCartStore()

const quantity = computed((): number => cartStore.totalItemByProduct(props.product))
</script>

<style scoped>
.add-round {
    gap: 0.25rem;
    height: 2.25rem;
    padding: 0 0.875rem;
    border-radius: 999px;
    font-size: 0.8125rem;
}

.add-round svg:first-child {
    font-size: 0.625rem;
}
</style>
