const express = require("express");
const router = express.Router();
const isUserLogged = require("./Middlewares/isUserlogged");

const { getGame, getHome, getMobile, postResponse, postComment } = require("./controllers/game.controller");
const { getLogin, postLogin, getLogout } = require("./controllers/auth.controller");

// Auth
router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/logout", isUserLogged, getLogout);

// Game
router.get("/", isUserLogged, getHome);
router.get("/game", isUserLogged, getGame);
router.get("/mobile", isUserLogged, getMobile);
router.post("/add-response", isUserLogged, postResponse);
router.post("/comment", postComment);

module.exports = router;
