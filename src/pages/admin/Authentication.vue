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
                    <input v-model="state.username" type="text" class="form-control">
                    <div class="form-text text-danger" v-for="(error, index) of usernameErrors" :key="index">
                        <div class="error-msg">{{ error }}</div>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">
                        {{ $filters.transFilter('form.password') }}
                    </label>
                    <input v-model="state.password" type="password" class="form-control">
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

<script setup lang="ts">
import {computed, reactive} from 'vue'
import {useRouter} from 'vue-router'
import {useVuelidate} from '@vuelidate/core'
import {required, minLength, maxLength} from '@vuelidate/validators'
import {AuthModel} from '@/model/auth-model'
import {useAuthStore} from '@/store/module/auth'
import {useAlertStore} from '@/store/module/alert'
import {AlertModel} from '@/model/alert-model'
import AlertConstant from '@/constant/alert-constant'
import transFilter from '@/filter/trans-filter'

const router = useRouter()

const state = reactive({
    showPassword: false,
    username: '',
    password: ''
})

const rules = {
    username: {
        required,
        maxLength: maxLength(10)
    },
    password: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(10)
    }
}
const authStore = useAuthStore()
const v$ = useVuelidate(rules, state)

const usernameErrors = computed((): string[] => {
    const errors: string[] = []
    if (!v$.value.username.$dirty) {
        return errors
    }

    if (v$.value.username.maxLength.$invalid) {
        errors.push('Username must be at most 10 characters long')
    }

    if (v$.value.username.required.$invalid) {
        errors.push('Username is required.')
    }

    return errors
})

const passwordErrors = computed((): string[] => {
    const errors: any[] = []
    if (!v$.value.password.$dirty) {
        return errors
    }

    if (v$.value.password.minLength.$invalid) {
        errors.push('Password must be at more 4 characters long')
    }

    if (v$.value.password.maxLength.$invalid) {
        errors.push('Password must be at less 10 characters long')
    }

    if (v$.value.password.required.$invalid) {
        errors.push('Password is required')
    }

    return errors
})


const handleAuth = async (): Promise<any> => {
    v$.value.$touch()
    if (v$.value.$invalid) {
        return
    }

    const authModel = new AuthModel(state.username, state.password)
    await authStore.authenticate(authModel)

    if (authStore.isAuthenticated) {
        await router.push({name: 'admin_product_list'})
    } else {
        const alertStore = useAlertStore()
        const alert: AlertModel = new AlertModel(AlertConstant.ERROR, transFilter('text.authentication_failed'))

        alertStore.addAlert(alert)
    }
}

const clear = (): void => {
    v$.value.$reset()
    state.username = ''
    state.password = ''
}
</script>
