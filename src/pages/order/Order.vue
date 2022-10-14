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
                    <input v-model="name" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of nameErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('form.email') }}
                    </label>
                    <input v-model="email" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of emailErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('form.city') }}
                    </label>
                    <input v-model="city" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of cityErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('form.address') }}
                    </label>
                    <input v-model="address" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of addressErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>

                <div class="mb-3 form-check">
                    <input v-model="checkbox" type="checkbox" class="form-check-input">
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

<script lang="ts">
import {defineComponent} from 'vue'
import {useVuelidate} from '@vuelidate/core'
import {required, maxLength, email} from '@vuelidate/validators'
import {OrderModel} from '@/model/order-model'
import {useCartStore} from '@/store/module/cart'
import {useOrderStore} from '@/store/module/order'

export default defineComponent({
    name: 'Order',
    data: () => ({
        name: '',
        email: '',
        city: '',
        address: '',
        checkbox: false
    }),
    validations: {
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
    },
    setup() {
        const orderStore = useOrderStore()
        const cartStore = useCartStore()

        return {
            v$: useVuelidate(),
            storeOrder: orderStore.storeOrder,
            clearCart: cartStore.clearCartData
        }
    },
    computed: {
        checkboxErrors(): string[] {
            const errors: string[] = []
            if (!this.v$.checkbox.$dirty) {
                return errors
            }

            if (this.v$.checkbox.checked.$invalid) {
                errors.push('You must agree to continue!')
            }

            return errors
        },
        nameErrors(): string[] {
            const errors: string[] = []
            if (!this.v$.name.$dirty) {
                return errors
            }

            if (this.v$.name.maxLength.$invalid) {
                errors.push('Name must be at most 10 characters long')
            }

            if (this.v$.name.required.$invalid) {
                errors.push('Name is required.')
            }

            return errors
        },
        emailErrors(): string[] {
            const errors: string[] = []
            if (!this.v$.email.$dirty) {
                return errors
            }

            if (this.v$.email.email.$invalid) {
                errors.push('Must be is not valid e-mail')
            }

            if (this.v$.email.required.$invalid) {
                errors.push('E-mail is required')
            }

            return errors
        },
        cityErrors(): string[] {
            const errors: string[] = []
            if (!this.v$.city.$dirty) {
                return errors
            }

            if (this.v$.city.maxLength.$invalid) {
                errors.push('City must be at most 150 characters long')
            }

            if (this.v$.city.required.$invalid) {
                errors.push('City is required.')
            }

            return errors
        },
        addressErrors(): string[] {
            const errors: string[] = []
            if (!this.v$.address.$dirty) {
                return errors
            }

            if (this.v$.address.maxLength.$invalid) {
                errors.push('Address must be at most 10 characters long')
            }

            if (this.v$.address.required.$invalid) {
                errors.push('Address is required.')
            }

            return errors
        }
    },
    methods: {
        async submitOrder(): Promise<any> {
            this.v$.$touch()

            if (this.v$.$invalid) {
                return
            }

            const cartStore = useCartStore()

            const order = new OrderModel(
                this.name,
                this.email,
                this.city,
                this.address,
                cartStore.getLines(),
                false
            )

            await this.storeOrder(order)
            this.clearCart()
            await this.$router.push('/order-thanks')
        },
        clear(): void {
            this.v$.$reset()
            this.name = ''
            this.email = ''
            this.city = ''
            this.address = ''
            this.checkbox = false
        }
    }
})
</script>
