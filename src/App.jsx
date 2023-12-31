import { useEffect, useState } from 'react'
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const db = getDatabase();
 let [text,setText] = useState("")
 let [firebase,setfirebase] = useState([])
 let [togglebtn, setTogglebtn] = useState(false)
 let [firebaseid, setFirbaseid] = useState()

 let handleForm = (e)=>{
  setText(e.target.value);
 }
 // Write operation
 let handleAdd = ()=>{
  //console.log(text);
  set(push(ref(db,"allfirebase-db")),{
    firebase:text,
  })
  setText("")
 }

 

  // Read operation
  useEffect(()=>{
      const firebaseRef = ref(db, 'allfirebase-db');
      onValue(firebaseRef, (snapshot) => {
      let arr = []
     snapshot.forEach((item)=>{
      arr.push({...item.val(),id:item.key});
     })
     setfirebase(arr)
    });

    },[])
   // Delete operation
    let handleDelete = (id) => {
      
      remove(ref(db, 'allfirebase-db/' + id)).then(()=>(
       
        toast('🦄 Delete!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          })
      ))
    }
    //All delete
    let handleAllDelete = () =>{
      remove(ref(db, 'allfirebase-db')).then(()=>(
        console.log("All Delete Done")
      ))
    }

    //update operation
    let handleUpdate = (item) => {
      setFirbaseid(item.id)
      setText(item.firebase)
      setTogglebtn(true)
    }
    let handleEdit = () =>{
      console.log(text);
      console.log(firebaseid);
      update(ref(db,'allfirebase-db/' + firebaseid),{
        firebase: text,
      }).then(()=>{

        setTogglebtn(false),
        setText("")
    })
    }

  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      />
      <ToastContainer />
    <div>
    <input onChange={handleForm} value={text} placeholder='enter your text' />
    {togglebtn
    ?
    <button onClick={handleEdit} >Edit</button>
    :
    <button onClick={handleAdd} >Add</button>
    }

    </div>
    <div>
    <button onClick={handleAllDelete}>All Delete</button>
    </div>
    <ul>
      {
       firebase.map((item,index)=>(
         
         <li
          key={index}>{item.firebase}
          <button onClick={()=>handleDelete(item.id)}>Delete</button>
          <button onClick={()=>handleUpdate(item)}>Update</button>
          </li>
       )) 
      }
     
    </ul>
    </>
  )
}

export default App
