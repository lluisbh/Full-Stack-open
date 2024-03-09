import { createContext, useContext, useReducer } from "react"
import PropTypes from 'prop-types';

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "SET": 
            return action.payload
        case "CLEAR":
            return ''
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) =>  {
    const [notification, notificationDispatcher] = useReducer(notificationReducer, '')

    return (
        <NotificationContext.Provider value={[notification, notificationDispatcher]} >
            {props.children}
        </NotificationContext.Provider>
    )
}

NotificationContextProvider.propTypes = {
    children: PropTypes.object.isRequired
}

export default NotificationContext