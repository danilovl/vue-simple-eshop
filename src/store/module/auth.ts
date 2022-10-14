import {computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import Axios from 'axios'
import type {AxiosInstance} from 'axios'
import type {AuthState} from '@/store/type/auth'
import type {AuthModel} from '@/model/auth-model'
import ApiConstant from '@/constant/api-constant'

export const useAuthStore = defineStore('auth', ()  => {
    const state = reactive<AuthState>({
        verifyToken: false,
        authenticated: false,
        jwt: null
    }) as AuthState

    const isAuthenticated = computed((): boolean => state.authenticated)

    const authenticatedAxios = (): AxiosInstance => {
        return Axios.create({
            headers: {
                Authorization: `Authentication<${state.jwt}>`
            }
        })
    }

    const setAuthenticated = (header: string): void => {
        state.jwt = header
        state.authenticated = true

        localStorage.setItem('user-token', state.jwt)
    }

    const setVerifyToken = (isVerify: boolean): void => {
        state.verifyToken = isVerify
    }

    const logout = (): void => {
        state.authenticated = false
        state.jwt = null

        localStorage.removeItem('user-token')
    }

    const verifyToken = async (token: string): Promise<any> => {
        const response = await Axios.create({
            headers: {
                Authorization: `Authentication<${token}>`
            }
        }).post(ApiConstant.VERIFY_TOKEN_URL)

        setVerifyToken(response.data.success === true)
    }

    const initializeAuthenticate = async (): Promise<any> => {
        const token = localStorage.getItem('user-token')
        if (token === null) {
            logout()

            return
        }

        await verifyToken(token).then((): void => {
            if (state.verifyToken) {
                setAuthenticated(token)
            } else {
                logout()
            }
        })
    }

    const authenticate = async (credentials: AuthModel): Promise<any> => {
        const response = await Axios.post(ApiConstant.LOGIN_URL, credentials)
        if (response.data.success === true) {
            setAuthenticated(response.data.token)
        }
    }

    return {
        isAuthenticated,
        authenticate,
        authenticatedAxios,
        logout,
        initializeAuthenticate
    }
})
