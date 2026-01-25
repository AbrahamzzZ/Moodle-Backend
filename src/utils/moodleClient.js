import axios from 'axios';

const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;

function buildMoodleParams(params) {
  const result = {};

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        result[`${key}[${index}]`] = item;
      });
    } else {
      result[key] = value;
    }
  });

  return result;
}

export async function callMoodleApi(wsfunction, params = {}) {
  try {
    const response = await axios.get(MOODLE_URL, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction,
        moodlewsrestformat: 'json',
        ...buildMoodleParams(params),
      },
    });

    if (response.data?.exception) {
      throw new Error(response.data.message || 'Error Moodle');
    }

    return response.data;
  } catch (error) {
    console.error('Moodle API error:', error.message);
    throw error;
  }
}