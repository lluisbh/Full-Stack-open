import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const filter = useSelector(state => state.filter)
    const anecdotes = useSelector(state => 
        state.anecdotes
    ).filter(v => v.content.toUpperCase().includes(filter.toUpperCase()))
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
                        dispatch(voteAnecdote(anecdote))
                        dispatch(setNotification(`You voted "${anecdote.content}".`, 5))
                    }
                }>vote</button>
            </div>
            </div>
        )
    )
}

export default AnecdoteList