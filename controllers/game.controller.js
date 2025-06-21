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

  postResponse: async (req, res) => {
    const data = req.body;

    // 🔄 Création des tableaux dynamiques
    const adult_names = [];
    for (let i = 1; i <= data.adult_count; i++) {
      const name = data[`adult_name_${i}`];
      if (name) adult_names.push(name.trim());
    }

    const children_names = [];
    for (let i = 1; i <= data.children_count; i++) {
      const name = data[`child_name_${i}`];
      if (name) children_names.push(name.trim());
    }

    const speaker_names = [];
    for (let i = 1; i <= data.speech_count; i++) {
      const name = data[`speaker_name_${i}`];
      if (name) speaker_names.push(name.trim());
    }

    const payload = {
      data: [
        {
          commander_name: data.commander_name,
          presence: data.presence,
          adult_count: data.adult_count,
          adult_names: adult_names.join(", "),
          children_count: data.children_count,
          children_names: children_names.join(", "),
          children_menus: data.children_menus,
          has_restrictions: data.has_restrictions,
          restrictions_details: data.restrictions_details,
          postal_address: data.postal_address,
          email_address: data.email_address,
          announcement: data.announcement,
          speech_count: data.speech_count,
          speaker_names: speaker_names.join(", "),
        },
      ],
    };

    try {
      const response = await fetch("https://sheetdb.io/api/v1/hho66wm4manbo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur API SheetDB");

      res.status(200).send("Données ajoutées à Google Sheets !");
    } catch (err) {
      console.error("Erreur SheetDB :", err);
      res.status(500).send("Erreur lors de l'ajout");
    }
  },
};

module.exports = gameController;
