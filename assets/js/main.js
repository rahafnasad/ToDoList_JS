const tableBody=document.querySelector(".tableTasks tbody ");
const searchInput=document.getElementById("search");
const EditForm=document.getElementById("editForm");
const editInput = document.getElementById("inputEdit");
const inputIdEdit=document.getElementById("hiddenEditInput");
 const loading = document.querySelector(".loading");
 let load=false;

// function to get all tasks from API
const  getTasks= async ()=>{
    try {
        const response = await fetch("https://dummyjson.com/todos");
const {todos} = await response.json();
localStorage.setItem("toDos",JSON.stringify(todos));
showTasks();

    }
catch (error){
    throw new Error(error.message)
}

}
// function to get All Tasks From Local storage
const getTasksFromLocalStorage =()=>{
const toDos = localStorage.getItem("toDos");
if (toDos){
    
    return JSON.parse(toDos);
}
else {

    return ;
}
}
// function to add task to HTML document
const showTasks =()=>{
    const tasks = getTasksFromLocalStorage();
    tableBody.innerHTML = '';
    let countId=1;

    tasks.forEach(element => {
        const newRow = document.createElement('tr');
        newRow.setAttribute('completed', element.completed);
        newRow.innerHTML =  `
        <tr >
          <th scope="row">${countId}</th>
          <td class ="taskToDo">${element.todo}</td>
          <td>${element.userId}</td>
    <td class="${element.completed ? 'IsCompleted' : 'IsPending'}">
            ${element.completed?'completed':'Pending'}</td>
          <td>
            <button class="EditButton" onclick="EditTask(${element.id},'${element.todo}')"> <i class="fa-solid fa-pen"></i> Edit</button>
            <button class="DeleteButton" onclick="deleteTask(${element.id})">  Delete</button>
            <button class="DoneButton" onclick="updateStataus(${element.id})"> ${element.completed ? 'Undo' : 'Done'}</button>
          </td>
        </tr>
      `;
      countId++;
      tableBody.appendChild(newRow);
    });
}
// function to add new task 

const addNewTask =async (e)=>{
try{
    e.preventDefault();
    const newTaskInput = document.getElementById("newTask");
    const validate = document.getElementById("taskValidate");
    if (!newTaskInput.value){
        validate.innerHTML="Task is missing or invalid ! ⚠️";
        validate.style.color="red";
        setTimeout(()=>{validate.innerHTML=""},4000)

        return ;
    }
    // last index in tasks array
    const Tasks = getTasksFromLocalStorage();
    const id = Tasks.at(-1).id+1;
    
const newTask={
    id,
    todo:newTaskInput.value,
    completed:false,
    userId:2,
}  
const response = await fetch("https://dummyjson.com/todos/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });
Tasks.push(newTask);

if (response.ok){
    validate.innerHTML="task added successfully ✅";
    validate.style.color="green";
    newTaskInput.value="";
    setTimeout(()=>{validate.innerHTML=""},4000)
    localStorage.removeItem("toDos");
localStorage.setItem("toDos",JSON.stringify(Tasks));
showTasks();

}
}
catch(error){
    throw new Error("Failed to add task " +error.message)
}

}
//function to delete task 
const deleteTask=(id)=>{
const deleteModal=document.getElementById("modal");
deleteModal.style.visibility="visible";
localStorage.setItem("id",id);
}
const confirmRemoveTask = async()=>{
 try{
    const id = localStorage.getItem("id");
    const tasks = getTasksFromLocalStorage();
    const newTasks=tasks.filter(task=> task.id!=id);
    const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: "DELETE",
      });
   if(response.ok){
    localStorage.removeItem("toDos");
    localStorage.setItem("toDos",JSON.stringify(newTasks));
    showTasks();
    HideModal();
   }
 
 }
    catch(error){
        throw new Error("error : "+error.message)
    }
}
const HideModal=()=>{
    const deleteModal=document.getElementById("modal");
deleteModal.style.visibility="hidden";


}
const HideModalEdit=()=>{
    const deleteModal=document.getElementById("modalEdit");
deleteModal.style.visibility="hidden";


}
// function to UpDate Status
const updateStataus = async(id)=>{
const tasks = getTasksFromLocalStorage();
tasks.forEach((task)=>{
if (task.id===id){
task.completed=!(task.completed);

}

});
localStorage.removeItem("toDos");
localStorage.setItem("toDos",JSON.stringify(tasks))
showTasks();

} 
// CalC Total Task , Completed Tasks , Uncompleted Taskd
const getTotal = ()=>{
    const tasks = getTasksFromLocalStorage();
    const total = document.getElementById("totalTasks");
    const completedTasksCount = document.getElementById("completedTasks");
    const RemainingTasksCount = document.getElementById("RemainingTasks");

    let completedCount=0;
    let unCompletedCount=0;
    tasks.forEach((task)=>{
        if(task.completed) {
            completedCount++;
        }
        else {
            unCompletedCount++;
        }
    })
    if (tasks) {
        total.innerHTML=`Total Items : <span>${tasks.length}</span>`;}

    if (completedCount){
        completedTasksCount.innerHTML=`Completed Items : <span> ${completedCount} </span>`;}
        if (unCompletedCount){
            RemainingTasksCount.innerHTML=`Remaining Items :  <span>${unCompletedCount}</span>`;}

    }

    // Function => Search IN All tasks descriptions
    const searchDescription =()=>{
        const valueToSearch=searchInput.value;
        const tasks = getTasksFromLocalStorage();
    tableBody.innerHTML = '';
    let countId=1;

    tasks.forEach(element => {
        if (element.todo.toUpperCase().includes(valueToSearch.toUpperCase())) {
        const newRow = document.createElement('tr');
        newRow.setAttribute('completed', element.completed);
        newRow.innerHTML =  `
        <tr >
          <th scope="row">${countId}</th>
          <td class ="taskToDo">${element.todo}</td>
          <td>${element.userId}</td>
    <td class="${element.completed ? 'IsCompleted' : 'IsPending'}">
            ${element.completed?'completed':'Pending'}</td>
          <td>
            <button class="EditButton" onclick="EditTask(${element.id},'${element.todo}')"> <i class="fa-solid fa-pen"></i> Edit</button>
            <button class="DeleteButton" onclick="deleteTask(${element.id})">  Delete</button>
            <button class="DoneButton" onclick="updateStataus(${element.id})"> ${element.completed ? 'Undo' : 'Done'}</button>
          </td>
        </tr>
      `;
      countId++;
      tableBody.appendChild(newRow);}
    });

        
    }

    const EditTask = (id , description)=>{
        
        const deleteModal=document.getElementById("modalEdit");
        deleteModal.style.visibility="visible";
        inputIdEdit.value=id;
        editInput.value=description;
    }
    // For Form Edit
    const confirmEditTask = (e)=>{
        e.preventDefault();
        const description = editInput.value;
        const id = inputIdEdit.value;
        const tasks=getTasksFromLocalStorage();
        const validate=document.getElementById("validateEdit");
        if(!description){
            validate.innerHTML="Task is missing or invalid ! ⚠️";
            validate.style.color="red";
            setTimeout(()=>{validate.innerHTML=""},4000)
    
            return ;
        }
        tasks.forEach((task)=>{
            
            if (task.id==id){

                task.todo=description;
            }
        })
        
        localStorage.removeItem("toDos");
        localStorage.setItem("toDos",JSON.stringify(tasks));
        showTasks();
        HideModalEdit();


    }
    // loading 
    window.addEventListener("load" , function (){
        this.setTimeout(function(){
            loading.style.visibility ="hidden";
            document.body.style.overflow="auto";
        },2000)
    })
// function to call all function when needed
const main = () =>
{
 
    getTasks();
    getTotal();
document.getElementById("taskForm").addEventListener("submit",addNewTask);
searchInput.addEventListener("keyup",searchDescription)
EditForm.addEventListener("submit",confirmEditTask);
}
main();