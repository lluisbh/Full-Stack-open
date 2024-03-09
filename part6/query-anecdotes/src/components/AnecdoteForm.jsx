import { useMutation, useQueryClient } from "@tanstack/react-query"
import anecdotesService from "../services/anecdotes"
import { useNotificationDispatch } from "../NotificationContextHooks"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()
  const newAnecdoteMutation = useMutation({
    mutationFn: anecdotesService.createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      notificationDispatch({type: 'SET', payload: `anecdote "${newAnecdote.content}" added`})
      window.setTimeout(() => notificationDispatch({ type: 'CLEAR'}), 5000)
    },
    onError: (error) => {
      notificationDispatch({type: 'SET', payload: error.response.data.error})
      window.setTimeout(() => notificationDispatch({ type: 'CLEAR'}), 5000)
    }
  })


  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate(content)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
