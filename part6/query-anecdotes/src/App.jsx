import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import anecdotesService from './services/anecdotes'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotificationDispatch } from './NotificationContextHooks'

const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()
  const voteAnecdoteMutation = useMutation({
    mutationFn: anecdotesService.vote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(
        a => a.id === updatedAnecdote.id ? updatedAnecdote : a
      ))
      notificationDispatch({ type: 'SET', payload: `anecdote "${updatedAnecdote.content}" voted`, delay: 5})
      window.setTimeout(() => notificationDispatch({ type: 'CLEAR'}), 5000)
    }
  })
  const handleVote = (anecdote) => {
    console.log('vote')
    voteAnecdoteMutation.mutate(anecdote)
  }

  const results = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdotesService.getAll,
    retry: 1,
    refetchOnWindowFocus: false
  })

  if (results.isLoading) 
    return <div>Loading data...</div>

  if (results.isError)
    return <div>anecdote service not available due to problems in server</div>
  
  const anecdotes = results.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
