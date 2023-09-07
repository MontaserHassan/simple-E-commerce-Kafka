const multiparty = require('multiparty');


const parseFormData = (req, res, next) => {
    if (req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data')) {
        const form = new multiparty.Form();

        form.parse(req, (err, fields) => {
            if (err) {
                console.error('Error parsing form data:', err);
                return res.status(400).json({ error: 'Error parsing form data' });
            }
            req.body = fields;
            next();
        });
    } else {
        next();
    }
};



module.exports = {
    parseFormData
};