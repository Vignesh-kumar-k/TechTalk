import React, { useEffect, useState } from "react";
import { db } from "../FireBase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import ReactMarkdown from "react-markdown";

const FeedPage = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({}); 

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = await getDoc(postRef);
      const likes = post.data().likes;

      if (likes.includes(user.uid)) {
        await updateDoc(postRef, { likes: arrayRemove(user.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(user.uid) });
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleComment = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = await getDoc(postRef);
      const postData = post.data();
      const comments = postData.comments || [];
  
      const newComment = {
        userId: user?.uid || "unknown",
        username: user?.username || "Anonymous", 
        text: commentText[postId]?.trim() || "",
        timestamp: new Date().toISOString(),
      };
  
      if (!newComment.text) {
        console.error("Comment text is empty");
        return;
      }
  
      await updateDoc(postRef, { comments: [...comments, newComment] });
  
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  

  return (
    <div className="feed-page">
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h3>{post.username}</h3>
          <p>{post.content}</p>

          {/* Render Markdown for code snippets */}
          {post.codeSnippet && (
            <ReactMarkdown>{post.codeSnippet}</ReactMarkdown>
          )}

          {/* Render image if present */}
          {post.imageUrl && <img src={post.imageUrl} alt="Post attachment" />}

          <div className="post-actions">
            {/* Like Button */}
            <button onClick={() => handleLike(post.id)}>
              {post.likes.includes(user.uid) ? "Unlike" : "Like"} ({post.likes.length})
            </button>

            {/* Comment Input */}
            <div>
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText[post.id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
              />
              <button onClick={() => handleComment(post.id)}>Comment</button>
            </div>

            {/* Display Comments */}
            <div className="comments">
              {post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <strong>{comment.username}:</strong> {comment.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedPage;
