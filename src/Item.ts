import Sprite = Laya.Sprite;
import StaticData from './StaticData';
import Boat from './Boat';
import RiverBank from './RiverBank';

export default class Item {
  private img: Sprite;

  private typeStr: string;  //  用于区别是谁被点击了，谁该跳（坐标不同）

  private boat: Boat;

  private riverBanks: Array<RiverBank>;

  constructor(img: Sprite, typeStr: string, boat: Boat, riverBanks: Array<RiverBank>) {
    this.img = img;
    this.bindClickEvent();
    this.typeStr = typeStr;
    this.boat = boat;
    this.riverBanks = riverBanks;
  }

  //  绑定点击事件
  bindClickEvent(): void {
    this.img.on(Laya.Event.MOUSE_DOWN, this, this.jump);
  }

  //  从往船上跳
  jump(): void {
    let posX: number;
    let posY: number;

    let rollFlag: number = 1;  //  控制旋转

    let canJump: boolean = true;  //  控制是否能跳

    //  先判断往哪里跳
    if (this.img.x < StaticData.leftRiverBankPos.x) {  //  此时是从左岸向船上跳
      posX = StaticData.leftRiverBankPos.x;
      posY = StaticData.leftRiverBankPos.y;

      if (!this.boat.empty()) {
        canJump = false;
      } else {
        this.boat.addPassage(this);
        this.riverBanks[StaticData.index.LEFT_BANK].getOut(StaticData[this.typeStr].index);
      }
    } else if (this.img.x === StaticData.leftRiverBankPos.x) {  //  此时是从船上向左岸跳
      posX = StaticData[this.typeStr].left.x;
      posY = StaticData[this.typeStr].left.y;
      rollFlag = 0;
      this.boat.removePassage();
      this.riverBanks[StaticData.index.LEFT_BANK].getIn(StaticData[this.typeStr].index);
    } else if (this.img.x === StaticData.rightRiverBankPos.x) {  //  此时是从船上向右岸跳
      posX = StaticData[this.typeStr].right.x;
      posY = StaticData[this.typeStr].right.y;
      rollFlag = 0;
      this.boat.removePassage();
      this.riverBanks[StaticData.index.RIGHT_BANK].getIn(StaticData[this.typeStr].index);
    } else {  //  此时是从右岸往船上跳
      posX = StaticData.rightRiverBankPos.x;
      posY = StaticData.rightRiverBankPos.y;
      if (!this.boat.empty()) {
        canJump = false;
      } else {
        this.boat.addPassage(this);
        this.riverBanks[StaticData.index.RIGHT_BANK].getOut(StaticData[this.typeStr].index);
      }
    }

    //  开始跳
    if (canJump) {
      Laya.Tween.to(
        this.img,
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

  //  游戏判定失败后的吃的动作
  eat(food : Item): void {
    //  吃东西的item移动到被吃的item上
    Laya.Tween.to(
      this.img,
      {
        x: food.getSprite().x,
        y: food.getSprite().y,
      },
      1000,
      null,
      Laya.Handler.create(this, () => {
        food.getSprite().visible = false;
      }),
    );

  }

  //  被吃
  getEaten(): void {

  }

  //  获取类型码
  public getTypeStr(): string {
    return this.typeStr;
  }

  //  获取图片对象（精灵）
  public getSprite(): Laya.Sprite {
    return this.img;
  }

}