import axios from 'axios';
import { MOODLE_TOKENS } from '../config/moodleTokens.js';

export async function downloadFile(req, res) {
  try {
    const { fileUrl } = req.query;

    if (!fileUrl) {
      return res.status(400).json({
        ok: false,
        message: 'fileUrl es requerido',
      });
    }

    const response = await axios.get(fileUrl, {
      responseType: 'stream',
      params: {
        token: MOODLE_TOKENS.admin,
      },
    });

    res.setHeader(
      'Content-Disposition',
      response.headers['content-disposition'] || 'attachment'
    );
    res.setHeader('Content-Type', 'application/pdf');

    response.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      message: 'Error al descargar archivo',
    });
  }
}
