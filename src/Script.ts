import { ui } from './ui/layaMaxUI';
import Item from './Item';
import Boat from './Boat';
import StaticData from './StaticData';
import RiverBank from './RiverBank';
import GameOver from './GameOver';

export default class Script extends ui.BackGroundUI {
  private items: Array<Item>;
  private boat: Boat = new Boat(this.boatSprite);
  private riverBanks: Array<RiverBank>;

  constructor() {
    super();
    this.initActors();
    this.bindGoEvent();
    this.initMessage();
    // this.gameOver();
  }

  //  初始化狼、羊和卷心菜实例
  initActors(): void {
    this.riverBanks = [
      new RiverBank([1, 1, 1]),
      new RiverBank([0, 0, 0]),
    ];

    this.items = new Array<Item>();
    this.items.push(new Item(this.wolf, 'wolfPos', this.boat, this.riverBanks));
    this.items.push(new Item(this.sheep, 'sheepPos', this.boat, this.riverBanks));
    this.items.push(new Item(this.cabbage, 'cabbagePos', this.boat, this.riverBanks));
  }

  //  绑定GO点击事件
  bindGoEvent(): void {
    this.go.on(Laya.Event.MOUSE_DOWN, this, this.gogogo);
  }

  //  出发！
  gogogo(): void {
    //  隐藏鼠标
    Laya.Mouse.hide();
    //  显示运输信息
    this.showMessage();
    // 确定要判断那边岸的情况
    const bankIndex: number = this.boat.getSprite().x === StaticData.boat.left.x
      ? StaticData.index.LEFT_BANK
      : StaticData.index.RIGHT_BANK

    
    const eatArr = this.riverBanks[bankIndex].EatOrNot();
    
    if (eatArr) {  //  如果发生了吃事件
      const eator = this.items[eatArr[0]];
      const food = this.items[eatArr[1]]
      
      //  先移动再吃东西
      this.moveBoat(this.boat.moveBoat(false), Laya.Handler.create(this, () => {
        this.eat(eator, food, Laya.Handler.create(this, this.gameOver));
      }));
    } else {  //  否则
      this.moveBoat(this.boat.moveBoat(), Laya.Handler.create(this, () => {
        Laya.Mouse.show();
      }));
    }
  }

  //  初始化信息格式
  initMessage(): void {
    StaticData.message.fontSize = 50;
    this.addChild(StaticData.message);
  }

  //  显示运输信息
  showMessage(): void {
    const passage = this.boat.getPassage();
    let passageName = StaticData[passage.getTypeStr()].name;  //  获取乘客名称
    //  获取起点和终点信息
    let startPoint = '右岸';
    let endPoint = '左岸';
    if (this.boat.getSprite().x === StaticData.boat.left.x) {
      startPoint = '左岸';
      endPoint = '右岸';
    }

    //  打印信息
    const message = '把' + passageName + '从' + startPoint + '运输到' + endPoint;
    // Text.text = 'aaaaa';
    StaticData.message.text += message + '\n';
    // this.addChild(StaticData.message);
  }

  //  船移动
  moveBoat({ boatPos, passagePos }, next: Laya.Handler = null): void {
    //  船移动
    Laya.Tween.to(
      this.boat.getSprite(),
      boatPos,
      2000,
      null,
      Laya.Handler.create(this, () => {
        Laya.Mouse.show();
        next.run();
      })
    );

    //  item移动
    if (this.boat.getPassage()) {
      Laya.Tween.to(
        this.boat.getPassage().getSprite(),
        passagePos,
        2000,
        null,
        // next,
      );
    }
  }

  // 吃东西的动作
  eat(eator: Item, food: Item, next: Laya.Handler = null): void {
    console.log(eator, food);
    Laya.Tween.to(
      eator.getSprite(),
      {
        x: food.getSprite().x,
        y: food.getSprite().y,
      },
      1000,
      null,
      Laya.Handler.create(this, () => {
        food.getSprite().visible = false;
        next.run();
      }),
    );
  }

  //  跳跃的动作
  // jump(jumper: Item, { canJump, posX, posY, rollFlag }): void {
  //   if (canJump) {
  //     Laya.Tween.to(
  //       jumper.getSprite(),
  //       {
  //         x: posX,
  //         y: posY,
  //         rotation: 360 * rollFlag,
  //       },
  //       2000,
  //       Laya.Ease.backInOut,
  //     );
  //   }
  // }

  gameOver(): void {
    Laya.Mouse.show();
    
    const gameOver = new GameOver(Laya.Handler.create(this, this.reset));

    Laya.stage.addChild(gameOver);
  }

  //  重置游戏
  reset(): void {
    //  重置狼羊草的位置,显示被吃掉的item,重置旋转角度
    this.items.forEach((item) => {
      item.setPos(StaticData[item.getTypeStr()].left);
      item.getSprite().visible = true;
      item.getSprite().rotation = 0;
    });

    //  船置空，重置位置
    this.boat.removePassage();
    this.boat.setPos(StaticData.boat.left);

    //  重置河岸信息
    this.riverBanks[0].resetBankArr(true);
    this.riverBanks[1].resetBankArr(false);
  }
}