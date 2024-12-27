const input = document.getElementById("todo-input");
input.addEventListener('keydown', addTodoEnter);

function addTodoEnter(event) {
    if (event.key === "Enter") {
        addTodo();
    }
} //enter 키가 눌리면 addTodo를 실행한다

function addTodo() {
    const input = document.getElementById("todo-input");
    const taskText = input.value; 

    const li = document.createElement("li"); //javascript에서 HTML 생성
    li.innerText = taskText; 

    const completeButton = document.createElement("button");
    completeButton.innerText = "완료";
    completeButton.addEventListener('click', Complete);
    li.appendChild(completeButton);

    document.getElementById("tasks").appendChild(li);
    
    input.value = "";//입력 초기화
}

function Complete(event) {
    const task = event.target.parentElement; 
    // 클릭된 버튼의 부모 요소(<li>)를 찾는다
    const completedList = document.getElementById("completed-tasks"); 

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "삭제";
    deleteButton.addEventListener('click', removeTask);

    task.removeChild(task.querySelector("button")); // 완료 버튼 제거
    task.appendChild(deleteButton); // 삭제 버튼 추가
    completedList.appendChild(task); // 완료 목록에 작업 추가
}

function removeTask(event) {
    const task = event.target.parentElement;
    task.remove();
}
