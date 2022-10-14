import {reactive} from 'vue'
import {defineStore} from 'pinia'
import type {AlertModel} from '@/model/alert-model'
import type {AlertState} from '@/store/type/alert'

export const useAlertStore = defineStore('alert', ()  => {
    const state = reactive<AlertState>({
        alerts: []
    }) as AlertState

    const getAlertsOnce = (): AlertModel[] => {
        setTimeout((): void => {
            state.alerts = []
        }, 3000)

        return state.alerts
    }

    const addAlert = (alert: AlertModel): void => {
        state.alerts.push(alert)
    }

    return {
        getAlertsOnce,
        addAlert
    }
})
