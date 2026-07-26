import { useEffect, useState } from "react";
import "./App.css";


function App() {


  const [notes, setNotes] = useState([]);

  const [title,setTitle] = useState("");
  const [content,setContent] = useState("");

  const [favorites,setFavorites] = useState([]);
  const [trash,setTrash] = useState([]);

  const [page,setPage] = useState("dashboard");

  const [search,setSearch] = useState("");

  const [user,setUser] = useState(
    localStorage.getItem("user")
  );


  const [loginBox,setLoginBox] = useState(false);
  const [signupBox,setSignupBox] = useState(false);


  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");




  // Fetch Notes From Backend

  const fetchNotes = async()=>{

    try{

      const res = await fetch(
        "http://localhost:5001/api/notes"
      );

      const data = await res.json();

      setNotes(data);

    }
    catch(error){

      console.log(error);

    }

  }



  useEffect(()=>{

    fetchNotes();

  },[]);





  // Add Note


  const addNote = async()=>{


    if(!title || !content){

      alert("Please fill all fields");

      return;

    }


    await fetch(
      "http://localhost:5001/api/notes",
      {

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },


        body:JSON.stringify({

          title,
          content

        })

      }
    );


    setTitle("");

    setContent("");

    fetchNotes();


  }





  // Favorite


  const toggleFavorite=(note)=>{


    const exist =
    favorites.find(
      item=>item._id===note._id
    );


    if(exist){


      setFavorites(
        favorites.filter(
          item=>item._id!==note._id
        )
      );


    }

    else{


      setFavorites([
        ...favorites,
        note
      ]);


    }


  }





  // Delete to Trash


  const deleteNote=(note)=>{


    setTrash([
      ...trash,
      note
    ]);


    setNotes(
      notes.filter(
        item=>item._id!==note._id
      )
    );


  }







  // Signup


  const signup=()=>{


    if(!name || !email || !password){

      alert("Fill all details");

      return;

    }


    localStorage.setItem(
      "user",
      name
    );


    setUser(name);


    setSignupBox(false);


    alert("Signup Successful");


  }







  // Login


  const login=()=>{


    if(!email || !password){

      alert("Enter email and password");

      return;

    }


    let savedUser =
    localStorage.getItem("user");


    if(savedUser){


      setUser(savedUser);

      setLoginBox(false);


      alert("Login Successful");


    }

    else{

      alert("Please Signup First");

    }


  }







  // Logout


  const logout=()=>{


    localStorage.removeItem(
      "user"
    );


    setUser(null);


  }







  let displayNotes = notes;



  if(page==="favorites"){

    displayNotes=favorites;

  }



  if(page==="trash"){

    displayNotes=trash;

  }





  displayNotes =
  displayNotes.filter(

    note=>

    note.title
    .toLowerCase()
    .includes(
      search.toLowerCase()
    )

  );







return (

<div className="dashboard">



{/* Sidebar */}


<div className="sidebar">


<h1>
✨ NoteFlow
</h1>


<p>
Capture. Organize. Remember.
</p>



<div className="menu">


<button
onClick={()=>setPage("dashboard")}
>
🏠 Dashboard
</button>


<button
onClick={()=>setPage("notes")}
>
📝 My Notes
</button>



<button
onClick={()=>setPage("favorites")}
>
⭐ Favorites
</button>



<button
onClick={()=>setPage("trash")}
>
🗑 Trash
</button>



</div>





<div className="auth">


{

user ?


<div className="profile">


<div className="avatar">

{user
.slice(0,2)
.toUpperCase()}

</div>


<h3>
{user}
</h3>


<button
onClick={logout}
>
Logout
</button>


</div>



:

<>


<button
onClick={()=>setLoginBox(true)}
>
Login
</button>


<button
onClick={()=>setSignupBox(true)}
>
Signup
</button>


</>


}



</div>



</div>








{/* Main */}


<div className="main">



<div className="topbar">


<h1>
Welcome {user || "Guest"} 👋
</h1>


<input

placeholder="🔍 Search notes..."

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>


</div>








<div className="cards">


<div>

<h2>
{notes.length}
</h2>

<p>
Total Notes
</p>

</div>




<div>

<h2>
⭐ {favorites.length}
</h2>

<p>
Favorites
</p>

</div>




<div>

<h2>
🚀
</h2>

<p>
Productivity
</p>

</div>



</div>









{/* Create Note */}



{
page!=="trash" &&


<div className="create">


<h2>
Create New Note
</h2>


<input

placeholder="Note title"

value={title}

onChange={
e=>setTitle(e.target.value)
}

/>



<textarea

placeholder="Write your note..."

value={content}

onChange={
e=>setContent(e.target.value)
}

/>




<button
onClick={addNote}
>

➕ Add Note

</button>



</div>


}










<h2>
📚 
{
page==="favorites"
?
"Favorite Notes"
:
page==="trash"
?
"Trash Notes"
:
"All Notes"
}

</h2>





<div className="notes">


{

displayNotes.map(note=>(


<div
className="note-card"
key={note._id}
>


<h3>
📌 {note.title}
</h3>


<p>
{note.content}
</p>



<div className="actions">


<button
onClick={()=>toggleFavorite(note)}
>

⭐

</button>



<button
onClick={()=>deleteNote(note)}
>

🗑

</button>


</div>



</div>


))


}



</div>





</div>









{/* Login Modal */}


{

loginBox &&


<div className="modal">


<h2>
Login
</h2>


<input
placeholder="Email"
onChange={
e=>setEmail(e.target.value)
}
/>


<input

type="password"

placeholder="Password"

onChange={
e=>setPassword(e.target.value)
}

/>


<button
onClick={login}
>
Login
</button>


</div>


}







{/* Signup Modal */}



{

signupBox &&


<div className="modal">


<h2>
Signup
</h2>



<input

placeholder="Name"

onChange={
e=>setName(e.target.value)
}

/>



<input

placeholder="Email"

onChange={
e=>setEmail(e.target.value)
}

/>



<input

type="password"

placeholder="Password"

onChange={
e=>setPassword(e.target.value)
}

/>



<button
onClick={signup}
>
Create Account
</button>



</div>


}




</div>


);


}


export default App;