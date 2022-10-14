import enJson from '@/locale/en.json'
import ruJson from '@/locale/ru.json'
import LocaleConstant from '@/constant/locale-constant'
import {useLocaleStore} from '@/store/module/locale'

type Locale = {
    [key: string]: string;
}

type Locales = {
    [key: string]: Locale;
}

const locales: Locales = {
    en: enJson,
    ru: ruJson
}

export default function transFilter(key: string, locale: string = LocaleConstant.EN): string {
    const localeStore = useLocaleStore()
    const chooseLocale = localeStore.getLocale || locale

    return locales[chooseLocale][key] || `[Trans error]: key ${key} not found`
}
