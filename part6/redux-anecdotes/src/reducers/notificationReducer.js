import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'reducer',
    initialState: {
        content: '',
        count: 0,
    },
    reducers: {
        setNotificationUncleared(state, action) {
            state.content = action.payload
            state.count += 1
        },
        clearNotification(state) {
            if (state.count <= 1) { //Avoid clearing if other messages were sent since then
                state.content = ''
                state.count = 1
            }
            state.count -= 1
            
        }
    }
})

export const { setNotificationUncleared, clearNotification } = notificationSlice.actions

export const setNotification = (content, seconds) => {
    return dispatch => {
        dispatch(setNotificationUncleared(content))
        setTimeout(() => dispatch(clearNotification()), seconds*1000)
    }
}
export default notificationSlice.reducer