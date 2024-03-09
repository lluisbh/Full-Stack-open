import { useContext } from "react"
import NotificationContext from "./NotificationContext"

export const useNotificationValue = () => {
    const allValues = useContext(NotificationContext)
    return allValues[0]
}

export const useNotificationDispatch = () => {
    const allValues = useContext(NotificationContext)
    return allValues[1]
}
