import axios from 'axios';
import qs from 'qs';

export async function callMoodleApi({
  token,
  wsfunction,
  params = {},
  method = 'GET',
}) {
  if (!token) {
    throw new Error('Token Moodle no proporcionado');
  }

  const payload = {
    wstoken: token,
    wsfunction,
    moodlewsrestformat: 'json',
    ...params,
  };

  let response;

  if (method === 'POST') {
    response = await axios.post(
      process.env.MOODLE_URL,
      qs.stringify(payload),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  } else {
    response = await axios.get(process.env.MOODLE_URL, {
      params: payload,
    });
  }

  if (response.data?.exception) {
    throw new Error(response.data.message);
  }

  return response.data;
}