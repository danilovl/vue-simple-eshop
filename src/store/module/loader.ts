import {computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import type {LoaderState} from '@/store/type/loader'

export const useLoaderStore = defineStore('loader', ()  => {
    const state = reactive<LoaderState>({
        loading: false,
        absolute: false
    }) as LoaderState

    const isLoading = computed((): boolean => state.loading)
    const isAbsolute = computed((): boolean => state.absolute)

    const setLoading = (loading: boolean): void => {
        state.loading = loading
    }

    return {
        isLoading,
        isAbsolute,
        setLoading
    }
})
