const PORT = process.env.PORT;


const startingApp = (app) => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT} - specific for user`);
    });
};


module.exports = {
    startingApp,
};