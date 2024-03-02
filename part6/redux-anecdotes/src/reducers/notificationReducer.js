import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'reducer',
    initialState: {
        content: '',
        count: 0,
    },
    reducers: {
        setNotification(state, action) {
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

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer