// src/utils/auth.js

const AUTH_KEY = "mockAuth";

export const saveUser = (user) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const getCurrentUser = () => {
  const authData = localStorage.getItem(AUTH_KEY);
  if (!authData) return null;
  try {
    return JSON.parse(authData);
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEY);
};
