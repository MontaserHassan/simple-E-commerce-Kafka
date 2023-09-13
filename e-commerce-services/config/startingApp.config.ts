import { Application } from 'express';

const { PORT } = process.env;

const startingApp = (app: Application) => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
};

export default startingApp;