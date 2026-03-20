import type {App} from 'vue'

export default {
    install: (app: App): void => {
        app.config.globalProperties.$version = (): void => console.log(`Demo application version '1.0.0'`)
    }
}
