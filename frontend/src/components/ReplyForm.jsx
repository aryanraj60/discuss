// components/ReplyForm.js

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReplyForm = ({ commentId, afterSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user")); // Replace with your actual auth token

      const response = await axios.post("/api/replies/create", {
        text,
        commentId,
        user,
      });
      setText("");
      afterSubmit();
      toast(response.data.message, {
        theme: "light",
        closeOnClick: true,
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Error creating reply:", error);
      // Handle the error appropriately (e.g., show an error message)
      toast(error.message, {
        theme: "light",
        closeOnClick: true,
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="mb-2">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-16 border rounded-md p-2 mb-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your reply here..."
          required
        ></textarea>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Post Reply
        </button>
      </form>
    </div>
  );
};

export default ReplyForm;
