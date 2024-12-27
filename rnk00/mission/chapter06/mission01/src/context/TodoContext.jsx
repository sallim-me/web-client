import { createContext, useState } from "react";

export const TodoContext = createContext();

function TodoContextProvider({ children }) {
    const [todos, setTodos] = useState([
        { id: 1, task: '투두 추가하기' },
        { id: 2, task: '투두 수정하기' },
        { id: 3, task: '투두 삭제하기' },
    ]);
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState('');
    const [editText, setEditText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // 새로고침 방지
    };

    const addTodo = () => {
        if (text.trim().length === 0) {
            alert('todo를 입력하십시오.');
        }
        setTodos((prevTodos) => [
            ...prevTodos, // 이전 값 복사
            { id: Math.floor(Math.random() * 100) + 2, task: text },
        ]);
        setText('');
    };

    const deleteTodo = (id) => {
        setTodos((prevTodos) => prevTodos.filter((item) => item.id !== id));
    };

    const updateTodo = (id, text) => {
        setTodos((prev) =>
            prev.map((item) => (item.id === id ? { ...item, task: text } : item))
        );
        setEditingId(''); // 수정 후 editingId 초기화
    };

    return (
        <TodoContext.Provider value={{
            text, setText, todos, setTodos, editingId, setEditingId, editText, setEditText, handleSubmit, addTodo, deleteTodo, updateTodo
        }}>
            {children}
        </TodoContext.Provider>
    );
}

// default export 추가
export default TodoContextProvider;
