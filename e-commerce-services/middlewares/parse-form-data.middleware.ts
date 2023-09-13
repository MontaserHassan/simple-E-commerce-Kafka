import { Request, Response, NextFunction } from 'express';
import multiparty from 'multiparty';


const parseFormData = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data')) {
        const form = new multiparty.Form();

        form.parse(req, (err: Error, fields: { [fieldName: string]: string[] }, files: { [fieldName: string]: multiparty.File[] }) => {
            if (err) {
                console.error('Error parsing form data:', err);
                return res.status(400).json({ error: 'Error parsing form data' });
            }
            req.body = fields;
            next();
        });
    } else {
        next();
    };
};



export default parseFormData;
