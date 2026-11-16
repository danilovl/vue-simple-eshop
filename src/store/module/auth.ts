import {computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import Axios from 'axios'
import type {AxiosInstance} from 'axios'
import type {AuthState} from '@/store/type/auth'
import type {AuthModel} from '@/model/auth-model'
import ApiConstant from '@/constant/api-constant'

const TOKEN_STORAGE_KEY = 'user-token'

const authHeader = (token: string): string => `Authentication<${token}>`

export const useAuthStore = defineStore('auth', () => {
    const state = reactive<AuthState>({
        authenticated: false,
        jwt: null
    })

    let initializePromise: Promise<void> | null = null

    const isAuthenticated = computed((): boolean => state.authenticated)

    const setAuthenticated = (token: string): void => {
        state.jwt = token
        state.authenticated = true

        localStorage.setItem(TOKEN_STORAGE_KEY, token)
    }

    const logout = (): void => {
        state.authenticated = false
        state.jwt = null

        localStorage.removeItem(TOKEN_STORAGE_KEY)
    }

    const http: AxiosInstance = Axios.create()
    http.interceptors.request.use(config => {
        if (state.jwt) {
            config.headers.set('Authorization', authHeader(state.jwt))
        }

        return config
    })
    http.interceptors.response.use(
        response => response,
        error => {
            if (Axios.isAxiosError(error) && error.response?.status === 401) {
                logout()
            }

            return Promise.reject(error)
        }
    )

    const authenticatedAxios = (): AxiosInstance => http

    const verifyToken = async (token: string): Promise<boolean> => {
        const response = await Axios.post(ApiConstant.VERIFY_TOKEN_URL, null, {
            headers: {Authorization: authHeader(token)}
        })

        return response.data?.success === true
    }

    const doInitialize = async (): Promise<void> => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY)
        if (token === null) {
            logout()

            return
        }

        try {
            if (await verifyToken(token)) {
                setAuthenticated(token)
            } else {
                logout()
            }
        } catch {
            // Server unreachable: keep the token so the session survives until the API is back.
            state.authenticated = false
            state.jwt = null
        }
    }

    const initializeAuthenticate = (): Promise<void> => {
        if (initializePromise === null) {
            initializePromise = doInitialize()
        }

        return initializePromise
    }

    const authenticate = async (credentials: AuthModel): Promise<boolean> => {
        const response = await Axios.post(ApiConstant.LOGIN_URL, credentials)
        if (response.data?.success === true && typeof response.data.token === 'string') {
            setAuthenticated(response.data.token)

            return true
        }

        return false
    }

    return {
        isAuthenticated,
        authenticate,
        authenticatedAxios,
        logout,
        initializeAuthenticate
    }
})
