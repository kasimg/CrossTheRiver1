import GameConfig from "./GameConfig";
import Script from "./Script";

class Main {
	constructor() {
		this.initUI();
	}
	
	//  初始化游戏界面
	initUI(): void {
		Laya.init(1280, 720);
		Laya.stage.bgColor = '#ffffff';
		const resArray = [
			{url: 'res/atlas/actors.atlas', type: Laya.Loader.ATLAS},
			{url: 'actors/gameover.jpg'},
			{url: 'actors/succeed.jpg'},
		];

		//  加载图像
		Laya.loader.load(resArray, Laya.Handler.create(this, () => {
			const scene: Script = new Script();
			Laya.stage.addChild(scene);
		}));
	}
}
//激活启动类
new Main();
