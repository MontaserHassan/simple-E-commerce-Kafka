const PORT = process.env.PORT;
import { Application } from 'express'

const startingApp = ( app : Application ) => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
};


module.exports = {
    startingApp,
};