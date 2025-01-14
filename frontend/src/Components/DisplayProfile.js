import React, { useEffect, useState } from "react";
import {auth,db} from "../FireBase.js";
import {doc,getDoc} from "firebase/firestore";

const UserProfile = ()=>{
    const [profile,setProfile] = useState(null);

    useEffect(()=>{
        const fetchProfile = async ()=>{
            const user = auth.currentUser;
            if(user){
                const profileRef = doc(db,"users",user.uid);
                const profileSnap = getDoc(profileRef);
                if((await profileSnap).exists()){
                    setProfile((await profileSnap).data());
                }else{
                    console.log("No Profile Found!");
                }
            }
        }
        fetchProfile();
    },[])
    return(
    <>
        <h1>User Profile</h1>
        {
            profile?(
                <div>
                    <h2>{profile.username}</h2>
                    <p>Bio:{profile.bio}</p>
                    <h3>Skills:</h3>
                        <ul>
                            {profile.skills.map((skill,index)=>(
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>
                </div>
            ):(<p>Loading Profile...</p>)
        }
    </>);
    };

export default UserProfile;
