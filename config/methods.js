import { toast } from "react-toastify";

export const fetchData = async (endpoint, method, options = {}) => {
  try {

    console.log('method', method)

    let payload = {
      method: method.method,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    if (method?.data) {
      payload.body = JSON.stringify(method.data)
    }


    const response = await fetch(`${endpoint}`, payload);

    if (!response.ok) {
      toast.error(`Login failed: ${response.message}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('login error:', error.message);
    toast.error(`Login failed: ${error.message}`);
  }
};
