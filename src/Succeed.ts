import { ui } from './ui/layaMaxUI'
export default class Succeed extends ui.succeedUI {
  
  private reset: Laya.Handler;

  constructor(reset: Laya.Handler) {
    super();
    this.reset = reset;
    this.againBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
      this.again();
    });
  }

  //  再来一次
  public again(): void {
    this.reset.run();
    this.removeSelf();
  }
}