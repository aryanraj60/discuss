// components/Home.js

import React, { useEffect, useState } from "react";
import TopicForm from "../components/TopicForm";
import CommentForm from "../components/CommentForm";
import ReplyForm from "../components/ReplyForm";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all topics when the component mounts
    const fetchTopics = async () => {
      try {
        const response = await axios.get("/api/topics/all");
        setTopics(response.data.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
        // Handle the error appropriately (e.g., show an error message)
      }
    };

    fetchTopics();
  }, []);

  const updateTopics = async () => {
    try {
      const response = await axios.get("/api/topics/all");
      setTopics(response.data.data);
    } catch (error) {
      console.error("Error updating topics:", error);
      // Handle the error appropriately (e.g., show an error message)
    }
  };

  if (!user) {
    return navigate("/login");
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white shadow-md rounded-md">
      <nav class="bg-blue-200 text-black p-2 text-center flex gap-3 justify-between">
        <h2>Welcome {user?.name}</h2>

        <button
          onClick={() => {
            navigate("/create-topic");
          }}
          className="p-1 bg-black/80 text-white"
        >
          Create Topic
        </button>
        <button
          className="bg-red-500 text-white"
          onClick={() => {
            localStorage.removeItem("user");
            setUser(null);
          }}
        >
          LogOut
        </button>
      </nav>
      <h2 className="text-2xl font-bold mb-4">Home Page</h2>
      {topics.map((topic, i) => (
        <div key={topic._id} className="mb-4 space-y-3 border border-blue-400">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold mb-2">
              Topic: <span className="text-red-400">{topic.text}</span>
            </h3>
          </div>

          <CommentForm topicId={topic._id} afterSubmit={updateTopics} />
          {topic.comments.map((comment) => (
            <div key={comment._id} className="ml-4">
              <div className="border border-red-500">
                <div>
                  <p className="text-red-500">User: {comment?.user?.name}</p>
                </div>
                <p>Comment: {comment.text}</p>
              </div>
              <ReplyForm commentId={comment._id} afterSubmit={updateTopics} />
              {comment.replies.map((reply) => (
                <div key={reply._id} className="ml-4 border border-red-500">
                  <div>
                    <p className="text-red-500">User: {reply?.user?.name}</p>
                  </div>
                  <p>Reply: {reply.text}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Home;
