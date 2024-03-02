import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => 
        state.anecdotes.filter(v => v.content.toUpperCase().includes(state.filter.toUpperCase()))
    )
    const dispatch = useDispatch()

    return (
        anecdotes.map(anecdote =>
            <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => {
                        dispatch(voteAnecdote(anecdote.id))
                        dispatch(setNotification(`You voted "${anecdote.content}".`))
                        setTimeout(() => dispatch(clearNotification()), 5000)
                    }
                }>vote</button>
            </div>
            </div>
        )
    )
}

export default AnecdoteList