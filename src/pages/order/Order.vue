<template>
    <div>
        <div class="page-header">
            <div>
                <h1>{{ $filters.transFilter('text.order_form') }}</h1>
            </div>
            <router-link :to="{name: 'cart'}" class="btn btn-ghost btn-pill">
                <font-awesome-icon icon="fa-solid fa-arrow-left"/>
                {{ $filters.transFilter('text.cart') }}
            </router-link>
        </div>

        <Empty
            v-if="cartStore.itemCount === 0"
            icon="fa-solid fa-cart-shopping"
            title="text.your_cart_is_empty"
            text="text.cart_empty_hint"
        />

        <form v-else class="row g-4" novalidate @submit.prevent="submitOrder">
            <div class="col-lg-7">
                <div class="surface surface-padded">
                    <h2 class="form-section-title">
                        <span class="step">1</span>
                        {{ $filters.transFilter('text.contact_details') }}
                    </h2>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <form-field id="order-name" :label="$filters.transFilter('form.name')" :errors="nameErrors" v-slot="{invalid}">
                                <input id="order-name" v-model.trim="state.name" type="text" class="form-control" :class="{'is-invalid': invalid}" autocomplete="name">
                            </form-field>
                        </div>
                        <div class="col-md-6">
                            <form-field id="order-email" :label="$filters.transFilter('form.email')" :errors="emailErrors" v-slot="{invalid}">
                                <input id="order-email" v-model.trim="state.email" type="email" class="form-control" :class="{'is-invalid': invalid}" autocomplete="email">
                            </form-field>
                        </div>
                    </div>

                    <h2 class="form-section-title mt-4 pt-2">
                        <span class="step">2</span>
                        {{ $filters.transFilter('text.delivery_address') }}
                    </h2>

                    <div class="row g-3">
                        <div class="col-md-5">
                            <form-field id="order-city" :label="$filters.transFilter('form.city')" :errors="cityErrors" v-slot="{invalid}">
                                <input id="order-city" v-model.trim="state.city" type="text" class="form-control" :class="{'is-invalid': invalid}" autocomplete="address-level2">
                            </form-field>
                        </div>
                        <div class="col-md-7">
                            <form-field id="order-address" :label="$filters.transFilter('form.address')" :errors="addressErrors" v-slot="{invalid}">
                                <input id="order-address" v-model.trim="state.address" type="text" class="form-control" :class="{'is-invalid': invalid}" autocomplete="street-address">
                            </form-field>
                        </div>
                    </div>

                    <div class="form-check mt-4">
                        <input id="order-agree" v-model="state.checkbox" type="checkbox" class="form-check-input" :class="{'is-invalid': checkboxErrors.length > 0}">
                        <label for="order-agree" class="form-check-label">
                            {{ $filters.transFilter('form.do_you_agree') }}
                        </label>
                        <div v-for="error of checkboxErrors" :key="error" class="invalid-feedback d-block">{{ error }}</div>
                    </div>

                    <div class="d-flex flex-wrap gap-2 mt-4">
                        <button type="button" class="btn btn-ghost btn-pill" :disabled="submitting" @click="clear">
                            {{ $filters.transFilter('btn.clear') }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-lg-5">
                <order-summary show-items>
                    <button type="submit" class="btn btn-primary btn-lg btn-pill w-100" :disabled="submitting">
                        <span v-if="submitting" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <font-awesome-icon v-else icon="fa-solid fa-lock"/>
                        {{ $filters.transFilter('btn.send_order') }}
                    </button>
                </order-summary>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useVuelidate} from '@vuelidate/core'
import {required, maxLength, email} from '@vuelidate/validators'
import {OrderModel} from '@/model/order-model'
import Empty from '@/components/Empty.vue'
import OrderSummary from '@/components/OrderSummary.vue'
import FormField from '@/components/ui/FormField.vue'
import {useCartStore} from '@/store/module/cart'
import {useOrderStore} from '@/store/module/order'
import {fieldErrors} from '@/helper/validation'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const submitting = ref<boolean>(false)

const state = reactive({
    name: '',
    email: '',
    city: '',
    address: '',
    checkbox: false
})

const rules = {
    name: {
        required,
        maxLength: maxLength(50)
    },
    email: {
        required,
        email
    },
    city: {
        required,
        maxLength: maxLength(50)
    },
    address: {
        required,
        maxLength: maxLength(100)
    },
    checkbox: {
        checked: (val: boolean): boolean => val
    }
}

const v$ = useVuelidate(rules, state)

const nameErrors = computed((): string[] => fieldErrors(v$.value.name))
const emailErrors = computed((): string[] => fieldErrors(v$.value.email))
const cityErrors = computed((): string[] => fieldErrors(v$.value.city))
const addressErrors = computed((): string[] => fieldErrors(v$.value.address))
const checkboxErrors = computed((): string[] => fieldErrors(v$.value.checkbox))

const submitOrder = async (): Promise<void> => {
    if (submitting.value) {
        return
    }

    v$.value.$touch()
    if (v$.value.$invalid || cartStore.itemCount === 0) {
        return
    }

    submitting.value = true

    try {
        const order = new OrderModel(state.name, state.email, state.city, state.address, [], false)
        const orderId = await orderStore.storeOrder(order)

        if (orderId === null) {
            return
        }

        cartStore.clearCartData()
        await router.push({name: 'order_thanks', query: {id: String(orderId)}})
    } finally {
        submitting.value = false
    }
}

const clear = (): void => {
    v$.value.$reset()
    state.name = ''
    state.email = ''
    state.city = ''
    state.address = ''
    state.checkbox = false
}
</script>
