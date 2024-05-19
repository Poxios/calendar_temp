import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths } from 'date-fns';
import Modal from 'react-modal';
import { todosState, TodoTask } from './atoms';
import './Calendar.css';

Modal.setAppElement('#root');

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [todoType, setTodoType] = useState<'TODO' | 'TASK'>('TODO');
  const [taskDetails, setTaskDetails] = useState({ task: '', startTime: '', endTime: '' });
  const [todoDetails, setTodoDetails] = useState({ task: '' });
  const [todos, setTodos] = useRecoilState(todosState);

  const renderHeader = () => {
    const dateFormat = "yyyy년 M월";
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={prevMonth}>{'<'}</div>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">{'>'}</div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEEE";
    const days = [];

    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate ?? new Date()) ? "selected" : ""
            }`}
            key={day.toString()}
            onClick={() => openModal(cloneDay)}
          >
            <span className="number">{formattedDate}</span>
            {todos[format(day, 'yyyy-MM-dd')] && (
              <ul className="todo-list">
                {todos[format(day, 'yyyy-MM-dd')].map((todo, index) => (
                  <li
                    key={index}
                    style={{ backgroundColor: todo.type === 'TASK' ? getRandomColor() : 'transparent' }}
                  >
                    {todo.type === 'TASK'
                      ? `${todo.startTime} - ${todo.endTime}: ${todo.task}`
                      : todo.task}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const openModal = (day: Date) => {
    setSelectedDate(day);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setTodoDetails({ task: '' });
    setTaskDetails({ task: '', startTime: '', endTime: '' });
  };

  const handleAddTodo = () => {
    if (selectedDate) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const newTodos = { ...todos };

      if (!newTodos[dateKey]) {
        newTodos[dateKey] = [];
      }

      if (todoType === 'TODO') {
        newTodos[dateKey] = [...newTodos[dateKey], { type: 'TODO', task: todoDetails.task }];
      } else {
        newTodos[dateKey] = [
          ...newTodos[dateKey],
          {
            type: 'TASK',
            task: taskDetails.task,
            startTime: taskDetails.startTime,
            endTime: taskDetails.endTime,
          },
        ];
      }

      setTodos(newTodos);
      closeModal();
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
        <h2>{selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}</h2>
        <div>
          <label>
            <input
              type="radio"
              value="TODO"
              checked={todoType === 'TODO'}
              onChange={() => setTodoType('TODO')}
            />
            할 일
          </label>
          <label>
            <input
              type="radio"
              value="TASK"
              checked={todoType === 'TASK'}
              onChange={() => setTodoType('TASK')}
            />
            일정
          </label>
        </div>
        {todoType === 'TODO' && (
          <input
            type="text"
            placeholder="Todo"
            value={todoDetails.task}
            onChange={(e) => setTodoDetails({ ...todoDetails, task: e.target.value })}
          />
        )}
        {todoType === 'TASK' && (
          <>
            <input
              type="text"
              placeholder="Task"
              value={taskDetails.task}
              onChange={(e) => setTaskDetails({ ...taskDetails, task: e.target.value })}
            />
            <input
              type="time"
              value={taskDetails.startTime}
              onChange={(e) => setTaskDetails({ ...taskDetails, startTime: e.target.value })}
            />
            <input
              type="time"
              value={taskDetails.endTime}
              onChange={(e) => setTaskDetails({ ...taskDetails, endTime: e.target.value })}
            />
          </>
        )}
        <button onClick={handleAddTodo}>Add</button>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Calendar;
