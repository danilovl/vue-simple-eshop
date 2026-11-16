<template>
    <router-link
        class="btn-icon"
        :to="{name: 'cart'}"
        :aria-label="`${$filters.transFilter('text.cart')}: ${cartStore.itemCount}`"
    >
        <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
        <span v-if="cartStore.itemCount > 0" class="counter-badge">{{ cartStore.itemCount }}</span>
    </router-link>
    <span v-if="cartStore.itemCount > 0" class="cart-total d-none d-xl-inline">
        {{ $filters.currencyFilter(cartStore.totalPrice) }}
    </span>
</template>

<script setup lang="ts">
import {useCartStore} from '@/store/module/cart'

const cartStore = useCartStore()
</script>

<style scoped>
.cart-total {
    margin: 0 0.5rem 0 0.125rem;
    font-weight: 700;
    font-size: 0.875rem;
    white-space: nowrap;
}
</style>
