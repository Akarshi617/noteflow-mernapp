import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const API_URL = import.meta.env.VITE_API_URL;

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [favorites, setFavorites] = useState([]);
  const [trash, setTrash] = useState([]);

  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState(localStorage.getItem("user"));

  const [loginBox, setLoginBox] = useState(false);
  const [signupBox, setSignupBox] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ GET NOTES
  const fetchNotes = async () => {
    try {
      setLoading(true);

      console.log("API:", API_URL);

      const res = await fetch(`${API_URL}/api/notes`);

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await res.json();
      setNotes(data);

    } catch (err) {
      console.log(err);
      setError("Backend not connected ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // ✅ ADD NOTE
  const addNote = async () => {
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          content
        })
      });

      if (!res.ok) {
        throw new Error("Failed to add note");
      }

      await fetchNotes();

      setTitle("");
      setContent("");

      alert("Note Added Successfully ✅");

    } catch (err) {
      console.log(err);
      alert("Backend Error ❌");
    }
  };

  // ✅ DELETE NOTE
  const deleteNote = async (note) => {
    try {
      await fetch(`${API_URL}/api/notes/${note._id}`, {
        method: "DELETE"
      });

      setTrash([...trash, note]);

      setNotes(notes.filter(item => item._id !== note._id));

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FAVORITE
  const toggleFavorite = (note) => {
    const exist = favorites.find(item => item._id === note._id);

    if (exist) {
      setFavorites(favorites.filter(item => item._id !== note._id));
    } else {
      setFavorites([...favorites, note]);
    }
  };

  // ✅ SIGNUP
  const signup = () => {
    if (!name || !email || !password) {
      alert("Fill all details");
      return;
    }

    localStorage.setItem("user", name);
    setUser(name);
    setSignupBox(false);

    alert("Signup Successful");
  };

  // ✅ LOGIN
  const login = () => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(savedUser);
      setLoginBox(false);
      alert("Login Successful");
    } else {
      alert("Please Signup First");
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ FILTER NOTES
  let displayNotes = notes;

  if (page === "favorites") displayNotes = favorites;
  if (page === "trash") displayNotes = trash;

  displayNotes = displayNotes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">

        <h1>✨ NoteFlow</h1>
        <p>Capture. Organize. Remember.</p>

        <div className="menu">
          <button onClick={() => setPage("dashboard")}>🏠 Dashboard</button>
          <button onClick={() => setPage("notes")}>📝 My Notes</button>
          <button onClick={() => setPage("favorites")}>⭐ Favorites</button>
          <button onClick={() => setPage("trash")}>🗑 Trash</button>
        </div>

        <div className="auth">
          {user ? (
            <div className="profile">
              <div className="avatar">
                {user.slice(0, 2).toUpperCase()}
              </div>
              <h3>{user}</h3>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <>
              <button onClick={() => setLoginBox(true)}>Login</button>
              <button onClick={() => setSignupBox(true)}>Signup</button>
            </>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        <div className="topbar">
          <h1>Welcome {user || "Guest"} 👋</h1>

          <input
            placeholder="🔍 Search notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* CREATE NOTE */}
        {page !== "trash" && (
          <div className="create">
            <h2>Create New Note</h2>

            <input
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button onClick={addNote}>➕ Add Note</button>
          </div>
        )}

        {loading && <h3>Loading Notes...</h3>}
        {error && <h3>{error}</h3>}

        <h2>📚 Notes</h2>

        <div className="notes">
          {displayNotes.map(note => (
            <div className="note-card" key={note._id}>
              <h3>📌 {note.title}</h3>
              <p>{note.content}</p>

              <div className="actions">
                <button onClick={() => toggleFavorite(note)}>⭐</button>
                <button onClick={() => deleteNote(note)}>🗑</button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* LOGIN */}
      {loginBox && (
        <div className="modal">
          <h2>Login</h2>

          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

          <button onClick={login}>Login</button>
        </div>
      )}

      {/* SIGNUP */}
      {signupBox && (
        <div className="modal">
          <h2>Signup</h2>

          <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

          <button onClick={signup}>Create Account</button>
        </div>
      )}

    </div>
  );
}

export default App;
