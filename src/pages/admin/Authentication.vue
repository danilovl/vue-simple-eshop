<template>
    <div class="row ">
        <div class="col-sm-8 mx-auto">
            <h4 class="bg-primary text-white text-center p-2">
                {{ $filters.transFilter('text.administration') }}
            </h4>

            <form disabled="disabled">
                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('form.username') }}
                    </label>
                    <input v-model="username" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of usernameErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('form.password') }}
                    </label>
                    <input v-model="password" type="password" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of passwordErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>

                <button class="btn btn-primary me-3" @click="handleAuth">
                    {{ $filters.transFilter('btn.login') }}
                </button>
                <button class="btn btn-danger" @click="clear">
                    {{ $filters.transFilter('btn.clear') }}
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useVuelidate} from '@vuelidate/core'
import {required, minLength, maxLength} from '@vuelidate/validators'
import {AuthModel} from '@/model/auth-model'
import {useAuthStore} from '@/store/module/auth'
import {useAlertStore} from '@/store/module/alert'
import {AlertModel} from '@/model/alert-model'
import AlertConstant from '@/constant/alert-constant'
import transFilter from '@/filter/trans-filter'

export default defineComponent({
    name: 'Authentication',
    data: () => ({
        showPassword: false,
        username: '',
        password: ''
    }),
    validations: {
        username: {
            required,
            maxLength: maxLength(10)
        },
        password: {
            required,
            minLength: minLength(4),
            maxLength: maxLength(10)
        }
    },
    setup() {
        const authStore = useAuthStore()

        return {
            authStore,
            v$: useVuelidate()
        }
    },
    computed: {
        usernameErrors(): string[] {
            const errors: string[] = []
            if (!this.v$.username.$dirty) {
                return errors
            }

            if (this.v$.username.maxLength.$invalid) {
                errors.push('Username must be at most 10 characters long')
            }

            if (this.v$.username.required.$invalid) {
                errors.push('Username is required.')
            }

            return errors
        },
        passwordErrors(): string[] {
            const errors: any[] = []
            if (!this.v$.password.$dirty) {
                return errors
            }

            if (this.v$.password.minLength.$invalid) {
                errors.push('Password must be at more 4 characters long')
            }

            if (this.v$.password.maxLength.$invalid) {
                errors.push('Password must be at less 10 characters long')
            }

            if (this.v$.password.required.$invalid) {
                errors.push('Password is required')
            }

            return errors
        }
    },
    methods: {
        async handleAuth(): Promise<any> {
            this.v$.$touch()
            if (this.v$.$invalid) {
                return
            }

            const authModel = new AuthModel(this.username, this.password)
            await this.authStore.authenticate(authModel)

            if (this.authStore.isAuthenticated) {
                await this.$router.push({name: 'admin_product_list'})
            } else {
                const alertStore = useAlertStore()
                const alert: AlertModel = new AlertModel(AlertConstant.ERROR, transFilter('text.authentication_failed'))

                alertStore.addAlert(alert)
            }
        },
        clear(): void {
            this.v$.$reset()
            this.username = ''
            this.password = ''
        }
    }
})
</script>
