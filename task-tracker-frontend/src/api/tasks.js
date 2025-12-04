import axios from "axios";

const API = "http://localhost:8000/api/tasks";

export const getTasks = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const addTask = async (text) => {
  const res = await axios.post(API, { text });
  return res.data;
};

export const toggleTask = async (id) => {
  const res = await axios.put(`${API}/${id}`);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
