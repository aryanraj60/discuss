// components/TopicForm.js

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TopicForm = () => {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming you have a way to get the user's authentication token
      const user = JSON.parse(localStorage.getItem("user")); // Replace with your actual auth token

      const response = await axios.post("/api/topics/create", { text, user });

      toast(response.data.message, {
        theme: "light",
        closeOnClick: true,
        autoClose: 1000,
      });
      // Optionally, you can redirect or update your UI based on the response
    } catch (error) {
      console.error("Error creating topic:", error);
      toast(error.message, {
        theme: "light",
        closeOnClick: true,
        autoClose: 1000,
      });
      // Handle the error appropriately (e.g., show an error message)
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Create a New Topic</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-32 border rounded-md p-2 mb-4"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your topic here..."
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Post Topic
        </button>
      </form>
    </div>
  );
};

export default TopicForm;
