export const getToken = () => localStorage.getItem("authToken");
export const setToken = (val) => localStorage.setItem("authToken", val);