import React, { useState, useEffect } from "react";

interface Comment {
  id: string;
  text: string;
  email: string;
}

interface CommentSectionProps {
  galleryItemId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ galleryItemId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Load comments from localStorage
    const storedComments = localStorage.getItem(`comments-${galleryItemId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [galleryItemId]);

  const handleAddComment = () => {
    if (newComment.trim() && email.trim()) {
      const updatedComments = [
        ...comments,
        { id: Date.now().toString(), text: newComment, email },
      ];
      setComments(updatedComments);
      localStorage.setItem(
        `comments-${galleryItemId}`,
        JSON.stringify(updatedComments)
      );
      setNewComment("");
      setEmail("");
    }
  };

  return (
    <div className="comment-section w-full ">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      <ul className="mb-4">
        {comments.map((comment) => (
          <li key={comment.id} className="mb-2">
            <p className="font-semibold">{comment.email}</p>
            <p>{comment.text}</p>
          </li>
        ))}
      </ul>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="Enter your email"
      />
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="Add a comment..."
      />
      <button
        onClick={handleAddComment}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Comment
      </button>
    </div>
  );
};

export default CommentSection;
