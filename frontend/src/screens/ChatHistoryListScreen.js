import React, { useEffect } from 'react';
import Axios from 'axios';
import { useReducer } from 'react';
import { useHistory } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CHAT_LIST_REQUEST':
      return { ...state, loading: true };
    case 'CHAT_LIST_SUCCESS':
      return { ...state, loading: false, chats: action.payload, error: '' };
    case 'CHAT_LIST_FAIL':
      return { ...state, loading: false, chats: [], error: action.payload };

    default:
      return state;
  }
};

export default function ChatHistoryListScreen() {
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    chats: [],
    error: '',
  });
  const { loading, chats, error } = state;
  useEffect(() => {
    fetchData();
  }, []);
  const detailsClickHandler = (id) => {
    history.push(`/chat-history/${id}`);
  };
  const deleteClickHandler = async (id) => {
    if (window.confirm('Are you sure to delete this chat?')) {
      await Axios.delete(`/api/chats/${id}`);
      alert('deleted');
      fetchData();
    }
  };
  const fetchData = async () => {
    try {
      dispatch({ type: 'CHAT_LIST_REQUEST' });
      const { data } = await Axios('/api/chats');
      dispatch({ type: 'CHAT_LIST_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'CHAT_LIST_FAIL', payload: error.message });
    }
  };
  return (
    <div>
      <h1>Chat History</h1>
      {loading ? (
        <div>Loading... </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <td>Username</td>
              <td>First Message</td>
              <td>Num Messages</td>
              <td>Create Date</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {chats.map((chat) => (
              <tr key={chat._id}>
                <td>{chat.username}</td>
                <td>{chat.message}</td>
                <td>{chat.messages.length}</td>
                <td>{chat.createdAt}</td>
                <td>
                  <button onClick={() => detailsClickHandler(chat._id)}>
                    Details
                  </button>
                  <button onClick={() => deleteClickHandler(chat._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
