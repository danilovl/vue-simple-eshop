<template>
    <div class="auth-wrapper">
        <div class="auth-card surface">
            <div class="auth-icon">
                <font-awesome-icon icon="fa-solid fa-lock"/>
            </div>
            <h1 class="auth-title">{{ $filters.transFilter('text.administration') }}</h1>
            <p class="auth-subtitle">{{ $filters.transFilter('text.sign_in_hint') }}</p>

            <form novalidate @submit.prevent="handleAuth">
                <form-field id="auth-username" :label="$filters.transFilter('form.username')" :errors="usernameErrors" v-slot="{invalid}">
                    <input id="auth-username" v-model.trim="state.username" type="text" class="form-control" :class="{'is-invalid': invalid}" autocomplete="username">
                </form-field>

                <form-field id="auth-password" :label="$filters.transFilter('form.password')" :errors="passwordErrors" v-slot="{invalid}">
                    <input id="auth-password" v-model="state.password" type="password" class="form-control" :class="{'is-invalid': invalid}" autocomplete="current-password">
                </form-field>

                <button type="submit" class="btn btn-primary btn-lg btn-pill w-100 mt-4" :disabled="submitting">
                    <span v-if="submitting" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    {{ $filters.transFilter('btn.login') }}
                </button>
                <button type="button" class="btn btn-link w-100 mt-2 text-secondary" :disabled="submitting" @click="clear">
                    {{ $filters.transFilter('btn.clear') }}
                </button>
            </form>

            <p class="auth-demo">
                {{ $filters.transFilter('text.demo_credentials') }} <code>admin</code> / <code>admin</code>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useVuelidate} from '@vuelidate/core'
import {required, minLength, maxLength} from '@vuelidate/validators'
import {AuthModel} from '@/model/auth-model'
import FormField from '@/components/ui/FormField.vue'
import {useAuthStore} from '@/store/module/auth'
import {useAlertStore} from '@/store/module/alert'
import {fieldErrors} from '@/helper/validation'
import transFilter from '@/filter/trans-filter'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const alertStore = useAlertStore()

const submitting = ref<boolean>(false)

const state = reactive({
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

const v$ = useVuelidate(rules, state)

const usernameErrors = computed((): string[] => fieldErrors(v$.value.username))
const passwordErrors = computed((): string[] => fieldErrors(v$.value.password))

// Only internal paths are allowed, so ?redirect= can't send the user to another site.
const redirectTarget = (): string | null => {
    const redirect = route.query.redirect

    return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : null
}

const handleAuth = async (): Promise<void> => {
    if (submitting.value) {
        return
    }

    v$.value.$touch()
    if (v$.value.$invalid) {
        return
    }

    submitting.value = true

    try {
        const success = await authStore.authenticate(new AuthModel(state.username, state.password))

        if (success) {
            await router.push(redirectTarget() ?? {name: 'admin_product_list'})
        } else {
            alertStore.addError(transFilter('text.authentication_failed'))
        }
    } catch (error) {
        alertStore.addError(error)
    } finally {
        submitting.value = false
    }
}

const clear = (): void => {
    v$.value.$reset()
    state.username = ''
    state.password = ''
}
</script>

<style scoped>
.auth-wrapper {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
}

.auth-card {
    width: 100%;
    max-width: 26rem;
    padding: 2.5rem 2rem;
}

.auth-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 3.5rem;
    margin-bottom: 1.25rem;
    border-radius: 1rem;
    background: var(--app-gradient);
    color: #fff;
    font-size: 1.25rem;
    box-shadow: 0 12px 24px -12px rgba(124, 58, 237, 0.8);
}

.auth-title {
    font-size: 1.5rem;
    font-weight: 800;
}

.auth-subtitle {
    margin-bottom: 1.75rem;
    color: var(--app-muted);
}

.auth-demo {
    margin: 1.5rem 0 0;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    background: var(--app-surface-2);
    color: var(--app-muted);
    font-size: 0.875rem;
    text-align: center;
}

.auth-demo code {
    color: var(--bs-primary);
    font-weight: 600;
}
</style>
