<template>
    <div class="alert"
         v-for="(alert, index) in alertStore.getAlertsOnce()"
         :key="index"
         :class="alert.type"
    >
        {{ alert.text }}
    </div>
</template>

<script setup lang="ts">
import {useAlertStore} from '@/store/module/alert'

const alertStore = useAlertStore()
</script>
