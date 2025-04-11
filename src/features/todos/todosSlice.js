import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 비동기 thunk 액션 생성자
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetch('/api/todos');
  const data = await response.json();
  return data.todos;
});

const initialState = {
  status: 'idle',
  entities: [],
  error: null
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded: {
      reducer(state, action) {
        state.entities.push(action.payload);
      },
      prepare(text) {
        return {
          payload: {
            id: Date.now(),
            text,
            completed: false,
            color: null,
          },
        };
      },
    },
    todoToggled(state, action) {
      const todo = state.entities.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    todoColorSelected(state, action) {
      const { todoId, color } = action.payload;
      const todo = state.entities.find((todo) => todo.id === todoId);
      if (todo) {
        todo.color = color;
      }
    },
    todoDeleted(state, action) {
      const index = state.entities.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) {
        state.entities.splice(index, 1);
      }
    },
    allTodosCompleted(state) {
      state.entities.forEach((todo) => {
        todo.completed = true;
      });
    },
    completedTodosCleared(state) {
      state.entities = state.entities.filter((todo) => !todo.completed);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  todoAdded,
  todoToggled,
  todoColorSelected,
  todoDeleted,
  allTodosCompleted,
  completedTodosCleared,
} = todosSlice.actions;

export const selectTodoIds = (state) => state.todos.entities.map((todo) => todo.id);
export const selectTodoById = (state, todoId) => 
  state.todos.entities.find((todo) => todo.id === todoId);
export const selectTodos = (state) => state.todos.entities;
export const selectTodoStatus = (state) => state.todos.status;
export const selectTodoError = (state) => state.todos.error;

export const selectFilteredTodos = (state) => {
  const todos = selectTodos(state);
  const { status, colors } = state.filters;

  const showAll = status === 'all';
  const showCompleted = status === 'completed';

  return todos.filter((todo) => {
    const statusMatches =
      showAll || (showCompleted ? todo.completed : !todo.completed);
    const colorMatches =
      colors.length === 0 || (todo.color && colors.includes(todo.color));
    return statusMatches && colorMatches;
  });
};

export const selectFilteredTodoIds = (state) =>
  selectFilteredTodos(state).map((todo) => todo.id);

export default todosSlice.reducer; 