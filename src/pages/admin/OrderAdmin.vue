<template>
    <div>
        <button
            class="btn"
            :class="showProcessed ? 'btn-warning' : 'btn-primary'"
            v-on:click="showProcessed = !showProcessed"
        >
            {{ $filters.transFilter(showProcessed ? 'btn.show_processed' : 'btn.show_not_processed') }}
        </button>

        <table class="table">
            <thead>
            <tr>
                <th class="text-left">{{ $filters.transFilter('text.id') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.name') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.city') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.address') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.total') }}</th>
                <th class="text-left">{{ $filters.transFilter('text.action') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="order in displayOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.email }}</td>
                <td>{{ order.city }}</td>
                <td>{{ order.address }}</td>
                <td>{{ $filters.currencyFilter(getTotal(order)) }}</td>
                <td>
                    <button
                        class="btn"
                        :class="showProcessed ? 'btn-warning' : 'btn-primary'"
                        v-on:click="processOrder(order)"
                    >
                        {{ $filters.transFilter(order.processed ? 'btn.not_processed' : 'btn.processed') }}
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import type {BasketModel} from '@/model/basket-model'
import type {OrderModel} from '@/model/order-model'
import {useOrderStore} from '@/store/module/order'

const orderStore = useOrderStore()
await orderStore.loadOrders()

const showProcessed = ref<boolean>(false)

const displayOrders = computed((): OrderModel[] => {
    return orderStore.getOrders().filter((order: OrderModel): boolean => order.processed !== showProcessed.value)
})

const getTotal = (order: OrderModel): number => {
    if (order.basket.length === 0) {
        return 0
    }

    return order.basket.reduce((total: number, line: BasketModel): number => {
        return total + (line.quantity * line.product.price)
    }, 0)
}
const processOrder = (order: OrderModel): void => {
    orderStore.updateOrder(order)
}
</script>
