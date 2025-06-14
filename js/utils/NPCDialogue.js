class DialogueManager {
  static createNPCDialogue(scene) {
    scene.dialogueBox = scene.add
      .rectangle(512, 850, 900, 180, 0x1a1a2e, 0.8)
      .setStrokeStyle(4, 0x64ffda)
      .setDepth(1000)
      .setVisible(false);

    scene.portraitFrame = scene.add
      .rectangle(780, 850, 120, 120, 0x2d4a22, 1)
      .setStrokeStyle(3, 0x64ffda)
      .setDepth(1000)
      .setVisible(false);

    scene.portrait = scene.add.image(755, 890, "").setScale(0.2).setDepth(1000).setVisible(false);

    scene.characterName = scene.add
      .text(780, 930, "", {
        fontSize: "16px",
        fill: "#64FFDA",
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setVisible(false);

    scene.dialogueText = scene.add
      .text(250, 850, "", {
        fontSize: "18px",
        fill: "#ffffff",
        align: "left",
        wordWrap: { width: 400 },
      })
      .setOrigin(0, 0.5)
      .setDepth(1000)
      .setVisible(false);
  }

  static showNPCDialogue(scene, text, npcSprite, npcName) {
    // S'assurer que les éléments existent
    if (!scene.dialogueBox) {
      this.createNPCDialogue(scene);
    }

    // Mettre à jour le portrait
    scene.portrait.setTexture(npcSprite);
    scene.portrait.setCrop(0, 0, scene.portrait.width, scene.portrait.height * 0.6);

    // Mettre à jour le nom
    scene.characterName.setText(npcName);

    // Mettre à jour le texte
    scene.dialogueText.setText(text);

    // Afficher tous les éléments
    scene.dialogueBox.setVisible(true);
    scene.portraitFrame.setVisible(true);
    scene.portrait.setVisible(true);
    scene.characterName.setVisible(true);
    scene.dialogueText.setVisible(true);
  }

  static hideNPCDialogue(scene) {
    if (scene.dialogueBox) {
      scene.dialogueBox.setVisible(false);
      scene.portraitFrame.setVisible(false);
      scene.portrait.setVisible(false);
      scene.characterName.setVisible(false);
      scene.dialogueText.setVisible(false);
    }
  }
}

function hideNPCDialogue(scene) {
  DialogueManager.hideNPCDialogue(scene);
}
