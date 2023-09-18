<template>
    <div class="me-2">
        <router-link
            class="btn btn-sm bg-dark text-white"
            :to="{name: 'cart'}"
        >
            <font-awesome-icon icon="fa-solid fa-cart-shopping"/>
            {{ cartStore.itemCount }}

            <span v-if="cartStore.itemCount > 0">
                 ({{ $filters.currencyFilter(cartStore.totalPrice) }})
            </span>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import {useCartStore} from '@/store/module/cart'

const cartStore = useCartStore()
</script>
