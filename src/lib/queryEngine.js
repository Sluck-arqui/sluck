
const fetch = require('node-fetch');


// Utilities

const signUpAPI = async (API_URL, username, first_name, last_name, email, password) => {
  const url = `${API_URL}/register/`;
  let body = {
    username,
    first_name,
    last_name,
    email,
    password,
  };
  body = JSON.stringify(body);
  console.log(body);
  const response = await fetch(url, { method: 'POST', body }).then(data => data.json());
  return response; //{ 'Oauth-Token': response.user.oauth_token };
};

const loginAPI = async (API_URL, username, password) => {
  const url = `${API_URL}/login/`;
  let body = { username, password };
  body = JSON.stringify(body);
  const response = await fetch(url, { method: 'POST', body }).then(data => data.json());
  return response; //{ 'Oauth-Token': response.user.oauth_token };
};

// Messages

// GET Messages
const fetchMessage = async (API_URL, headers, id) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/message/?message_id=${id}`;
  const response = await fetch(url, { method: 'GET', headers }).then(data => data.json());
  return response;
};

const fetchGroup = async (API_URL, headers, id) => {
  console.log("[i] Fetching group");
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/group/?group_id=${id}`;
  console.log(headers);
  const response = await fetch(url, { method: 'GET', headers }).then(data => data.json());
  return response;
};


// POST Messages
const postMessageGroup = async (API_URL, headers, group_id, text) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/message/group/`;
  let body = { group_id, text };
  body = JSON.stringify(body);
  const response = await fetch(url, { method: 'POST', headers, body }).then(data => data.json());
  return response;
};

const postCommentMessage = async (API_URL, headers, message_id, text) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/message/comment/`;
  let body = { message_id, text };
  body = JSON.stringify(body);
const response = await fetch(url, { method: 'POST', headers, body }).then(data => data.json());
  return response;
};


// PATCH Messages
const patchMessage = async (API_URL, headers, message_id, text) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/message/`;
  let body = { message_id, text };
  body = JSON.stringify(body);  
const response = await fetch(url, { method: 'PATCH', headers, body }).then(data => data.json());
  return response;
};

// DELETE Messages
const deleteMessage = async (API_URL, headers, message_id) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/message/`;
  let body = { message_id };
  body = JSON.stringify(body);
const response = await fetch(url, { method: 'DELETE', headers, body }).then(data => data.json());
  return response;
};


// Likes

// POST Message Reactions
const postMessageReaction = async (API_URL, headers, message_id, reaction_type) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/message/reactions`;
  let body = { message_id, reaction_type };
  body = JSON.stringify(body);
const response = await fetch(url, { method: 'POST', headers, body }).then(data => data.json());
  return response;
};

// POST Comment Reactions
const postCommentReaction = async (API_URL, headers, thread_id, reaction_type) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/message/comment/reactions`;
  let body = { thread_id, reaction_type };
  body = JSON.stringify(body);
const response = await fetch(url, { method: 'POST', headers, body }).then(data => data.json());
  return response;
};

// "GET" Reactions
const fetchReactions = async (API_URL, headers, message_id, limit) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/message/reactions/?message_id=${message_id}&limit=${limit}`;
  const response = await fetch(url, { method: 'GET', headers }).then(data => data.json());
  return response;
};


// Searches

// "GET" Hashtag
const fetchHashtagSearch = async (API_URL, headers, text, limit) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/search/hashtag/?text=${text}&limit=${limit}`;
  const response = await fetch(url, { method: 'GET', headers }).then(data => data.json());
  return response;
};

// "GET" Username
const fetchUsernameSearch = async (API_URL, headers, username, limit) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/search/username/?username=${username}&limit=${limit}`;
  const response = await fetch(url, { method: 'GET', headers }).then(data => data.json());
  return response;
};


// Users

// PATCH User
const patchUsername = async (API_URL, headers, email, password) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/user/`;
  let body = { email, password };
  body = JSON.stringify(body);
const response = await fetch(url, { method: 'PATCH', headers, body }).then(data => data.json());
  return response;
};

// DELETE User
const deleteUser = async (API_URL, headers, user_id) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/user/`;
  let body = { user_id };
body = JSON.stringify(body);  
const response = await fetch(url, { method: 'GET', headers, body }).then(data => data.json());
  return response;
};


// Groups
//get actual groups

const fetchMembership = async (API_URL, headers) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/user/groups/`;
  const response = await fetch(url, { method: 'GET', headers, }).then(data => data.json());
  return response;
}


// Create group
const createGroup = async (API_URL, headers, name, description) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/group/`;
  let body = { name, description };
  body = JSON.stringify(body);
  console.log("query");
  const response = await fetch(url, { method: 'POST', headers, body }).then(data => data.json());
  console.log(response);  
return response;
};

// Add member to group
const addMember = async (API_URL, headers, group_id, user_id) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/group/member/`;
  let body = { group_id, user_id };
  body = JSON.stringify(body);
const response = await fetch(url, { method: 'POST', headers, body }).then(data => data.json());
  return response;
};

// Remove member from group
const removeMember = async (API_URL, headers, id_group, user_id) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/group/member`;
  let body = { group_id, user_id };
  body = JSON.stringify(body);
const response = await fetch(url, { method: 'DELETE', headers, body }).then(data => data.json());
  return response;
};


module.exports = {
  signUpAPI,
  loginAPI,
  fetchMessage,
  fetchGroup,
  postMessageGroup,
  postCommentMessage,
  patchMessage,
  deleteMessage,
  postMessageReaction,
  postCommentReaction,
  fetchReactions,
  fetchHashtagSearch,
  fetchUsernameSearch,
  patchUsername,
  deleteUser,
  createGroup,
  addMember,
  removeMember,
  fetchMembership
};
