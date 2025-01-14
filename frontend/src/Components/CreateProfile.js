import React,{useState} from "react";
import {doc,setDoc} from "firebase/firestore";
import { auth, db } from "../FireBase.js";
import { useNavigate } from "react-router-dom";

const CreateProfile =()=>{
    const [username,setUserName]=useState("");
    const [bio,setBio]=useState("");
    const [skills,setSkills]=useState("");
   const navigate = useNavigate()

    const  handleSubmit = async (e)=>{
        e.preventDefault();
        const user = auth.currentUser;
        if(user){
            try{
                await setDoc(doc(db,"users",user.uid),{
                    username,
                    bio,
                    skills:skills.split(",").map((skill)=>skill.trim()),
                    email:user.email
                });
                navigate("/profile")
                alert("Welcome Geek");
            }catch(error){
                console.error('Error Creating Profile: ',error);
                alert("Sorry We Failed to Create Your Profile.")
            }
        }
    }

    return( <>
    <h1>Create Your Profile</h1>
    <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Enter Your Name"
            value={username}
            onChange={(e)=>setUserName(e.target.value)}
            required
        />
        <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e)=>setBio(e.target.value)}
        ></textarea>
        <input
            type = 'text'
            placeholder="Skills(Comma-Separated)"
            value = {skills}
            onChange={(e)=>setSkills(e.target.value)}
        />
        <button type='submit'>Save</button>
    </form>
    
    </>);

};

export default CreateProfile;