const express = require("express");
const router = express.Router();
const isUserLogged = require("./Middlewares/isUserlogged");

const { getGame, getHome, getMobile } = require("./controllers/game.controller");
const { getLogin, postLogin, getLogout } = require("./controllers/auth.controller");

// Auth
router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/logout", getLogout);

// Game
router.get("/", isUserLogged, getHome);
router.get("/game", isUserLogged, getGame);
router.get("/mobile", isUserLogged, getMobile);

module.exports = router;
