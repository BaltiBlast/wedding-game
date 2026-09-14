function starshipForm() {
  return {
    commanderName: "",
    displayedLabel: "",
    displayedText: "",
    isTyping: true,

    init() {
      this.typeText("Commandant de bord", "displayedLabel", 10)
        .then(() => this.typeText("Identité du commandant de bord (NOM Prénom)", "displayedText", 25))
        .then(() => {
          this.isTyping = false;
        });
    },

    typeText(text, property, speed) {
      return new Promise((resolve) => {
        let index = 0;
        const interval = setInterval(() => {
          this[property] = text.substring(0, index + 1);
          index++;

          if (index >= text.length) {
            clearInterval(interval);
            resolve();
          }
        }, speed);
      });
    },

    handleSubmit() {
      if (this.isTyping || !this.commanderName.trim()) return;
      this.commanderName = "";
      this.$dispatch("formSubmitted");
    },
  };
}
