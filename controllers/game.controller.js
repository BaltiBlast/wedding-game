const gameController = {
  getHome: (req, res) => {
    res.render("index");
  },

  getGame: (req, res) => {
    res.render("game");
  },

  getMobile: (req, res) => {
    res.render("mobile");
  },
};

module.exports = gameController;
