import { ui } from './ui/layaMaxUI';
import Item from './Item';
import Boat from './Boat';
import StaticData from './StaticData';
import RiverBank from './RiverBank';

export default class Script extends ui.BackGroundUI {
  private items: Array<Item> = new Array<Item>();
  private boat: Boat = new Boat(this.boatSprite);
  private riverBanks: Array<RiverBank>;

  constructor() {
    super();
    this.initActors();
    this.bindGoEvent();
  }

  //  初始化狼、羊和卷心菜实例
  initActors(): void {
    this.riverBanks = [
      new RiverBank([1, 1, 1]),
      new RiverBank([0, 0, 0]),
    ];

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
    // 确定要判断那边岸的情况
    const bankIndex: number = this.boat.getSprite().x === StaticData.boat.left.x
      ? StaticData.index.LEFT_BANK
      : StaticData.index.RIGHT_BANK

    const eatArr = this.riverBanks[bankIndex].EatOrNot();
    if (eatArr) {  //  如果发生了吃事件
      const eator = this.items[eatArr[0]];
      const food = this.items[eatArr[1]]

      //  先移动再吃东西
      // this.boat.moveBoat(false);
      this.moveBoat(this.boat.moveBoat(false), Laya.Handler.create(this, () => {
        this.eat(eator, food);
      }));
    } else {  //  否则
      // this.boat.moveBoat();
      this.moveBoat(this.boat.moveBoat(), Laya.Handler.create(this, () => {
        Laya.Mouse.show();
      }));
    }
  }

  //  船移动
  moveBoat({ boatPos, passagePos }, next: Laya.Handler = null): void {
    //  船移动
    Laya.Tween.to(
      this.boat.getSprite(),
      boatPos,
      2000,
    );

    //  item移动
    if (this.boat.getPassage()) {
      Laya.Tween.to(
        this.boat.getPassage().getSprite(),
        passagePos,
        2000,
        null,
        next,
      );
    }
  }

  // 吃东西的动作
  eat(eator: Item, food: Item, next: Function = null): void {
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
        // next();
      }),
    );
  }

  //  跳跃的动作
  jump(jumper: Item, { canJump, posX, posY, rollFlag }): void {
    if (canJump) {
      Laya.Tween.to(
        jumper.getSprite(),
        {
          x: posX,
          y: posY,
          rotation: 360 * rollFlag,
        },
        2000,
        Laya.Ease.backInOut,
      );
    }
  }

}