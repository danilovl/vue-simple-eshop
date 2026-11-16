import {computed, reactive, watch} from 'vue'
import {defineStore} from 'pinia'
import type {LocaleState} from '@/store/type/locale'
import LocaleConstant from '@/constant/locale-constant'

const LOCAL_STORAGE_NAME = 'locale'

export type LocaleOption = {
    text: string;
    value: string;
}

export const useLocaleStore = defineStore('locale', () => {
    const state = reactive<LocaleState>({
        locale: LocaleConstant.EN,
        locales: {
            en: 'English',
            ru: 'Russian'
        }
    })

    let initialized = false

    const getLocale = computed((): string => state.locale)
    const getLocaleLabel = computed((): string => state.locales[state.locale] ?? state.locale)
    const getLocales = computed((): Record<string, string> => state.locales)
    const getLocalesSelect = computed((): LocaleOption[] => {
        return Object.entries(state.locales).map(([value, text]): LocaleOption => ({text, value}))
    })

    const isSupported = (locale: string): boolean => Object.hasOwn(state.locales, locale)

    const setLocale = (locale: string): void => {
        if (isSupported(locale)) {
            state.locale = locale
        }
    }

    function loadLocale(): void {
        const locale = localStorage.getItem(LOCAL_STORAGE_NAME)
        if (locale !== null) {
            setLocale(locale)
        }
    }

    function storeLocale(): void {
        localStorage.setItem(LOCAL_STORAGE_NAME, state.locale)
    }

    const initializeLocale = (): void => {
        if (initialized) {
            return
        }
        initialized = true

        loadLocale()

        watch((): string => state.locale, (): void => storeLocale())
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
