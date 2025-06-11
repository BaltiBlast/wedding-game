function createPlayerDialogue(scene) {
  // Boîte de dialogue principale
  scene.playerDialogueBox = scene.add.rectangle(512, 850, 900, 180, 0x1a1a2e, 0.9);
  scene.playerDialogueBox.setStrokeStyle(4, 0x64ffda);
  scene.playerDialogueBox.setVisible(false);

  // Cadre portrait à gauche
  scene.playerPortraitFrame = scene.add.rectangle(244, 850, 120, 120, 0x2d4a22, 1);
  scene.playerPortraitFrame.setStrokeStyle(3, 0x64ffda);
  scene.playerPortraitFrame.setVisible(false);

  // Portrait du joueur
  scene.playerPortrait = scene.add.image(250, 889, "");
  scene.playerPortrait.setScale(1.3);
  scene.playerPortrait.setVisible(false);

  // Nom du personnage
  scene.playerCharacterName = scene.add
    .text(244, 930, "", {
      fontSize: "16px",
      fill: "#64FFDA",
      fontWeight: "bold",
    })
    .setOrigin(0.5)
    .setVisible(false);

  // Texte du dialogue à droite
  scene.playerDialogueText = scene.add
    .text(750, 850, "", {
      fontSize: "18px",
      fill: "#ffffff",
      align: "left",
      wordWrap: { width: 400 },
    })
    .setOrigin(1, 0.5)
    .setVisible(false);
}

function showPlayerDialogue(scene, text, playerSprite, playerName) {
  // S'assurer que les éléments existent
  if (!scene.playerDialogueBox) {
    createPlayerDialogue(scene);
  }

  // Mettre à jour le portrait
  scene.playerPortrait.setTexture(playerSprite);
  scene.playerPortrait.setCrop(0, 0, scene.playerPortrait.width, scene.playerPortrait.height * 0.6);

  // Mettre à jour le nom
  scene.playerCharacterName.setText(playerName);

  // Mettre à jour le texte
  scene.playerDialogueText.setText(text);

  // Afficher tous les éléments
  scene.playerDialogueBox.setVisible(true);
  scene.playerPortraitFrame.setVisible(true);
  scene.playerPortrait.setVisible(true);
  scene.playerCharacterName.setVisible(true);
  scene.playerDialogueText.setVisible(true);
}

function hidePlayerDialogue(scene) {
  if (scene.playerDialogueBox) {
    scene.playerDialogueBox.setVisible(false);
    scene.playerPortraitFrame.setVisible(false);
    scene.playerPortrait.setVisible(false);
    scene.playerCharacterName.setVisible(false);
    scene.playerDialogueText.setVisible(false);
  }
}
