// ======================================================================== //
// USAGE
//
// 1. Add in scene's create :
// Show quets summary
// const quests = [
//   "1",
//   "2",
//   "3",
//   "etc..."
// ];
// QuestSummary.showQuestsSummary(this, questList);
//
// Explains : this = scene, questList = ["1", "2", "3"...]
// ======================================================================== //

class QuestSummary {
  //-------------------------------------------------------------------------------------------- //
  static showQuestsSummary(scene, questList) {
    const container = scene.add.container(600, 20);
    container.setDepth(1000);
    container.setAlpha(0);

    const width = 400;
    const horizontalPadding = 16;
    const verticalMargin = 16;
    const lineSpacing = 12;

    const texts = [];
    let totalTextHeight = 0;

    questList.forEach((quest, index) => {
      const text = this.createQuestText(scene, quest, horizontalPadding, width);
      texts.push(text);
      totalTextHeight += text.height;

      if (index < questList.length - 1) {
        totalTextHeight += lineSpacing;
      }
    });

    const height = totalTextHeight + verticalMargin * 2;
    let currentY = verticalMargin;

    texts.forEach((text, index) => {
      text.y = currentY;
      currentY += text.height;

      if (index < texts.length - 1) {
        currentY += lineSpacing;
      }

      container.add(text);
    });

    const background = scene.add.rectangle(0, 0, width, height, 0x1a1a2e, 0.8).setOrigin(0).setStrokeStyle(4, 0x64ffda);

    container.addAt(background, 0);

    this.questSummaryFadeIn(scene, container);
    return container;
  }

  //-------------------------------------------------------------------------------------------- //
  static createQuestText(scene, quest, padding, width) {
    return scene.add
      .text(padding, 0, quest, {
        fontSize: "14px",
        fill: "#ffffff",
        align: "left",
        wordWrap: { width: width - 2 * padding },
      })
      .setOrigin(0, 0);
  }

  //-------------------------------------------------------------------------------------------- //
  static questSummaryFadeIn(scene, target) {
    scene.tweens.add({
      targets: target,
      alpha: 1,
      duration: 500,
      ease: "Power1",
    });
  }
}
