import {computed, ref} from 'vue'
import {defineStore} from 'pinia'

export type Theme = 'light' | 'dark'

const LOCAL_STORAGE_NAME = 'theme'

function readStoredTheme(): Theme | null {
    try {
        const value = localStorage.getItem(LOCAL_STORAGE_NAME)

        return value === 'light' || value === 'dark' ? value : null
    } catch {
        return null
    }
}

function systemTheme(): Theme {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
    const theme = ref<Theme>(readStoredTheme() ?? systemTheme())

    const isDark = computed((): boolean => theme.value === 'dark')

    const apply = (): void => {
        document.documentElement.setAttribute('data-bs-theme', theme.value)
    }

    const setTheme = (value: Theme): void => {
        theme.value = value
        apply()

        try {
            localStorage.setItem(LOCAL_STORAGE_NAME, value)
        } catch {
        }
    }

    const toggleTheme = (): void => setTheme(isDark.value ? 'light' : 'dark')

    const initializeTheme = (): void => apply()

    return {
        theme,
        isDark,
        setTheme,
        toggleTheme,
        initializeTheme
    }
})
