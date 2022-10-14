<template>
    <tr>
        <td>
            <input
                type="number"
                class="form-control-sm"
                style="width:5em"
                :value="qValue"
                v-on:input="sendChangeEvent"
            />
        </td>
        <td>
            <router-link :to="{name: 'product_detail', params: { id: line.product.id }}">
                {{ line.product.title }}
            </router-link>
        </td>
        <td class="text-right">
            {{ $filters.currencyFilter(line.product.price) }}
        </td>
        <td class="text-right">
            {{ $filters.currencyFilter(line.quantity * line.product.price) }}
        </td>
        <td class="text-center">
            <button class="btn btn-danger" v-on:click="sendRemoveEvent">
                {{ $filters.transFilter('btn.delete') }}
            </button>
        </td>
    </tr>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {BasketModel} from '@/model/basket-model'

const props = defineProps({
    line: {
        type: [BasketModel, Object],
        required: true
    }
})
const emit = defineEmits(['quantity', 'remove'])

const qValue = ref<number>(props.line.quantity)

const sendChangeEvent = ($event: any): void => {
    if ($event.target.value > 0) {
        emit('quantity', Number($event.target.value))
        qValue.value = $event.target.value
    } else {
        emit('quantity', 1)
        qValue.value = 1
        $event.target.value = qValue.value
    }
}

const sendRemoveEvent = (): void => {
    emit('remove', props.line)
}
</script>
