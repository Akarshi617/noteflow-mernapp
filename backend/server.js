const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Note = require("./models/Note");

require("dotenv").config();

const app = express();


// Middleware
app.use(
  cors({
    origin: "https://react-notesapp-e4m9.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);


app.use(express.json());



// Home Route
app.get("/", (req,res)=>{
    res.send("🚀 Notes API Running");
});



// MongoDB Connection

mongoose
.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("✅ MongoDB Connected");
})
.catch((err)=>{
    console.log("❌ MongoDB Error:",err.message);
});





// GET NOTES

app.get("/api/notes", async(req,res)=>{

    try{

        const notes = await Note.find();

        res.json(notes);

    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});






// CREATE NOTE

app.post("/api/notes",async(req,res)=>{

    try{

        const {title,content}=req.body;


        const note=new Note({
            title,
            content
        });


        const savedNote=await note.save();


        res.status(201).json(savedNote);


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});






// DELETE NOTE

app.delete("/api/notes/:id",async(req,res)=>{

    try{


        await Note.findByIdAndDelete(req.params.id);


        res.json({
            message:"Deleted Successfully"
        });


    }
    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});






const PORT=process.env.PORT || 5001;


app.listen(PORT,()=>{

    console.log(
        `🚀 Server running at http://localhost:${PORT}`
    );

});