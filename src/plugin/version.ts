import type {App} from '@vue/runtime-core'

export default {
    install: (app: App, options?: any): void => {
        const {version} = options
        app.config.globalProperties.$version = (): void => console.log(`Demo application version ${version}`)
    }
}
