import { createSlice } from "@reduxjs/toolkit"

import anecdoteService from '../services/anecdotes'

const sortByVotes = (a, b) => b.votes - a.votes

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],//anecdotesAtStart.map(asObject),
  reducers: {
    modifyAnecdote (state, action) {
      const id = action.payload.id
      const newObject = action.payload
      return state.map(object => object.id === id ? newObject : object)
        .sort(sortByVotes)
    },
    appendAnecdote(state, action) {
      return [...state, action.payload].sort(sortByVotes)
    },
    setAnecdotes(state, action) {
      return action.payload.sort(sortByVotes)
    }
  }
})

export const { modifyAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const result = await anecdoteService.getAll()
    dispatch(setAnecdotes(result))
  }
}

export const addAnecdote = content => {
  return async dispatch => {
    const result = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(result))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const result = await anecdoteService.vote(anecdote)
    dispatch(modifyAnecdote(result))
  }
}

export default anecdoteSlice.reducer
