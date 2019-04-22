import { ui } from './ui/layaMaxUI';
export default class GameOver extends ui.gameOverUI {
  private reset: Laya.Handler;

  constructor(resetHandler: Laya.Handler) {
    super();
    this.reset = resetHandler;
    this.restartBtn.on(Laya.Event.MOUSE_DOWN, this, this.restartGame);
  }

  restartGame(): void {
    this.reset.run();
    this.removeSelf();
  }

}