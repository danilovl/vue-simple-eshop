<template>
    <h3 class="text-center">
        {{ $filters.transFilter('text.order_form') }}
    </h3>

    <div class="row ">
        <div class="col-sm-8 mx-auto">
            <form disabled="disabled">
                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('form.name') }}
                    </label>
                    <input v-model="state.name" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of nameErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('form.email') }}
                    </label>
                    <input v-model="state.email" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of emailErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('form.city') }}
                    </label>
                    <input v-model="state.city" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of cityErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('form.address') }}
                    </label>
                    <input v-model="state.address" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of addressErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>

                <div class="mb-3 form-check">
                    <input v-model="state.checkbox" type="checkbox" class="form-check-input">
                    <label class="form-check-label">
                        {{ $filters.transFilter('form.do_you_agree') }}
                    </label>
                    <div class="form-text text-danger" v-for="(error, index) of checkboxErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>

                <button class="btn btn-primary me-3" @click="submitOrder">
                    {{ $filters.transFilter('btn.send_order') }}
                </button>
                <button class="btn btn-danger" @click="clear">
                    {{ $filters.transFilter('btn.delete') }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, reactive} from 'vue'
import {useRouter} from 'vue-router'
import {useVuelidate} from '@vuelidate/core'
import {required, maxLength, email} from '@vuelidate/validators'
import {OrderModel} from '@/model/order-model'
import {useCartStore} from '@/store/module/cart'
import {useOrderStore} from '@/store/module/order'

const router = useRouter()

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
        maxLength: maxLength(10)
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
        checked(val: boolean): boolean {
            return val
        }
    }
}

const storeOrder = useOrderStore().storeOrder
const clearCart = useCartStore().clearCartData
const v$ = useVuelidate(rules, state)

const checkboxErrors = computed((): string[] => {
    const errors: string[] = []
    if (!v$.value.checkbox.$dirty) {
        return errors
    }

    if (v$.value.checkbox.checked.$invalid) {
        errors.push('You must agree to continue!')
    }

    return errors
})

const nameErrors = computed((): string[] => {
    const errors: string[] = []
    if (!v$.value.name.$dirty) {
        return errors
    }

    if (v$.value.name.maxLength.$invalid) {
        errors.push('Name must be at most 10 characters long')
    }

    if (v$.value.name.required.$invalid) {
        errors.push('Name is required.')
    }

    return errors
})

const emailErrors = computed((): string[] => {
    const errors: string[] = []
    if (!v$.value.email.$dirty) {
        return errors
    }

    if (v$.value.email.email.$invalid) {
        errors.push('Must be is not valid e-mail')
    }

    if (v$.value.email.required.$invalid) {
        errors.push('E-mail is required')
    }

    return errors
})

const cityErrors = computed((): string[] => {
    const errors: string[] = []
    if (!v$.value.city.$dirty) {
        return errors
    }

    if (v$.value.city.maxLength.$invalid) {
        errors.push('City must be at most 150 characters long')
    }

    if (v$.value.city.required.$invalid) {
        errors.push('City is required.')
    }

    return errors
})

const addressErrors = computed((): string[] => {
    const errors: string[] = []
    if (!v$.value.address.$dirty) {
        return errors
    }

    if (v$.value.address.maxLength.$invalid) {
        errors.push('Address must be at most 10 characters long')
    }

    if (v$.value.address.required.$invalid) {
        errors.push('Address is required.')
    }

    return errors
})

const submitOrder = async (): Promise<any> => {
    v$.value.$touch()
    if (v$.value.$invalid) {
        return
    }

    const cartStore = useCartStore()

    const order = new OrderModel(
        state.name,
        state.email,
        state.city,
        state.address,
        cartStore.getLines(),
        false
    )

    await storeOrder(order)
    clearCart()
    await router.push('/order-thanks')
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
