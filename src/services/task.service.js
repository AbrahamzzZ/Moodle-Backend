import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { callMoodleApi } from '../utils/moodleClient.js';
import { MOODLE_TOKENS } from '../config/moodleTokens.js';

export async function submitTaskText({ taskId, text }) {
  if (!taskId || !text) throw new Error('taskId y text son requeridos');

  const moodleToken = MOODLE_TOKENS.admin;

  return callMoodleApi({
    token: moodleToken,
    wsfunction: 'mod_assign_save_submission',
    method: 'POST',
    params: {
      assignmentid: Number(taskId),
      plugindata: {
        onlinetext_editor: {
          text: `<p>${text}</p>`,
          format: 1,
          itemid: 0,
        },
      },
    },
  });
}

export async function uploadTaskFile(filePath, fileName) {
    const form = new FormData();

    form.append('token', process.env.MOODLE_API_TOKEN);
    form.append('filearea', 'draft');
    form.append('itemid', 0);
    form.append('filepath', '/');
    form.append('filename', fileName);
    form.append('file', fs.createReadStream(filePath));

    const uploadUrl = process.env.MOODLE_URL.replace('/webservice/rest/server.php', '/webservice/upload.php');
    const response = await axios.post(
        uploadUrl,
        form,
        {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        }
    );

    if (!response.data || !response.data[0]?.itemid) {
        throw new Error('Error al subir archivo a Moodle: ' + JSON.stringify(response.data));
    }

    return response.data[0].itemid;
}


export async function submitTaskFile({ taskId, draftItemId}) {
    return callMoodleApi({
        token: process.env.MOODLE_API_TOKEN,
        wsfunction: 'mod_assign_save_submission',
        method: 'POST',
        params: {
            assignmentid: Number(taskId),
            'plugindata[files_filemanager]': draftItemId
            },
        
    });
}

export async function submitTaskForGrading(taskId) {
    return callMoodleApi({
        token: process.env.MOODLE_API_TOKEN,
        wsfunction: 'mod_assign_submit_for_grading',
        method: 'POST',
        params: {
            assignmentid: Number(taskId),
            acceptsubmissionstatement: 1
        }
    });
}