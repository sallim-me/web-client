import './App.css';
import TodoContext from './context/TodoContext';

function App() {
  const {text, setText, todos, editingId, setEditingId, editText, setEditText, addTodo, deleteTodo, updateTodo} = TodoContext;

  return (
    <>
      <form onSubmit={TodoContext.handleSubmit}>
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
