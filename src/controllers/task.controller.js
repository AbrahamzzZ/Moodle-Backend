import {
    submitTaskText,
    uploadTaskFile,
    submitTaskFile,
    submitTaskForGrading
} from '../services/task.service.js';

export async function postTaskText(req, res) {
    try {
        const { taskId, text } = req.body;
        const user = req.user; // viene del JWT

        if (!taskId || !text) {
            return res.status(400).json({
                ok: false,
                message: 'taskId y text son requeridos',
            });
        }

        const result = await submitTaskText({ taskId, text });

        return res.json({
            ok: true,
            user,
            submission: result,
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: error.message,
        });
    }
}

export async function postTaskFile(req, res) {

    try {
        const { taskId } = req.body;
        const file = req.file;
        const user = req.user; // JWT

        if (!taskId || !file) {
            return res.status(400).json({
                ok: false,
                message: 'taskId y archivo son requeridos',
            });
        }


        const draftItemId = await uploadTaskFile(
            file.path,
            file.originalname
        );


        const result = await submitTaskFile({
            taskId,
            draftItemId,
        });

        await submitTaskForGrading(taskId);

        return res.json({
            ok: true,
            user,
            message: 'Archivo enviado correctamente para calificación'
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: error.message,
        });
    }
}