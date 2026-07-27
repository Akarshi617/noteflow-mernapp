import { useEffect, useState } from "react";
import "./App.css";

function App(){

// ✅ ONLY ONE API_URL
const API_URL = import.meta.env.VITE_API_URL;

const [notes,setNotes]=useState([]);
const [title,setTitle]=useState("");
const [content,setContent]=useState("");
const [favorites,setFavorites]=useState([]);
const [trash,setTrash]=useState([]);
const [page,setPage]=useState("dashboard");
const [search,setSearch]=useState("");
const [loading,setLoading]=useState(false);
const [error,setError]=useState("");

const [user,setUser]=useState(
localStorage.getItem("user")
);

const [loginBox,setLoginBox]=useState(false);
const [signupBox,setSignupBox]=useState(false);

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");


// ✅ GET NOTES
const fetchNotes=async()=>{
try{
setLoading(true);

console.log("API:", API_URL); // 🔥 debug

const res=await fetch(`${API_URL}/api/notes`);
const data=await res.json();

setNotes(data);
}
catch(err){
setError("Backend not connected");
}
finally{
setLoading(false);
}
};

useEffect(()=>{
fetchNotes();
},[]);


// ✅ ADD NOTE (FIXED)
const addNote=async()=>{

if(!title || !content){
alert("Please fill all fields");
return;
}

try{

const res=await fetch(`${API_URL}/api/notes`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
title,
content
})
});

if(!res.ok){
throw new Error("Failed to add note");
}

// ✅ refresh from backend (IMPORTANT FIX)
await fetchNotes();

setTitle("");
setContent("");

alert("Note Added Successfully ✅");

}
catch(err){
console.log(err);
alert("Backend Error ❌");
}
};
