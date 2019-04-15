import StaticData from "./StaticData";

export default class RiverBank {
  private items : Array<number>;  //  1表示在这一边的岸上，0表示不在

  constructor(originState : Array<number>) {
    this.items = originState;  //  设置初始状态
  }

  //  有item上岸
  public getIn(index : number) : void {
    this.items[index] = 1;
  }

  //  有item出岸
  public getOut(index : number) : void {
    this.items[index] = 0;
  }

  //  判断是否有吃的事件发生，返回吃和被吃的对象
  public EatOrNot() : Array<number> {
    if (eval(this.items.join("+")) !== 2) return null;
    if (this.items[StaticData.wolfPos.index] + this.items[StaticData.sheepPos.index] === 2) return [StaticData.wolfPos.index, StaticData.sheepPos.index];
    if (this.items[StaticData.sheepPos.index] + this.items[StaticData.cabbagePos.index] === 2) return [StaticData.sheepPos.index, StaticData.cabbagePos.index];
    return null;
  }
}