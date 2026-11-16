import type {App} from 'vue'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faHeart as faHeartRegular,
    faStar as faStarRegular,
    faMoneyBill1
} from '@fortawesome/free-regular-svg-icons'
import {
    faAnglesRight,
    faArrowLeft,
    faArrowRight,
    faBagShopping,
    faBoxOpen,
    faCartShopping,
    faCheck,
    faCircleCheck,
    faCircleExclamation,
    faCircleInfo,
    faDollarSign,
    faEye,
    faGlobe,
    faHeart,
    faHouse,
    faLock,
    faMagnifyingGlass,
    faMinus,
    faMoon,
    faPen,
    faPlus,
    faReceipt,
    faRightFromBracket,
    faRotateLeft,
    faScrewdriverWrench,
    faShieldHalved,
    faStar,
    faSun,
    faTrashCan,
    faTriangleExclamation,
    faTruckFast,
    faUser,
    faXmark
} from '@fortawesome/free-solid-svg-icons'

export default {
    install: (app: App): void => {
        library.add(
            faHeartRegular,
            faStarRegular,
            faMoneyBill1,
            faAnglesRight,
            faArrowLeft,
            faArrowRight,
            faBagShopping,
            faBoxOpen,
            faCartShopping,
            faCheck,
            faCircleCheck,
            faCircleExclamation,
            faCircleInfo,
            faDollarSign,
            faEye,
            faGlobe,
            faHeart,
            faHouse,
            faLock,
            faMagnifyingGlass,
            faMinus,
            faMoon,
            faPen,
            faPlus,
            faReceipt,
            faRightFromBracket,
            faRotateLeft,
            faScrewdriverWrench,
            faShieldHalved,
            faStar,
            faSun,
            faTrashCan,
            faTriangleExclamation,
            faTruckFast,
            faUser,
            faXmark
        )

        app.component('font-awesome-icon', FontAwesomeIcon)
    }
}
