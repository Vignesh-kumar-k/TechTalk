import React, { useState, useEffect } from "react";
import { storage, db } from "../FireBase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore";

const Posts = ({ user }) => {
  const [content, setContent] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUsername();
  }, [user]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content && !codeSnippet && !image) return;

    setLoading(true);

    let imageUrl = "";
    if (image) {
      const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}-${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      await addDoc(collection(db, "posts"), {
        authorId: user.uid,
        username: username || "Anonymous", 
        content,
        codeSnippet,
        imageUrl,
        timestamp: serverTimestamp(),
        likes: [],
        comments: [],
      });

      setContent("");
      setCodeSnippet("");
      setImage(null);
    } catch (error) {
      console.error("Error While Creating Post: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handlePostSubmit} className="post-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        <textarea
          value={codeSnippet}
          onChange={(e) => setCodeSnippet(e.target.value)}
          placeholder="Add a code snippet"
        />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </>
  );
};

export default Posts;
