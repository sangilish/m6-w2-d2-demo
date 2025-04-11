import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { availableColors, capitalize } from '../filters/colors';
import { statusFilterChanged, colorFilterChanged } from '../filters/filtersSlice';
import {
  selectTodos,
  allTodosCompleted,
  completedTodosCleared,
} from '../todos/todosSlice';

const RemainingTodos = ({ count }) => {
  const suffix = count === 1 ? '' : 's';
  return (
    <div className="remaining-todos">
      <h5>Remaining Todos</h5>
      {count} item{suffix} left
    </div>
  );
};

const StatusFilter = ({ value: status, onChange }) => {
  const renderedFilters = Object.keys(StatusFilters).map((key) => {
    const value = StatusFilters[key];
    const handleClick = () => onChange(value);
    const className = value === status ? 'selected' : '';

    return (
      <button key={value} className={className} onClick={handleClick}>
        {key}
      </button>
    );
  });

  return (
    <div className="status-filters">
      <h5>Filter by Status</h5>
      {renderedFilters}
    </div>
  );
};

const ColorFilters = ({ value: colors, onChange }) => {
  const renderedColors = availableColors.map((color) => {
    const checked = colors.includes(color);
    const handleChange = () => {
      const changeType = checked ? 'removed' : 'added';
      onChange({ color, changeType });
    };

    return (
      <label key={color}>
        <input
          type="checkbox"
          name={color}
          checked={checked}
          onChange={handleChange}
        />
        <span className={`color-block ${color}`}></span>
        {capitalize(color)}
      </label>
    );
  });

  return (
    <div className="color-filters">
      <h5>Filter by Color</h5>
      {renderedColors}
    </div>
  );
};

const Footer = () => {
  const dispatch = useDispatch();

  const todosRemaining = useSelector((state) => {
    const uncompletedTodos = selectTodos(state).filter((todo) => !todo.completed);
    return uncompletedTodos.length;
  });

  const { status, colors } = useSelector((state) => state.filters);

  const onMarkCompletedClicked = () => dispatch(allTodosCompleted());
  const onClearCompletedClicked = () => dispatch(completedTodosCleared());

  const onColorChange = ({ color, changeType }) =>
    dispatch(colorFilterChanged({ color, changeType }));

  const onStatusChange = (status) => dispatch(statusFilterChanged(status));

  return (
    <footer className="footer">
      <div className="actions">
        <h5>Actions</h5>
        <button onClick={onMarkCompletedClicked}>
          Mark All Completed
        </button>
        <button onClick={onClearCompletedClicked}>
          Clear Completed
        </button>
      </div>

      <RemainingTodos count={todosRemaining} />

      <div className="filters">
        <StatusFilter value={status} onChange={onStatusChange} />
        <ColorFilters value={colors} onChange={onColorChange} />
      </div>
    </footer>
  );
};

export const StatusFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
};

export default Footer; 