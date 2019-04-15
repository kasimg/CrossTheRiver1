import Item from './Item';
import StaticData from './StaticData';

export default class Boat {
  private passage: Item;

  private img: Laya.Sprite;

  constructor(img: Laya.Sprite) {
    this.img = img;
  }

  //  添加乘客
  public addPassage(passage: Item): void {
    this.passage = passage;

  }

  //  移除乘客
  public removePassage(): void {
    this.passage = null;
  }

  //  判断船是否为空
  public empty(): boolean {
    return this.passage ? false : true;
  }

  //  获取sprite对象
  public getSprite(): Laya.Sprite {
    return this.img;
  }

  //  获取乘客
  public getPassage(): Item {
    return this.passage;
  }

  //  移动，成功移动全程，失败移动半程
  public moveBoat(succeed: boolean = true): any {
    let boatPos: {};
    let passagePos: {};
    //  确定移动的方向
    if (this.img.x === StaticData.boat.left.x) {
      boatPos = StaticData.boat.right;
      passagePos = StaticData.rightRiverBankPos;
    } else {
      boatPos = StaticData.boat.left;
      passagePos = StaticData.leftRiverBankPos;
    }

    //  确定移动的距离
    if (!succeed) {
      boatPos['x'] -= 150;
      passagePos['x'] -= 150;
    }

    return {
      boatPos,
      passagePos,
    };

    //  船移动
    Laya.Tween.to(
      this.img,
      boatPos,
      2000,
    );

    //  item移动
    Laya.Tween.to(
      this.passage.getSprite(),
      passagePos,
      2000,
      null,
    );
  }
}