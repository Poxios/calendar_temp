import React from 'react';
import { useRecoilValue } from 'recoil';
import { startOfWeek, addDays, format } from 'date-fns';
import { todosState, TodoTask } from './atoms';
import './WeeklyView.css';

interface Task {
  type: 'TASK';
  task: string;
  startTime: string;
  endTime: string;
}

const WeeklyView: React.FC = () => {
  const todos = useRecoilValue(todosState);
  const startDate = startOfWeek(new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const hours = Array.from({ length: 24 }, (_, i) => i); // 24시간을 배열로 만듦

  const getTodosForDayAndHour = (day: Date, hour: number) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    return todos[dayKey]?.filter((todo) => {
      if (todo.type === 'TASK') {
        const startHour = parseInt((todo as Task).startTime.split(':')[0], 10);
        return startHour === hour;
      }
      return false;
    });
  };

  return (
    <div className="weekly-view">
      <div className="header-row">
        <div className="time-column"></div>
        {days.map((day) => (
          <div className="day-column" key={day.toString()}>
            <div className="day-header">{format(day, 'EEEE, MMM d')}</div>
          </div>
        ))}
      </div>
      {hours.map((hour) => (
        <div className="hour-row" key={hour}>
          <div className="time-column">{`${hour}:00`}</div>
          {days.map((day) => (
            <div className="day-column" key={day.toString()}>
              <ul className="todo-list">
                {getTodosForDayAndHour(day, hour)?.map((todo, index) => (
                  <li
                    key={index}
                    className="todo-item"
                    style={{ backgroundColor: todo.type === 'TASK' ? 'lightblue' : 'transparent' }}
                  >
                    {todo.type === 'TASK' ? `${(todo as Task).startTime} - ${(todo as Task).endTime}: ${todo.task}` : todo.task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WeeklyView;
