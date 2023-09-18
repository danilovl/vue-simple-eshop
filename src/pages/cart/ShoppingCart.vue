<template>
    <h3 class="text-center mb-4">
        {{ $filters.transFilter('text.cart') }}
    </h3>

    <Empty v-if="cartStore.getLines().length === 0"/>
    <div v-else>
        <table class="table">
            <thead>
            <tr>
                <th class="text-left">{{ $filters.transFilter('text.quantity') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.product') }}</th>
                <th class="text-right">{{ $filters.transFilter('text.price') }}</th>
                <th class="text-right">{{ $filters.transFilter('text.subtotal') }}</th>
            </tr>
            </thead>
            <tbody>
            <shopping-cart-line
                v-for="line in cartStore.getLines()"
                :key="line.product.id"
                :line="line"
                v-on:quantity="cartStore.changeQuantity(line, $event)"
                v-on:remove="cartStore.removeLine(line)"
            />
            </tbody>
            <tfoot>
            <tr>
                <td colspan="3" class="text-right">
                    {{ $filters.transFilter('text.total') }}:
                </td>
                <td class="text-right">
                    {{ $filters.currencyFilter(cartStore.totalPrice) }}
                </td>
            </tr>
            </tfoot>
        </table>

        <div class="text-center">
            <router-link :to="{name: 'home'}" class="btn btn-success me-3">
                {{ $filters.transFilter('btn.continue_shopping') }}
            </router-link>

            <router-link :to="{name: 'order'}" class="btn btn-warning">
                {{ $filters.transFilter('btn.checkout') }}
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useCartStore} from '@/store/module/cart'
import ShoppingCartLine from '@/components/ShoppingCartLine.vue'
import Empty from '@/components/Empty.vue'

const cartStore = useCartStore()
</script>
