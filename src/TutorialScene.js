export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }
  
  create() {
        
        
      // Erstellt die Textbox an den Koordinaten (100, 100)
      const introText = this.add.text(200, 100, 'Willkommen in Cubworld!', { fontSize: '20px', fill: '#fff', backgroundColor: '#cccccc', padding: { x: 10, y: 5 } });

    
      // Zugriff auf die gespeicherte Karte
    const mapData = this.registry.get('mapData');
    const map = this.make.tilemap({ key: mapData.tileMap });
    const tileset = map.addTilesetImage('tilesetName', 'tileImageKey');
    const mapLayer = map.createLayer('LayerName', tileset, 0, 0);
  }
}
  