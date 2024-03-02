import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const newAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.text.value
        event.target.text.value = ''
        dispatch(addAnecdote(content))
        dispatch(setNotification(`You created the anecdote "${content}".`))
        setTimeout(() => dispatch(clearNotification()), 5000)
    }

    return (
        <form onSubmit={newAnecdote}>
            <div><input name='text' /></div>
            <button>create</button>
        </form>
    )
}

export default AnecdoteForm