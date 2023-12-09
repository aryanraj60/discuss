// components/CommentForm.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CommentForm = ({ topicId, afterSubmit }) => {
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user")); // Replace with your actual auth token

      const response = await axios.post("/api/comments/create", {
        text,
        topicId,
        user,
      });
      setText("");
      afterSubmit();

      toast(response.data.message, {
        theme: "light",
        closeOnClick: true,
        autoClose: 1000,
      });

      console.log(response.data.message);
      // Optionally, you can update the UI or display a success message
    } catch (error) {
      console.error("Error creating comment:", error);
      // Handle the error appropriately (e.g., show an error message)
      toast(error.message, {
        theme: "light",
        closeOnClick: true,
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="my-4">
      <h3 className="text-lg font-semibold mb-2">Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-20 border rounded-md p-2 mb-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your comment here..."
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
