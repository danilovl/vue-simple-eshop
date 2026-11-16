<template>
    <div>
        <div class="page-header">
            <div>
                <h1>{{ $filters.transFilter('text.cart') }}</h1>
                <p v-if="cartStore.itemCount > 0">{{ $filters.transFilter('text.items') }}: {{ cartStore.itemCount }}</p>
            </div>
        </div>

        <Empty
            v-if="cartStore.lines.length === 0"
            icon="fa-solid fa-cart-shopping"
            title="text.your_cart_is_empty"
            text="text.cart_empty_hint"
        />

        <div v-else class="row g-4">
            <div class="col-lg-8">
                <div class="surface px-3 px-md-4 py-1">
                    <shopping-cart-line
                        v-for="line in cartStore.lines"
                        :key="String(line.product.id)"
                        :line="line"
                        @quantity="cartStore.changeQuantity(line, $event)"
                        @remove="cartStore.removeLine(line)"
                    />
                </div>

                <router-link :to="{name: 'home'}" class="btn btn-ghost btn-pill mt-4">
                    <font-awesome-icon icon="fa-solid fa-arrow-left"/>
                    {{ $filters.transFilter('btn.continue_shopping') }}
                </router-link>
            </div>

            <div class="col-lg-4">
                <order-summary>
                    <router-link :to="{name: 'order'}" class="btn btn-primary btn-lg btn-pill w-100">
                        {{ $filters.transFilter('btn.checkout') }}
                        <font-awesome-icon icon="fa-solid fa-arrow-right"/>
                    </router-link>
                </order-summary>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useCartStore} from '@/store/module/cart'
import ShoppingCartLine from '@/components/ShoppingCartLine.vue'
import OrderSummary from '@/components/OrderSummary.vue'
import Empty from '@/components/Empty.vue'

const cartStore = useCartStore()
</script>
