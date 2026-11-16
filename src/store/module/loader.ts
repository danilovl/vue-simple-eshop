import {computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import type {LoaderState} from '@/store/type/loader'

export const useLoaderStore = defineStore('loader', () => {
    const state = reactive<LoaderState>({
        pending: 0,
        absolute: false
    })

    const isLoading = computed((): boolean => state.pending > 0)
    const isAbsolute = computed((): boolean => state.absolute)

    const setLoading = (loading: boolean): void => {
        state.pending = loading ? state.pending + 1 : Math.max(0, state.pending - 1)
    }

    const withLoading = async <T>(action: () => Promise<T>): Promise<T> => {
        setLoading(true)
        try {
            return await action()
        } finally {
            setLoading(false)
        }
    }

    return {
        isLoading,
        isAbsolute,
        setLoading,
        withLoading
    }
})
