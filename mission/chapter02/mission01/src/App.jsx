import { useState } from 'react'; // useState를 react에서 가져와야 함
import './App.css';

function App() {
  const [todos, setTodos] = useState([
    { id: 1, task: '투두 추가하기' },
    { id: 2, task: '투두 수정하기' },
    { id: 3, task: '투두 삭제하기' },
  ]);
  console.log(todos);

  const [text, setText] = useState('');
  console.log(text)

  const [editingId, setEditingId] = useState('');
  const [editText, setEditText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // 새로고침 방지
  };

  const addTodo = () => {
    if(text.trim().length===0){
      alert('todo를 입력하십시오.');
    }
    setTodos((prevTodos) => [
      ...prevTodos, //이전 값 복사
      {id:Math.floor(Math.random()*100)+2, task: text},
    ]);
    setText('');
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((item) => item.id !== id));
  }

  const updateTodo = (id, text) => {
    setTodos((prev)=>
      prev.map((item)=>item.id===id?{...item, task:text}:item));
    setEditingId('');
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input 
          type='text' 
          value={text} 
          onChange = {(e) => setText(e.target.value)}
        />
        <button 
          onClick={()=>addTodo()} 
          type='submit'
        >
          할 일 등록
        </button>
      </form>
      <div>
        {todos.map((todo) => (
          <div key={todo.id} style={{ display: 'flex', gap: '20px' }}>
            {editingId !== todo.id && (
              <div style={{ display: 'flex', gap: '5px' }}>
                <p>{todo.id}. </p>
                <p>{todo.task}</p>
              </div>
            )}
            {editingId === todo.id && (
              <div style={{ display: 'flex', gap: '5px' }}>
                <p>{todo.id}. </p>
                <input defaultValue={todo.task} onChange = {(e) =>setEditText(e.target.value)}/>
              </div>
            )}
            <button id='delete' onClick={() => deleteTodo(todo.id)}>삭제하기</button>
            {editingId === todo.id ? (
              <button id='update' onClick={() => updateTodo(editingId, editText)}>수정 완료</button>
            ) : (
              <button id='update2' onClick={() => setEditingId(todo.id)}>수정 진행</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
