/* eslint camelcase: "off" */


const fetch = require('node-fetch');


// Utilities

const authOtherAPI = async () => {
  const url = 'http://charette15.ing.puc.cl/api/people/login';
  let body = {
    email: 'serviceuser@grupo4.cl',
    password: '1234',
  };
  body = JSON.stringify(body);
  const headers = { 'Content-Type': 'application/json' };
  const response = await fetch(url, { method: 'POST', body, headers }).then(data => data.json());
  return response.id;
};

const signUpAPI = async (API_URL, username, first_name, last_name, email, password, tokenOtherAPI) => {
  const url = `${API_URL}/register/`;
  const url2 = `http://charette15.ing.puc.cl/api/services/179/people?access_token=${tokenOtherAPI}`;
  let body = {
    username,
    first_name,
    last_name,
    email,
    password,
  };
  let body2 = {
    email,
    password,
  };
  body = JSON.stringify(body);
  body2 = JSON.stringify(body2);
  const headers2 = { 'Content-Type': 'application/json' };
  const response = await fetch(url, { method: 'POST', body }).then(data => data.json());
  const response2 = await fetch(url2, { method: 'POST', body: body2, headers: headers2 }).then(data => data.json());
  console.log(response, response2);
  return [response, response2]; // { 'Oauth-Token': response.user.oauth_token };
};

const loginAPI = async (API_URL, username, email, password, tokenOtherAPI) => {
  const url = `${API_URL}/login/`;
  let body = { username, password };
  body = JSON.stringify(body);
  const response = await fetch(url, { method: 'POST', body }).then(data => data.json());

  // este token hay que guardarlo en la vista también! Para eso retornar dos responses
  const url2 = `http://charette15.ing.puc.cl/api/people/login?access_token=${tokenOtherAPI}`;
  let body2 = {
    email,
    password,
  };
  const headers = { 'Content-Type': 'application/json' };
  body2 = JSON.stringify(body2);
  const response2 = await fetch(url2, { method: 'POST', body: body2, headers }).then(data => data.json());
  console.log('response2 is', response2);

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

const fetchGroup = async (API_URL, headers, groupId, postId, tokenOtherAPI) => {
  console.log('[i] Fetching group');
  if (!headers) {
    return "You aren't logged in";
  }
  let response;
  if (groupId !== -3) {
    const url = `${API_URL}/group/?group_id=${groupId}`;
    response = await fetch(url, { method: 'GET', headers }).then(data => data.json());
  } else {
    response = { id: -3 };
  }

  let response2;
  let responseMembers;
  if (postId !== -3) {
    const url2 = `http://charette15.ing.puc.cl/api/posts/${postId}?access_token=${tokenOtherAPI}`;
    const headers2 = {
      'Content-Type': 'application/json',
    };
    response2 = await fetch(url2, { method: 'GET', headers: headers2 }).then(data => data.json());
    const urlMembers = `http://charette15.ing.puc.cl/api/posts/${postId}/people?$access_token=${tokenOtherAPI}`;
    responseMembers = await fetch(urlMembers, { method: 'GET', headers: headers2 }).then(data => data.json());
  } else {
    response2 = { id: -3 };
  }

  const url3 = `http://charette15.ing.puc.cl/api/posts/${postId}/messages?access_token=${tokenOtherAPI}`;
  const headers2 = {
    'Content-Type': 'application/json',
  };
  const messages2 = await fetch(url3, { method: 'GET', headers: headers2 }).then(data => data.json());
  console.log('messages2 es', messages2);
  console.log("En fetch group: response2 es", response2);
  const members = [];
  const parsedResponse = {
    status_code: 200,
    group: {
      id1: response.id,
      id2: response2.id,
      description: response2.description,
      name: response2.title,
      members: response.members || [],
      unread: 0,
      messages1: response.messages,
      messages2,

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

  return parsedResponse;
};


// POST Messages
const postMessageGroup = async (API_URL, headers, group_id, post_id, text, tokenOtherAPI) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/message/group/`;
  let body = {
    group_id,
    text,
  };
  body = JSON.stringify(body);
  const response = await fetch(url, { method: 'POST', headers, body }).then(data => data.json());

  const headers2 = {
    'Content-Type': 'application/json',
  };
  const url2 = `http://charette15.ing.puc.cl/api/posts/${post_id}/messages/?access_token=${tokenOtherAPI}`;
  let body2 = {
    description: text,
  };
  body2 = JSON.stringify(body2);
  const response2 = await fetch(url2, { method: 'POST', headers: headers2, body: body2 }).then(data => data.json());
  console.log('response2 en postMessageGroup es', response2);
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
  let response = await fetch(url, { method: 'GET', headers });
  console.log(response);
  response = response.json();
  console.log(response);
  console.log('Esa es la response');
  return response;
};

// "GET" Username
const fetchUsernameSearch = async (API_URL, headers, username, limit, tokenOtherAPI) => {
  console.log(headers);
  const definitiveResponse = {};
  if (!headers && !tokenOtherAPI) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/search/username/?username=${username}&limit=${limit}`;
  const response = await fetch(url, { method: 'GET', headers }).then(data => data.json());
  console.log('response', response);
  definitiveResponse.username = username;
  definitiveResponse.id1 = response.users[0].id;

  const headers2 = {
    'Content-Type': 'application/json',
  };
  const url2 = `http://charette15.ing.puc.cl/api/services/179/people?access_token=${tokenOtherAPI}`;
  const usersOtherAPI = await fetch(url2, { method: 'GET', headers: headers2 }).then(data => data.json());
  // console.log('RESPONSE ', usersOtherAPI);


  usersOtherAPI.forEach((user) => {
    // console.log('user', user, response.users[0]);
    // console.log('user', user);
    console.log(response.users[0]);
    if (user.email === response.users[0].email) {
      console.log("BINGO");
      definitiveResponse.id2 = user.id;
    }
  });

  return definitiveResponse;
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

const fetchMemberships = async (API_URL, headers, user_id, userTokenOtherAPI) => {
  if (!headers || !userTokenOtherAPI) {
    return { error: 'You aren\'t logged into both APIs' };
  }
  const url = `${API_URL}/user/groups/`;
  const response = await fetch(url, { method: 'GET', headers }).then(data => data.json());
  console.log('AAAAAAQ', response);


  const url2 = `http://charette15.ing.puc.cl/api/people/${user_id}/subscriptions?access_token=${userTokenOtherAPI}`;
  const headers2 = {
    'Content-Type': 'application/json',
  };
  const response2 = await fetch(url2, { method: 'GET', headers: headers2 }).then(data => data.json());

  return [response, response2];
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

  const url2 = `http://charette15.ing.puc.cl/api/services/179/posts?access_token=${tokenOtherAPI}`;
  let body2 = {
    title: name,
    description,
  };
  const headers2 = {
    'Content-Type': 'application/json',
  };
  body2 = JSON.stringify(body2);
  const response2 = await fetch(url2, { method: 'POST', body: body2, headers: headers2 }).then(data => data.json());
  console.log('response2', response2);

  return [response, response2];

  // return response;
};

// Add member to group
const addMember = async (API_URL, headers, group_id, user_id, postId, user_id2, tokenOtherAPI) => {
  if (!headers) {
    return "You aren't logged in";
  }
  const url = `${API_URL}/group/member/`;
  let body = { group_id, user_id };
  body = JSON.stringify(body);
  const response = await fetch(url, { method: 'POST', headers, body }).then(data => data.json());
  console.log('user_id2', user_id2, "token", tokenOtherAPI);
  const url2 = `http://charette15.ing.puc.cl/api/people/${user_id2}/subscriptions?access_token=${tokenOtherAPI}`;
  let body2 = {
    postId,
  };
  const headers2 = {
    'Content-Type': 'application/json',
  };
  body2 = JSON.stringify(body2);
  const response2 = await fetch(url2, { method: 'POST', body: body2, headers: headers2 }).then(data => data.json());
  console.log('response2 en addMember es', response2);

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
  authOtherAPI,
};
