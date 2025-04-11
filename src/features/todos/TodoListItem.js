import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTodoById, todoToggled, todoColorSelected, todoDeleted } from './todosSlice';

const availableColors = ['green', 'blue', 'orange', 'purple', 'red'];
const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

const TodoListItem = ({ id }) => {
  const todo = useSelector((state) => selectTodoById(state, id));
  const dispatch = useDispatch();

  const { text, completed, color } = todo;

  const handleCompletedChanged = () => {
    dispatch(todoToggled(todo.id));
  };

  const handleColorChanged = (e) => {
    const color = e.target.value;
    dispatch(todoColorSelected({ todoId: todo.id, color }));
  };

  const handleDelete = () => {
    dispatch(todoDeleted(todo.id));
  };

  const colorOptions = availableColors.map((c) => (
    <option key={c} value={c}>
      {capitalize(c)}
    </option>
  ));

  return (
    <li>
      <input
        type="checkbox"
        className="toggle"
        checked={completed}
        onChange={handleCompletedChanged}
      />
      <span className="todo-text">{text}</span>
      <select
        className="colorPicker"
        value={color || ''}
        onChange={handleColorChanged}
      >
        <option value="">No color</option>
        {colorOptions}
      </select>
      <button className="destroy" onClick={handleDelete}>
        ×
      </button>
    </li>
  );
};

export default TodoListItem; 