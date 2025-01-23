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
  const [commentText, setCommentText] = useState({}); // Manage comment input for each post

  useEffect(() => {
    // Fetch posts from Firestore in descending order of timestamp
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

  // Handle Like functionality
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

  // Handle Comment functionality
  const handleComment = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = await getDoc(postRef);
      const postData = post.data();
  
      // Ensure comments field is initialized as an array
      const comments = postData.comments || [];
  
      // Construct the new comment
      const newComment = {
        userId: user?.uid || "unknown",
        username: user?.username || "Anonymous", // Ensure proper username fetching
        text: commentText[postId]?.trim() || "",
        timestamp: new Date().toISOString(),
      };
  
      // Prevent adding empty comments
      if (!newComment.text) {
        console.error("Comment text is empty");
        return;
      }
  
      // Debugging logs (optional)
      console.log("Post ID:", postId);
      console.log("Existing comments:", comments);
      console.log("New comment:", newComment);
  
      // Update the post with the new comment
      await updateDoc(postRef, { comments: [...comments, newComment] });
  
      // Clear the comment input for the post
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
