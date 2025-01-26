import {useEffect, useState} from "react"

export default function Todo() {
const [title, setTitle] = useState("");//creating state& hook
const [description, setDesciption] = useState("");
const [todos, setTodos] = useState([]);
const [error, setError] = useState(""); 
const [message, setMessage] = useState("");
const [editId, setEditId] = useState(-1);

//Edit id
const [editTitle, setEditTitle] = useState("");//creating state& hook
const [editDescription, setEditDesciption] = useState("");
const apiUrl = "http://localhost:8000";

const handleSubmit = () =>{
//check inputs
setError("")
if (title.trim() !== ''&& description.trim() !==''){    
    fetch(apiUrl+"/todos", {
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({title, description})
    })
    .then((res) => {
        if (res.ok) {
        //add item to list
            setTodos ([... todos, {title, description}])
            setMessage("Item added successfully")
            setTimeout(() => {
                setMessage("")
            }, 3000);
        }else {
        //set error
            setError("Unable to create Todo item")
        }
    }).catch(()=>{
        setError("Unable to create Todo item")
    })
    }
}
// Edit handling
const handleEdit = (item) =>{
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDesciption(item.description)
}
//Cancel Handle
const handleCancel = ()=>{
    setEditId(-1)
}
//Update handling

const handleUpdate = ()=>{
    setError("")
    if (editTitle.trim() !== ''&& editDescription.trim() !==''){    
        fetch(apiUrl+"/todos/"+editId, {
            method: "PUT",
            headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title : editTitle, description : editDescription})
        })
        .then((res) => {
            if (res.ok) {
            //Update item to list
                const updatedTodos = todos.map((item) => {
                    if(item._id == editId){
                        item.title =editTitle;
                        item.description = editDescription;
                    }
                    return item;
                })
                setTodos (updatedTodos)
                setMessage("Item Updated successfully")
                setTimeout(() => {
                    setMessage("")
                }, 3000);
                setEditId(-1) // close edit box 
            }else {
            //set error
                setError("Unable to update Todo item")
            }
        }).catch(()=>{
            setError("Unable to update Todo item")
        })
    }
}

//Detele item
const handleDetele = (id) =>{
    // if(window.confirm("Are you sure want to delete this list")){
        fetch(apiUrl+'/todos/'+id,{ //use '/todos' as "todos"--> will not delete in database
            method : "DELETE"
        }).then(()=>{
            const updatedTodos = todos.filter((item) => item._id !==id)
            setTodos(updatedTodos)
        })
    // }
}
    useEffect(()=>{
        getItems()//Calling
    },[])

    const getItems = () =>{
        fetch(apiUrl+"/todos")
        .then((res)=>res.json())
        .then((res)=>{
            setTodos(res) //mongodb docs store in setTodos dependency array
        })
    }
    return <>
    <div className="row p-3 bg-success text-light w-90%" >
        <h1>ToDo Project with MERN stack</h1> 
    </div>
    <div class="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
            <input placeholder="Title" onChange={(e) =>setTitle(e.target.value)} value={title}className="form-control" type="text"></input>
            <input placeholder="Description" onChange={(e) =>setDesciption(e.target.value)} value={description} className="form-control" type="text"></input>
            <button className="btn btn-dark" onClick ={handleSubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3">
    <h3>Task</h3>
        <ul className="list-group ">
            {
                todos.map((item)=> <li className="list-group-item d-flex bg-info justify-content-between border-solid align-items-center my-2">
                <div className="d-flex flex-column">
                    {
                        editId == -1 || editId !== item._id? <>
                         <span className="fw-bold">{item.title}</span>
                         <span className>{item.description}</span>
                        </> : <>
                        <div className="form-group d-flex gap-2">
                            <input placeholder="Title" onChange={(e) =>setEditTitle(e.target.value)} value={editTitle}className="form-control" type="text"></input>
                            <input placeholder="Description" onChange={(e) =>setEditDesciption(e.target.value)} value={editDescription} className="form-control" type="text"></input>
                        </div>
                        </>
                    }
                   
                </div>
                <div className="d-flex gap-2">
                { editId ==-1 || editId !== item._id? <button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button> : <button className="btn btn-warning" onClick={handleUpdate}>Update</button>}
                { editId ==-1 || editId!== item._id ?<button className="btn btn-danger" onClick={()=>handleDetele(item._id)}>Delete</button> : <button className="btn btn-danger"onClick={handleCancel}>Cancel</button>}
                </div>
                
            </li>)
            }
           
        </ul>

    </div>
    </>

}