export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }
  
  create() {
    const levelConfig = this.registry.get('level1Config');

    // Textbox
    const introText = this.add.text(200, 100, 'Willkommen in Cubworld!', {
      fontSize: '20px',
      fill: '#fff',
      backgroundColor: '#cccccc',
      padding: { x: 10, y: 5 }
    });

    // Karte und Tileset
    const map = this.make.tilemap({ key: levelConfig.tileMap });
    const tileset = map.addTilesetImage('CanGo', 'canGoImage');
    const mapLayer = map.createLayer('CanGo', tileset, 0, 0);

    // Level-Textur
    const levelTexture = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'map1');

    // die machen immoment alles kaputt wegen dem kack resize funkctions ughhhh
    levelTexture.scaleX = 1 / levelConfig.mapTileSize[0] * 64;
    levelTexture.x = this.WIDTH / 2 + levelConfig.mapPositionOffset[0];
    levelTexture.scaleY = 1 / levelConfig.mapTileSize[0] * 64;
    levelTexture.y = this.HEIGHT / 2 + levelConfig.mapPositionOffset[1];
    
    
  }

 
   
}