const authController = {
  getLogin: (req, res) => {
    res.render("login", { error: null });
  },

  postLogin: (req, res) => {
    const { password } = req.body;

    if (password === process.env.GAME_PASSWORD) {
      req.session.isLoggedIn = true;
      res.redirect("/");
    } else {
      res.render("login", { error: "Mot de passe incorrect." });
    }
  },

  getLogout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  },
};

module.exports = authController;
