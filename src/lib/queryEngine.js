// const { queryEngine } = require('../lib/queryEngine.js');

const fetch = require('node-fetch');


// Utilities

const buildHeaders = (oauthTokenTerver) => {
  return { OAUTH_TOKEN: oauthTokenTerver };
};

const fetchHeaders = async (API_URL) => {
  const url = `${API_URL}/oauth/authorizations/new`;
  const response = await fetch(url).then(data => data.json().then(json => json));
  return buildHeaders(response.oauth_token_server);
};

// Messages

// GET Messages
const fetchMessage = async (API_URL, headers, id) => {
  const url = `${API_URL}/message/${id}`;
  // const body = {message_id: id };
  const response = await fetch(url, { headers }).then(data => data.json().then(json => json));
  return response;
};
const fetchMessagesGroup = async (API_URL, headers, id) => {
  const url = `${API_URL}/message/group/${id}`;
  // const body = {message_id: id };
  const response = await fetch(url, { headers }).then(data => data.json().then(json => json));
  return response;
};


// POST Messages
const postMessageGroup = async (API_URL, headers, id, msg_text) => {
  const url = `${API_URL}/message/group/${id}`;
  const body = { text: msg_text };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};
const postCommentMessage = async (API_URL, headers, id, comment_text) => {
  const url = `${API_URL}/message/${id}`;
  const body = { text: comment_text };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};


// PATCH Messages
const patchMessage = async (API_URL, headers, id, new_text) => {
  const url = `${API_URL}/message/${id}`;
  const body = { text: new_text };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};

// DELETE Messages
const deleteMessage = async (API_URL, headers, id) => {
  const url = `${API_URL}/message/${id}`;
  // const body = { text: new_text };
  const response = await fetch(url, { headers }).then(data => data.json().then(json => json));
  return response;
};


// Likes

// POST Likes
const postLike = async (API_URL, headers, id) => {
  const url = `${API_URL}/message/like`;
  const body = { id_message: id };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};
const postDislike = async (API_URL, headers, id) => {
  const url = `${API_URL}/message/dislike`;
  const body = { id_message: id };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};

// "GET" Likes
const fetchReactions = async (API_URL, headers, id) => {
  const url = `${API_URL}/message/reactions`;
  const body = { limit: 10 };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};


// Searches

// "GET" Hashtag
const fetchHashtagSearch = async (API_URL, headers, hashtag) => {
  const url = `${API_URL}/search/hashtag`;
  const body = { text: hashtag, limit: 10 };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};

// "GET" Username
const fetchUsernameSearch = async (API_URL, headers, username) => {
  const url = `${API_URL}/search/username`;
  const body = { username: username, limit: 10 };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};


// Users

// PATCH User
const patchUsername = async (API_URL, headers, user_id, first_name, last_name, mail, username, password) => {
  const url = `${API_URL}/user`;
  const body = { user_id, first_name, last_name, mail, username, password };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};

// DELETE User
const deleteUser = async (API_URL, headers, id) => {
  const url = `${API_URL}/user/${id}`;
  // const body = { text: new_text };
  const response = await fetch(url, { headers }).then(data => data.json().then(json => json));
  return response;
};


// Groups

// Create group
const createGroup = async (API_URL, headers, name, description) => {
  const url = `${API_URL}/group/new`;
  const body = { name, description };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};

// Add member to group
const addMember = async (API_URL, headers, id_group, user_id) => {
  const url = `${API_URL}/group/add/member`;
  const body = { id_group, user_id };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};

// Remove member from group
const removeMember = async (API_URL, headers, id_group, user_id) => {
  const url = `${API_URL}/group/delete/member`;
  const body = { id_group, user_id };
  const response = await fetch(url, { headers, body }).then(data => data.json().then(json => json));
  return response;
};


module.exports = {
  fetchHeaders,
  fetchMessage,
  fetchMessagesGroup,
  postMessageGroup,
  postCommentMessage,
  patchMessage,
  deleteMessage,
  postLike,
  postDislike,
  fetchReactions,
  fetchHashtagSearch,
  fetchUsernameSearch,
  patchUsername,
  deleteUser,
  createGroup,
  addMember,
  removeMember,

};
