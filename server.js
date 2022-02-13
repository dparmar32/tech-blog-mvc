const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

/* This is creating a new instance of the express object and setting a port. */
const app = express();
const PORT = process.env.PORT || 3001;

/* This is creating a new instance of the SequelizeStore object. */
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

/* This is creating a session object that will be used to create a session store. */
const sess = {
    secret: "Super secret secret",
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

/* This is creating a new instance of the handlebars object. */
const hbs = exphbs.create({
    helpers: {
        format_date: (date) => {
            return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${
                new Date(date).getFullYear()
            }`;
        }
    }
});

/* This is telling express to use the handlebars engine to render the views. */
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

/* This is telling express to use the json and urlencoded middleware. */
app.use(express.json());
app.use(express.urlencoded({extended: false}));

/* This is telling express to use the static middleware to serve the public folder. */
app.use(express.static(path.join(__dirname, 'public')));

/* This is telling express to use the controllers folder. */
app.use(require('./controllers/'));

/* This is creating a database connection. */
sequelize.sync({force: false}).then(() => {
    app.listen(PORT, () => console.log('Now listening on port ' + PORT));
});