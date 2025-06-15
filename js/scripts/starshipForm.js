const initialQuestions = [
  {
    key: "commander_name",
    label: "Commandant de bord",
    text: "Identité du commandant de bord (NOM Prénom)",
    type: "text",
    required: true,
  },
  {
    key: "presence",
    label: "Présence",
    text: "Serez vous présent le 27/09/2025 à 16h ?",
    type: "radio",
    options: ["Oui", "Non"],
    required: true,
  },
  {
    key: "adult_count",
    label: "Passagers adultes",
    text: "Combien de passagers adultes accompagneront le commandant ?",
    type: "number",
    required: true,
  },
  {
    key: "children_count",
    label: "Enfants à bord",
    text: "Combien d'enfants seront à bord ?",
    type: "number",
    required: true,
  },
  {
    key: "children_menus",
    label: "Menus enfants",
    text: "Combien de menus enfants faut-il prévoir ?",
    type: "number",
    required: true,
  },
  {
    key: "has_restrictions",
    label: "Restrictions alimentaires",
    text: "Y a-t-il des restrictions ou allergies alimentaires ?",
    type: "radio",
    options: ["Oui", "Non"],
    required: true,
  },
  {
    key: "restrictions_details",
    label: "Détail des restrictions",
    text: "Veuillez préciser les restrictions ou allergies alimentaires",
    type: "text",
    required: true,
  },
  {
    key: "postal_address",
    label: "Adresse postale",
    text: "Veuillez indiquer votre adresse postale",
    type: "text",
    required: true,
  },
  {
    key: "email_address",
    label: "Adresse mail",
    text: "Veuillez indiquer votre adresse email",
    type: "email",
    required: true,
  },
  {
    key: "speech_count",
    label: "Discours",
    text: "Combien de personnes souhaitent faire un discours ?",
    type: "number",
    required: true,
  },
];

function starshipForm() {
  return {
    currentFieldIndex: 0,
    formData: {
      commander_name: "",
      presence: "",
      adult_count: 0,
      children_count: 0,
      children_menus: 0,
      has_restrictions: "",
      restrictions_details: "",
      postal_address: "",
      email_address: "",
      speech_count: 0,
    },

    validatedResponses: [],
    questions: initialQuestions,

    // Variables pour l'effet machine à écrire
    displayedLabel: "",
    displayedText: "",
    isTyping: false,
    typedFields: [], // Garder trace des champs déjà animés
    showButtons: false, // Contrôler l'affichage des boutons

    getCurrentField() {
      const field = this.getActiveFields()[this.currentFieldIndex];
      if (field && !this.typedFields.includes(field.key)) {
        this.showButtons = false; // Masquer les boutons immédiatement
        this.startTypingEffect(field);
      } else if (field && this.typedFields.includes(field.key)) {
        // Si le champ a déjà été tapé, afficher les boutons
        this.showButtons = true;
      }
      return field;
    },

    startTypingEffect(field) {
      this.isTyping = true;
      this.displayedLabel = "";
      this.displayedText = "";

      // Animer le label
      this.typeText(field.label, "displayedLabel", 10)
        .then(() => {
          // Puis animer le texte explicatif
          return this.typeText(field.text, "displayedText", 25);
        })
        .then(() => {
          this.isTyping = false;
          this.showButtons = true; // Afficher les boutons à la fin
          // Marquer ce champ comme déjà animé
          this.typedFields.push(field.key);
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

    getActiveFields() {
      let fields = [...this.questions];
      let insertIndex = 3; // Position après adult_count

      // Génération dynamique des champs adultes
      if (this.formData.adult_count > 0) {
        const adultFields = [];
        for (let i = 1; i <= this.formData.adult_count; i++) {
          adultFields.push({
            key: `adult_name_${i}`,
            label: `Adulte ${i}`,
            text: `Nom et prénom de l'adulte ${i}`,
            type: "text",
            required: true,
          });
        }
        fields.splice(insertIndex, 0, ...adultFields);
        insertIndex += adultFields.length;
      }

      // Génération dynamique des champs enfants
      if (this.formData.children_count > 0) {
        const childrenFields = [];
        for (let i = 1; i <= this.formData.children_count; i++) {
          childrenFields.push({
            key: `child_name_${i}`,
            label: `Enfant ${i}`,
            text: `Nom et prénom de l'enfant ${i}`,
            type: "text",
            required: true,
          });
        }
        // Insérer après children_count
        const childrenCountIndex = fields.findIndex((f) => f.key === "children_count");
        fields.splice(childrenCountIndex + 1, 0, ...childrenFields);
      }

      // Masquer children_menus si aucun enfant
      if (this.formData.children_count === 0) {
        fields = fields.filter((f) => f.key !== "children_menus");
      }

      // Masquer restrictions_details si pas de restrictions
      if (this.formData.has_restrictions !== "Oui") {
        fields = fields.filter((f) => f.key !== "restrictions_details");
      }

      // Génération dynamique des champs orateurs (APRÈS les filtres)
      if (this.formData.speech_count > 0) {
        const speakerFields = [];
        for (let i = 1; i <= this.formData.speech_count; i++) {
          speakerFields.push({
            key: `speaker_name_${i}`,
            label: `Orateur ${i}`,
            text: `Nom et prénom de l'orateur ${i}`,
            type: "text",
            required: true,
          });
        }
        // Ajouter à la fin après speech_count
        fields.push(...speakerFields);
      }

      fields.push({
        key: "verification",
        label: "Vérification finale",
        text: "Vérifiez vos informations avant décollage.",
        type: "verification",
        required: false,
      });

      return fields;
    },

    canGoNext() {
      const field = this.getCurrentField();
      const value = this.formData[field.key];
      return field.required ? value !== "" : true;
    },

    isLastField() {
      return this.currentFieldIndex === this.getActiveFields().length - 1;
    },

    isVerificationStep() {
      return this.currentFieldIndex > this.getActiveFields().length - 1;
    },

    nextField() {
      if (this.canGoNext()) {
        // Sauvegarder la réponse validée
        const currentField = this.getCurrentField();
        const value = this.formData[currentField.key];

        this.validatedResponses.push({
          label: currentField.label,
          value: value,
        });

        this.currentFieldIndex++;

        if (currentField.key === "presence" && value === "Non") {
          const fields = this.getActiveFields();
          const verificationIndex = fields.findIndex((f) => f.key === "verification");
          if (verificationIndex !== -1) {
            this.currentFieldIndex = verificationIndex;
            this.displayedLabel = fields[verificationIndex].label;
            this.displayedText = fields[verificationIndex].text;
            return;
          }
        }

        this.showButtons = false;

        // Si on arrive à l'étape de vérification, pas d'animation
        if (this.isVerificationStep()) {
          return;
        }

        // Vider l'affichage pour le nouveau champ
        this.displayedLabel = "";
        this.displayedText = "";

        // Récupérer le nouveau champ et lancer l'animation si nécessaire
        const nextField = this.getActiveFields()[this.currentFieldIndex];
        if (nextField && !this.typedFields.includes(nextField.key)) {
          this.startTypingEffect(nextField);
        } else if (nextField && this.typedFields.includes(nextField.key)) {
          // Si déjà tapé, afficher directement
          this.displayedLabel = nextField.label;
          this.displayedText = nextField.text;
          this.showButtons = true;
        }
      }
    },

    prevField() {
      // Si on est à l'étape de vérification, revenir au dernier champ
      if (this.isVerificationStep()) {
        this.currentFieldIndex = this.getActiveFields().length - 1;
        const lastField = this.getActiveFields()[this.currentFieldIndex];
        this.displayedLabel = lastField.label;
        this.displayedText = lastField.text;
        return;
      }

      if (this.currentFieldIndex > 0) {
        // Supprimer la dernière réponse validée
        this.validatedResponses.pop();

        this.currentFieldIndex--;
        this.showButtons = false;

        // Vider l'affichage
        this.displayedLabel = "";
        this.displayedText = "";

        // Retirer le champ de la liste des champs tapés AVANT de récupérer le champ
        const targetField = this.getActiveFields()[this.currentFieldIndex];
        if (targetField) {
          const index = this.typedFields.indexOf(targetField.key);
          if (index > -1) {
            this.typedFields.splice(index, 1);
          }

          // Lancer l'animation directement
          this.showButtons = false;
          this.startTypingEffect(targetField);
        }
      }
    },

    handleSubmit() {
      // Événement custom vers Phaser
      window.dispatchEvent(
        new CustomEvent("formSubmitted", {
          detail: {
            data: this.formData,
            responses: this.validatedResponses,
          },
        })
      );
    },
  };
}
