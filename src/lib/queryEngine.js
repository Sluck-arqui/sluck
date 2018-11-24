/* eslint camelcase: "off" */


const fetch = require('node-fetch');


// Utilities

const signUpAPI = async (API_URL, username, first_name, last_name, email, password) => {
  const url = `${API_URL}/register/`;
  const url2 = 'https://charette9.ing.puc.cl/api/users/';
  let body = {
    username,
    first_name,
    last_name,
    email,
    password,
  };
  let body2 = {
    username,
    email,
    password,
  };
  body = JSON.stringify(body);
  body2 = JSON.stringify(body2);
  const headers2 = { 'Content-Type': 'application/json' };
  const response = await fetch(url, { method: 'POST', body }).then(data => data.json());
  const response2 = await fetch(url2, { method: 'POST', body: body2, headers: headers2 }).then(data => data.json());

  return [response, response2]; // { 'Oauth-Token': response.user.oauth_token };
};

const loginAPI = async (API_URL, username, email, password) => {
  const url = `${API_URL}/login/`;
  let body = { username, password };
  body = JSON.stringify(body);
  const response = await fetch(url, { method: 'POST', body }).then(data => data.json());

  // este token hay que guardarlo en la vista también! Para eso retornar dos responses
  const url2 = 'https://charette9.ing.puc.cl/api/login/';
  let body2 = {
    email,
    password,
  };
  const headers = { 'Content-Type': 'application/json' };
  body2 = JSON.stringify(body2);
  const response2 = await fetch(url2, { method: 'POST', body: body2, headers }).then(data => data.json());
  // console.log(response2);

  return [response, response2];

  // return response; // { 'Oauth-Token': response.user.oauth_token };
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

const fetchGroup = async (API_URL, headers, id, tokenOtherAPI) => {
  console.log('[i] Fetching group');
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/group/?group_id=${id}`;
  console.log(headers);
  const response = await fetch(url, { method: 'GET', headers }).then(data => data.json());

  //   {
  //     status_code: 200,
  //     group: {
  //         id: 6,
  //         description: 'This is a description',
  //         name: 'Best group ever'
  //         members: [
  //             {
  //                 id: 1,
  //                 username: 'nachocontreras'
  //             }
  //         ],
  //         unread: 2,
  //         messages: [3, 6, 9, 12, 45]
  //     }
  // }

  const url2 = `https://charette9.ing.puc.cl/api/topics/${id}`;
  const headers2 = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokenOtherAPI}`,
  };
  const response2 = await fetch(url2, { method: 'GET', headers: headers2 }).then(data => data.json());
  console.log(response2);

  const members = [];
  response2.subscribers.forEach((sub) => {
    members.push([sub, 'username unknown']);
  });
  const parsedResponse = {
    status_code: 200,
    group: {
      id: response2.id,
      description: response2.description,
      name: response2.title,
      members,
      unread: 0,
      messages: response2.post_ids,
    },
  };
  console.log(parsedResponse);
  // {
  //   "id": 2,
  //   "title": "topic 1",
  //   "description": "topic 1",
  //   "post_ids": [],
  //   "subscribers": []
  // }

  // return [response, parsedResponse];

  return response;
};


// POST Messages
const postMessageGroup = async (API_URL, headers, group_id, text) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/message/group/`;
  let body = { "group_id":group_id, "text":text };
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
  console.log(headers);
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
// get actual groups

const fetchMemberships = async (API_URL, headers, tokenOtherAPI) => {
  if (!headers || !tokenOtherAPI) {
    return { error: 'You aren\'t logged in to both APIs' };
  }
  const url = `${API_URL}/user/groups/`;
  const response = await fetch(url, { method: 'GET', headers }).then(data => data.json());

  return response;
};


// Create group
const createGroup = async (API_URL, headers, name, description, tokenOtherAPI) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/group/`;
  let body = { name, description };
  body = JSON.stringify(body);
  console.log('query');
  const response = await fetch(url, { method: 'POST', headers, body }).then(data => data.json());
  console.log('response', response);

  const url2 = 'https://charette9.ing.puc.cl/api/topics/';
  let body2 = {
    title: name,
    description,
  };
  const headers2 = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokenOtherAPI}`,
  };
  body2 = JSON.stringify(body2);
  const response2 = await fetch(url2, { method: 'POST', body: body2, headers: headers2 }).then(data => data.json());
  console.log('response2', response2);

  return [response, response2];

  // return response;
};

// Add member to group
const addMember = async (API_URL, headers, group_id, user_id, topic_identifier, tokenOtherAPI) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/group/member/`;
  let body = { group_id, user_id };
  body = JSON.stringify(body);
  const response = await fetch(url, { method: 'POST', headers, body }).then(data => data.json());

  const url2 = `http://charette9.ing.puc.cl/api/topics/${group_id}/subscribers`;
  let body2 = {
    user_id: group_id,
    topic_identifier,
  };
  const headers2 = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokenOtherAPI}`,
  };
  body2 = JSON.stringify(body2);
  const response2 = await fetch(url2, { method: 'POST', body: body2, headers: headers2 }).then(data => data.json());


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

const getTopicId = async (group, tokenOtherAPI) => {
  const url = 'http://charette9.ing.puc.cl/api/topics/';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokenOtherAPI}`,
  };
  const response = await fetch(url, { method: 'GET', headers }).then(data => data.json());

  response.forEach((topic) => {
    if (topic.title === group.name) {
      return topic.id;
    }
  });
  return -1;
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
  fetchMemberships,
  getTopicId,
};
