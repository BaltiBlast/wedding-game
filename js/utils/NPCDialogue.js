function createNPCDialogue(scene) {
  // Boîte de dialogue principale
  scene.dialogueBox = scene.add.rectangle(512, 850, 900, 180, 0x1a1a2e, 0.9);
  scene.dialogueBox.setStrokeStyle(4, 0x64ffda);
  scene.dialogueBox.setVisible(false);

  // Cadre portrait à droite
  scene.portraitFrame = scene.add.rectangle(780, 850, 120, 120, 0x2d4a22, 1);
  scene.portraitFrame.setStrokeStyle(3, 0x64ffda);
  scene.portraitFrame.setVisible(false);

  // Portrait du NPC
  scene.portrait = scene.add.image(755, 890, "");
  scene.portrait.setScale(0.2);
  scene.portrait.setVisible(false);

  // Nom du personnage
  scene.characterName = scene.add
    .text(780, 930, "", {
      fontSize: "16px",
      fill: "#64FFDA",
      fontWeight: "bold",
    })
    .setOrigin(0.5)
    .setVisible(false);

  // Texte du dialogue à gauche
  scene.dialogueText = scene.add
    .text(250, 850, "", {
      fontSize: "18px",
      fill: "#ffffff",
      align: "left",
      wordWrap: { width: 400 },
    })
    .setOrigin(0, 0.5)
    .setVisible(false);
}

function showNPCDialogue(scene, text, npcSprite, npcName) {
  // S'assurer que les éléments existent
  if (!scene.dialogueBox) {
    createNPCDialogue(scene);
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

function hideNPCDialogue(scene) {
  if (scene.dialogueBox) {
    scene.dialogueBox.setVisible(false);
    scene.portraitFrame.setVisible(false);
    scene.portrait.setVisible(false);
    scene.characterName.setVisible(false);
    scene.dialogueText.setVisible(false);
  }
}
