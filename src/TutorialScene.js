export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }
  
  create() {
        
    const levelConfig = this.registry.get('level1Config'); // Zugriff auf die gespeicherte Level-Konfiguration
      // Erstellt die Textbox an den Koordinaten (100, 100)
      const introText = this.add.text(200, 100, 'Willkommen in Cubworld!', { fontSize: '20px', fill: '#fff', backgroundColor: '#cccccc', padding: { x: 10, y: 5 } });

     
      // Zugriff auf die gespeicherte Karte
    const mapData = this.registry.get('mapData');
    const map = this.make.tilemap({ key: levelConfig.tileMap});
    const tileset = map.addTilesetImage('CanGo', 'canGoImage');
    const mapLayer = map.createLayer('CanGo', tileset, 0, 0);

    const levelTexture = this.add.image(400, 300, 'level1Texture'); // Adjust position as needed
levelTexture.setDepth(1); // Ensure it's above the tile layer

  }
}
  