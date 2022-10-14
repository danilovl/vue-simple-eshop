import {computed, reactive, watch} from 'vue'
import {defineStore} from 'pinia'
import type {LocaleState} from '@/store/type/locale'

export const useLocaleStore = defineStore('locale', ()  => {
    const state = reactive<LocaleState>({
        locale: 'en',
        locales: {
            en: 'English',
            ru: 'Russian'
        }
    }) as LocaleState

    const getLocale = computed((): string => state.locale)
    const getLocaleLabel = computed((): string => state.locales[state.locale])
    const getLocales = computed((): Object => state.locales)
    const getLocalesSelect = computed((): Object[] => {
        const locales = state.locales

        return Object.keys(locales).map(key => ({
            text: locales[key],
            value: key
        }))
    })

    const setLocale = (locale: string): void => {
        state.locale = locale
    }

    function loadLocale(): void {
        const locale = localStorage.getItem('locale')
        if (locale !== null) {
            setLocale(locale)
        }
    }

    function storeLocale(): void {
        localStorage.setItem('locale', state.locale)
    }

    const initializeLocale = (): void => {
        loadLocale()

        watch(
            (): string => state.locale,
            (): void => storeLocale(),
            {deep: true}
        )
    }

    return {
        getLocale,
        getLocaleLabel,
        getLocales,
        getLocalesSelect,
        setLocale,
        initializeLocale
    }
})
