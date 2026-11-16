import enJson from '@/locale/en.json'
import ruJson from '@/locale/ru.json'
import LocaleConstant from '@/constant/locale-constant'
import {useLocaleStore} from '@/store/module/locale'

type Locale = Record<string, string>

const locales: Record<string, Locale> = {
    en: enJson,
    ru: ruJson
}

export default function transFilter(key: string, locale: string = LocaleConstant.EN): string {
    const localeStore = useLocaleStore()
    const chooseLocale = localeStore.getLocale || locale
    const messages = locales[chooseLocale] ?? locales[LocaleConstant.EN]

    return messages?.[key] ?? locales[LocaleConstant.EN]?.[key] ?? `[Trans error]: key ${key} not found`
}
