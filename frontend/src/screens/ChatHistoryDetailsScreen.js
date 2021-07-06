import React, { useEffect } from 'react';
import { useReducer } from 'react';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CHAT_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'CHAT_DETAILS_SUCCESS':
      return { ...state, loading: false, chat: action.payload, error: '' };
    case 'CHAT_DETAILS_FAIL':
      return { ...state, loading: false, chat: [], error: action.payload };

    default:
      return state;
  }
};

export default function ChatHistoryDetailsScreen() {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    chat: [],
    error: '',
  });

  const { loading, chat, error } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'CHAT_DETAILS_REQUEST' });
        const { data } = await Axios(`/api/chats/${id}`);
        dispatch({ type: 'CHAT_DETAILS_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'CHAT_DETAILS_FAIL', payload: error.message });
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <a>
        <Link to="/chat-history">Back to list</Link>
      </a>
      <h1>
        Chat with {chat.username} [{id}]
      </h1>
      {loading ? (
        <div>Loading... </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          <ul>
            {chat.messages.map((chat, index) => (
              <li key={index}>
                <strong>{chat.name}:</strong> <span>{chat.body}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
