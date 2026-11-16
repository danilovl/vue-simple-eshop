import {computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import Axios from 'axios'
import transFilter from '@/filter/trans-filter'
import {AlertModel} from '@/model/alert-model'
import AlertConstant from '@/constant/alert-constant'
import type {AlertState} from '@/store/type/alert'

const ALERT_LIFETIME_MS = 3000

let nextAlertId = 1

export function errorMessage(error: unknown): string {
    if (Axios.isAxiosError(error) && !error.response) {
        return transFilter('alert.network_error')
    }

    if (error instanceof Error) {
        return error.message
    }

    return String(error)
}

export const useAlertStore = defineStore('alert', () => {
    const state = reactive<AlertState>({
        alerts: []
    })

    const alerts = computed((): AlertState['alerts'] => state.alerts)

    const removeAlert = (id: number): void => {
        state.alerts = state.alerts.filter(alert => alert.id !== id)
    }

    const addAlert = (alert: AlertModel): void => {
        const id = nextAlertId++
        state.alerts.push({id, type: alert.type, text: alert.text})

        setTimeout((): void => removeAlert(id), ALERT_LIFETIME_MS)
    }

    const addError = (error: unknown): void => {
        addAlert(new AlertModel(AlertConstant.ERROR, errorMessage(error)))
    }

    const addSuccess = (text: string): void => {
        addAlert(new AlertModel(AlertConstant.SUCCESS, text))
    }

    return {
        alerts,
        addAlert,
        addError,
        addSuccess,
        removeAlert
    }
})
