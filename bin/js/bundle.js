var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StaticData_1 = require("./StaticData");
var Boat = /** @class */ (function () {
    function Boat(img) {
        this.img = img;
    }
    //  设置船的坐标
    Boat.prototype.setPos = function (_a) {
        var x = _a.x, y = _a.y;
        this.img.x = x;
        this.img.y = y;
    };
    //  添加乘客
    Boat.prototype.addPassage = function (passage) {
        this.passage = passage;
    };
    //  移除乘客
    Boat.prototype.removePassage = function () {
        this.passage = null;
    };
    //  判断船是否为空
    Boat.prototype.empty = function () {
        return this.passage ? false : true;
    };
    //  获取sprite对象
    Boat.prototype.getSprite = function () {
        return this.img;
    };
    //  获取乘客
    Boat.prototype.getPassage = function () {
        return this.passage;
    };
    //  移动，成功移动全程，失败移动半程
    Boat.prototype.moveBoat = function (succeed) {
        if (succeed === void 0) { succeed = true; }
        var boatPos;
        var passagePos;
        var delFlag = 1;
        //  确定移动的方向
        if (this.img.x === StaticData_1.default.boat.left.x) {
            boatPos = Object.create(StaticData_1.default.boat.right);
            passagePos = Object.create(StaticData_1.default.rightRiverBankPos);
        }
        else {
            // console.log('向左走');
            boatPos = Object.create(StaticData_1.default.boat.left);
            passagePos = Object.create(StaticData_1.default.leftRiverBankPos);
            delFlag = -1;
        }
        //  确定移动的距离
        if (!succeed) {
            boatPos['x'] -= 150 * delFlag;
            passagePos['x'] -= 150 * delFlag;
        }
        return {
            boatPos: boatPos,
            passagePos: passagePos,
        };
        //  船移动
        Laya.Tween.to(this.img, boatPos, 2000);
        //  item移动
        Laya.Tween.to(this.passage.getSprite(), passagePos, 2000, null);
    };
    return Boat;
}());
exports.default = Boat;

},{"./StaticData":7}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("./ui/layaMaxUI");
var GameOver = /** @class */ (function (_super) {
    __extends(GameOver, _super);
    function GameOver(resetHandler) {
        var _this = _super.call(this) || this;
        _this.reset = resetHandler;
        _this.restartBtn.on(Laya.Event.MOUSE_DOWN, _this, _this.restartGame);
        return _this;
    }
    GameOver.prototype.restartGame = function () {
        this.reset.run();
        this.removeSelf();
    };
    return GameOver;
}(layaMaxUI_1.ui.gameOverUI));
exports.default = GameOver;

},{"./ui/layaMaxUI":9}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StaticData_1 = require("./StaticData");
var Item = /** @class */ (function () {
    function Item(img, typeStr, boat, riverBanks, succeed) {
        this.img = img;
        this.bindClickEvent();
        this.typeStr = typeStr;
        this.boat = boat;
        this.riverBanks = riverBanks;
        this.succeed = succeed;
    }
    //  绑定点击事件
    Item.prototype.bindClickEvent = function () {
        this.img.on(Laya.Event.MOUSE_DOWN, this, this.jump);
    };
    //  设置图片坐标
    Item.prototype.setPos = function (_a) {
        var x = _a.x, y = _a.y;
        this.img.x = x;
        this.img.y = y;
    };
    //  设置riverbanks，方便重置
    Item.prototype.setRiverBanks = function (riverBanks) {
        this.riverBanks = riverBanks;
    };
    //  从往船上跳
    Item.prototype.jump = function () {
        var _this = this;
        var posX;
        var posY;
        var rollFlag = 1; //  控制旋转
        var canJump = true; //  控制是否能跳
        //  显示信息
        this.showMessage();
        //  先判断往哪里跳
        if (this.img.x < StaticData_1.default.leftRiverBankPos.x) { //  此时是从左岸向船上跳
            posX = StaticData_1.default.leftRiverBankPos.x;
            posY = StaticData_1.default.leftRiverBankPos.y;
            if (!this.boat.empty()) {
                canJump = false;
            }
            else {
                this.boat.addPassage(this);
                this.riverBanks[StaticData_1.default.index.LEFT_BANK].getOut(StaticData_1.default[this.typeStr].index);
                // console.log('跳跃之后的riverbank', this.riverBanks);
            }
        }
        else if (this.img.x === StaticData_1.default.leftRiverBankPos.x) { //  此时是从船上向左岸跳
            posX = StaticData_1.default[this.typeStr].left.x;
            posY = StaticData_1.default[this.typeStr].left.y;
            rollFlag = 0;
            this.boat.removePassage();
            this.riverBanks[StaticData_1.default.index.LEFT_BANK].getIn(StaticData_1.default[this.typeStr].index);
        }
        else if (this.img.x === StaticData_1.default.rightRiverBankPos.x) { //  此时是从船上向右岸跳
            posX = StaticData_1.default[this.typeStr].right.x;
            posY = StaticData_1.default[this.typeStr].right.y;
            rollFlag = -1;
            this.boat.removePassage();
            this.riverBanks[StaticData_1.default.index.RIGHT_BANK].getIn(StaticData_1.default[this.typeStr].index);
        }
        else { //  此时是从右岸往船上跳
            posX = StaticData_1.default.rightRiverBankPos.x;
            posY = StaticData_1.default.rightRiverBankPos.y;
            if (!this.boat.empty()) {
                canJump = false;
            }
            else {
                this.boat.addPassage(this);
                this.riverBanks[StaticData_1.default.index.RIGHT_BANK].getOut(StaticData_1.default[this.typeStr].index);
            }
        }
        //  开始跳
        if (canJump) {
            Laya.Tween.to(this.img, {
                x: posX,
                y: posY,
                rotation: 360 * rollFlag,
            }, 1000, Laya.Ease.backInOut, 
            //  判断是否成功
            Laya.Handler.create(this, function () {
                if (_this.riverBanks[1].succeed()) {
                    // console.log('succeed');
                    _this.succeed.run();
                }
            }));
        }
    };
    //  判断是否成功
    //  游戏判定失败后的吃的动作
    Item.prototype.eat = function (food) {
        //  吃东西的item移动到被吃的item上
        Laya.Tween.to(this.img, {
            x: food.getSprite().x,
            y: food.getSprite().y,
        }, 1000, null, Laya.Handler.create(this, function () {
            food.getSprite().visible = false;
        }));
    };
    //  获取类型码
    Item.prototype.getTypeStr = function () {
        return this.typeStr;
    };
    //  获取图片对象（精灵）
    Item.prototype.getSprite = function () {
        return this.img;
    };
    //  显示信息
    Item.prototype.showMessage = function () {
        var pos = this.boat.getSprite().x === StaticData_1.default.boat.left.x ? '左岸' : '右岸';
        var action = this.boat.empty() ? '上船' : '下船';
        var message = StaticData_1.default[this.typeStr].name + '从' + pos + action;
        StaticData_1.default.message.text += message + '\n';
    };
    return Item;
}());
exports.default = Item;

},{"./StaticData":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Script_1 = require("./Script");
var Main = /** @class */ (function () {
    function Main() {
        this.initUI();
    }
    //  初始化游戏界面
    Main.prototype.initUI = function () {
        Laya.init(1280, 720);
        Laya.stage.bgColor = '#ffffff';
        var resArray = [
            { url: 'res/atlas/actors.atlas', type: Laya.Loader.ATLAS },
            { url: 'actors/gameover.jpg' },
            { url: 'actors/succeed.jpg' },
        ];
        //  加载图像
        Laya.loader.load(resArray, Laya.Handler.create(this, function () {
            var scene = new Script_1.default();
            Laya.stage.addChild(scene);
        }));
    };
    return Main;
}());
//激活启动类
new Main();

},{"./Script":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StaticData_1 = require("./StaticData");
var RiverBank = /** @class */ (function () {
    function RiverBank(originState) {
        this.items = originState; //  设置初始状态
    }
    RiverBank.prototype.resetBankArr = function (left) {
        this.items = left ? [1, 1, 1] : [0, 0, 0];
    };
    //  有item上岸
    RiverBank.prototype.getIn = function (index) {
        this.items[index] = 1;
    };
    //  有item出岸
    RiverBank.prototype.getOut = function (index) {
        this.items[index] = 0;
    };
    //  判断是否有吃的事件发生，返回吃和被吃的对象
    RiverBank.prototype.EatOrNot = function () {
        if (eval(this.items.join("+")) !== 2)
            return null;
        if (this.items[StaticData_1.default.wolfPos.index] + this.items[StaticData_1.default.sheepPos.index] === 2)
            return [StaticData_1.default.wolfPos.index, StaticData_1.default.sheepPos.index];
        if (this.items[StaticData_1.default.sheepPos.index] + this.items[StaticData_1.default.cabbagePos.index] === 2)
            return [StaticData_1.default.sheepPos.index, StaticData_1.default.cabbagePos.index];
        return null;
    };
    //  判断时候游戏胜利
    RiverBank.prototype.succeed = function () {
        if (eval(this.items.join("+")) === 3)
            return true;
        return false;
    };
    return RiverBank;
}());
exports.default = RiverBank;

},{"./StaticData":7}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("./ui/layaMaxUI");
var Item_1 = require("./Item");
var Boat_1 = require("./Boat");
var StaticData_1 = require("./StaticData");
var RiverBank_1 = require("./RiverBank");
var GameOver_1 = require("./GameOver");
var Succeed_1 = require("./Succeed");
var Script = /** @class */ (function (_super) {
    __extends(Script, _super);
    function Script() {
        var _this = _super.call(this) || this;
        _this.boat = new Boat_1.default(_this.boatSprite);
        _this.clickCount = 0; //  控制箭头的方向
        _this.initActors();
        _this.bindGoEvent();
        _this.initMessage();
        return _this;
        // this.gameOver();
    }
    //  初始化狼、羊和卷心菜实例
    Script.prototype.initActors = function () {
        this.riverBanks = [
            new RiverBank_1.default([1, 1, 1]),
            new RiverBank_1.default([0, 0, 0]),
        ];
        this.items = new Array();
        this.items.push(new Item_1.default(this.wolf, 'wolfPos', this.boat, this.riverBanks, Laya.Handler.create(this, this.succeed)));
        this.items.push(new Item_1.default(this.sheep, 'sheepPos', this.boat, this.riverBanks, Laya.Handler.create(this, this.succeed)));
        this.items.push(new Item_1.default(this.cabbage, 'cabbagePos', this.boat, this.riverBanks, Laya.Handler.create(this, this.succeed)));
    };
    //  绑定GO点击事件
    Script.prototype.bindGoEvent = function () {
        this.go.on(Laya.Event.MOUSE_DOWN, this, this.gogogo);
    };
    //  出发！
    Script.prototype.gogogo = function () {
        var _this = this;
        //  隐藏鼠标
        Laya.Mouse.hide();
        //  翻转箭头
        this.clickCount += 1;
        this.go.rotation = 180 * this.clickCount;
        //  显示运输信息
        this.showMessage();
        // 确定要判断那边岸的情况
        var bankIndex = this.boat.getSprite().x === StaticData_1.default.boat.left.x
            ? StaticData_1.default.index.LEFT_BANK
            : StaticData_1.default.index.RIGHT_BANK;
        var eatArr = this.riverBanks[bankIndex].EatOrNot();
        console.log('start moving boat');
        if (eatArr) { //  如果发生了吃事件
            var eator_1 = this.items[eatArr[0]];
            var food_1 = this.items[eatArr[1]];
            //  先移动再吃东西
            this.moveBoat(this.boat.moveBoat(false), Laya.Handler.create(this, function () {
                _this.eat(eator_1, food_1, Laya.Handler.create(_this, _this.gameOver));
            }));
        }
        else { //  否则
            this.moveBoat(this.boat.moveBoat(), Laya.Handler.create(this, function () {
                Laya.Mouse.show();
            }));
        }
    };
    //  初始化信息格式
    Script.prototype.initMessage = function () {
        StaticData_1.default.message.fontSize = 15;
        StaticData_1.default.message.x = 9;
        StaticData_1.default.message.y = 228;
        this.addChild(StaticData_1.default.message);
    };
    //  显示运输信息
    Script.prototype.showMessage = function () {
        var passage = this.boat.getPassage();
        var passageName = passage ? StaticData_1.default[passage.getTypeStr()].name : '空气'; //  获取乘客名称
        //  获取起点和终点信息
        var startPoint = '右岸';
        var endPoint = '左岸';
        if (this.boat.getSprite().x === StaticData_1.default.boat.left.x) {
            startPoint = '左岸';
            endPoint = '右岸';
        }
        //  打印信息
        var message = '把' + passageName + '从' + startPoint + '运输到' + endPoint;
        // Text.text = 'aaaaa';
        StaticData_1.default.message.text += message + '\n';
        // this.addChild(StaticData.message);
    };
    //  船移动
    Script.prototype.moveBoat = function (_a, next) {
        var boatPos = _a.boatPos, passagePos = _a.passagePos;
        if (next === void 0) { next = null; }
        //  船移动
        Laya.Tween.to(this.boat.getSprite(), boatPos, 2000, null, Laya.Handler.create(this, function () {
            Laya.Mouse.show();
            next.run();
        }));
        //  item移动
        if (this.boat.getPassage()) {
            Laya.Tween.to(this.boat.getPassage().getSprite(), passagePos, 2000, null);
        }
    };
    // 吃东西的动作
    Script.prototype.eat = function (eator, food, next) {
        if (next === void 0) { next = null; }
        console.log(eator, food);
        Laya.Tween.to(eator.getSprite(), {
            x: food.getSprite().x,
            y: food.getSprite().y,
        }, 1000, null, Laya.Handler.create(this, function () {
            food.getSprite().visible = false;
            next.run();
        }));
    };
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
    Script.prototype.gameOver = function () {
        Laya.Mouse.show();
        var gameOver = new GameOver_1.default(Laya.Handler.create(this, this.reset));
        Laya.stage.addChild(gameOver);
    };
    //  游戏胜利
    Script.prototype.succeed = function () {
        var succeed = new Succeed_1.default(Laya.Handler.create(this, this.reset));
        Laya.stage.addChild(succeed);
    };
    //  重置游戏
    Script.prototype.reset = function () {
        //  重置狼羊草的位置,显示被吃掉的item,重置旋转角度
        this.items.forEach(function (item) {
            item.setPos(StaticData_1.default[item.getTypeStr()].left);
            item.getSprite().visible = true;
            item.getSprite().rotation = 0;
        });
        //  船置空，重置位置
        this.boat.removePassage();
        this.boat.setPos(StaticData_1.default.boat.left);
        //  重置河岸信息
        this.riverBanks[0].resetBankArr(true);
        this.riverBanks[1].resetBankArr(false);
        //  清空显示信息
        StaticData_1.default.message.text = '';
    };
    return Script;
}(layaMaxUI_1.ui.BackGroundUI));
exports.default = Script;

},{"./Boat":1,"./GameOver":2,"./Item":3,"./RiverBank":5,"./StaticData":7,"./Succeed":8,"./ui/layaMaxUI":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    cabbagePos: {
        left: {
            x: 10,
            y: 164,
        },
        right: {
            x: 879,
            y: 164,
        },
        index: 2,
        name: '卷心菜',
    },
    sheepPos: {
        left: {
            x: 88,
            y: 164,
        },
        right: {
            x: 970,
            y: 164,
        },
        index: 1,
        name: '羊',
    },
    wolfPos: {
        left: {
            x: 163,
            y: 164,
        },
        right: {
            x: 1057,
            y: 164,
        },
        index: 0,
        name: '狼',
    },
    leftRiverBankPos: {
        x: 464,
        y: 173,
    },
    rightRiverBankPos: {
        x: 771,
        y: 173,
    },
    boat: {
        left: {
            x: 282,
            y: 120,
        },
        right: {
            x: 589,
            y: 120,
        },
    },
    index: {
        WOLF: 0,
        SHEEP: 1,
        CABBAGE: 2,
        LEFT_BANK: 0,
        RIGHT_BANK: 1,
    },
    message: new Laya.Text(),
};

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("./ui/layaMaxUI");
var Succeed = /** @class */ (function (_super) {
    __extends(Succeed, _super);
    function Succeed(reset) {
        var _this = _super.call(this) || this;
        _this.reset = reset;
        _this.againBtn.on(Laya.Event.MOUSE_DOWN, _this, function () {
            _this.again();
        });
        return _this;
    }
    //  再来一次
    Succeed.prototype.again = function () {
        this.reset.run();
        this.removeSelf();
    };
    return Succeed;
}(layaMaxUI_1.ui.succeedUI));
exports.default = Succeed;

},{"./ui/layaMaxUI":9}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scene = Laya.Scene;
var REG = Laya.ClassUtils.regClass;
var ui;
(function (ui) {
    var BackGroundUI = /** @class */ (function (_super) {
        __extends(BackGroundUI, _super);
        function BackGroundUI() {
            return _super.call(this) || this;
        }
        BackGroundUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(BackGroundUI.uiView);
        };
        BackGroundUI.uiView = { "type": "Scene", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 215, "x": 0, "width": 251, "texture": "actors/riverbank.png", "height": 502 }, "compId": 58 }, { "type": "Sprite", "props": { "y": 480, "x": 1089, "width": 535, "texture": "actors/riverbank.png", "rotation": 270, "pivotY": 219, "pivotX": 268, "height": 406 }, "compId": 65 }, { "type": "Sprite", "props": { "y": 164, "x": 10, "width": 58, "var": "cabbage", "texture": "actors/cabbage.png", "height": 58 }, "compId": 72 }, { "type": "Sprite", "props": { "y": 164, "x": 88, "width": 58, "var": "sheep", "texture": "actors/sheep.png", "height": 58 }, "compId": 70 }, { "type": "Sprite", "props": { "y": 164, "x": 163, "width": 58, "var": "wolf", "texture": "actors/wolf.png", "height": 58 }, "compId": 71 }, { "type": "Box", "props": { "y": 253, "x": 251, "width": 615, "height": 464 }, "compId": 80, "child": [{ "type": "Sprite", "props": { "y": 133, "width": 123, "texture": "actors/river.png", "name": "item0", "height": 123 }, "compId": 3 }, { "type": "Sprite", "props": { "y": 133, "x": 123, "width": 123, "texture": "actors/river.png", "name": "item1", "height": 123 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 133, "x": 246, "width": 123, "texture": "actors/river.png", "name": "item2", "height": 123 }, "compId": 6 }, { "type": "Sprite", "props": { "y": 133, "x": 369, "width": 123, "texture": "actors/river.png", "name": "item3", "height": 123 }, "compId": 7 }, { "type": "Sprite", "props": { "y": 133, "x": 492, "width": 123, "texture": "actors/river.png", "name": "item4", "height": 123 }, "compId": 8 }, { "type": "Sprite", "props": { "width": 123, "texture": "actors/river.png", "name": "item0", "height": 123 }, "compId": 47 }, { "type": "Sprite", "props": { "x": 123, "width": 123, "texture": "actors/river.png", "name": "item1", "height": 123 }, "compId": 48 }, { "type": "Sprite", "props": { "x": 246, "width": 123, "texture": "actors/river.png", "name": "item2", "height": 123 }, "compId": 49 }, { "type": "Sprite", "props": { "x": 369, "width": 123, "texture": "actors/river.png", "name": "item3", "height": 123 }, "compId": 50 }, { "type": "Sprite", "props": { "x": 492, "width": 123, "texture": "actors/river.png", "name": "item4", "height": 123 }, "compId": 51 }, { "type": "Sprite", "props": { "y": 266, "width": 123, "texture": "actors/river.png", "name": "item0", "height": 123 }, "compId": 60 }, { "type": "Sprite", "props": { "y": 266, "x": 123, "width": 123, "texture": "actors/river.png", "name": "item1", "height": 123 }, "compId": 61 }, { "type": "Sprite", "props": { "y": 266, "x": 246, "width": 123, "texture": "actors/river.png", "name": "item2", "height": 123 }, "compId": 62 }, { "type": "Sprite", "props": { "y": 266, "x": 369, "width": 123, "texture": "actors/river.png", "name": "item3", "height": 123 }, "compId": 63 }, { "type": "Sprite", "props": { "y": 266, "x": 492, "width": 123, "texture": "actors/river.png", "name": "item4", "height": 123 }, "compId": 64 }, { "type": "Sprite", "props": { "y": 402, "width": 123, "texture": "actors/river.png", "name": "item0", "height": 123 }, "compId": 75 }, { "type": "Sprite", "props": { "y": 402, "x": 123, "width": 123, "texture": "actors/river.png", "name": "item1", "height": 123 }, "compId": 76 }, { "type": "Sprite", "props": { "y": 402, "x": 246, "width": 123, "texture": "actors/river.png", "name": "item2", "height": 123 }, "compId": 77 }, { "type": "Sprite", "props": { "y": 402, "x": 369, "width": 123, "texture": "actors/river.png", "name": "item3", "height": 123 }, "compId": 78 }, { "type": "Sprite", "props": { "y": 402, "x": 492, "width": 123, "texture": "actors/river.png", "name": "item4", "height": 123 }, "compId": 79 }] }, { "type": "Box", "props": { "y": 120, "x": 282, "var": "boatSprite" }, "compId": 73, "child": [{ "type": "Sprite", "props": { "width": 261, "texture": "actors/boat.png", "height": 190 }, "compId": 67 }, { "type": "Sprite", "props": { "y": 21, "x": 115, "width": 87, "texture": "actors/farmer.png", "height": 87 }, "compId": 69 }] }, { "type": "Sprite", "props": { "y": 78, "x": 559, "width": 84, "var": "go", "texture": "actors/go.png", "pivotY": 42, "pivotX": 42, "height": 84 }, "compId": 74 }], "loadList": ["actors/riverbank.png", "actors/cabbage.png", "actors/sheep.png", "actors/wolf.png", "actors/river.png", "actors/boat.png", "actors/farmer.png", "actors/go.png"], "loadList3D": [] };
        return BackGroundUI;
    }(Scene));
    ui.BackGroundUI = BackGroundUI;
    REG("ui.BackGroundUI", BackGroundUI);
    var gameOverUI = /** @class */ (function (_super) {
        __extends(gameOverUI, _super);
        function gameOverUI() {
            return _super.call(this) || this;
        }
        gameOverUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(gameOverUI.uiView);
        };
        gameOverUI.uiView = { "type": "Scene", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 1284, "texture": "actors/gameover.jpg", "height": 720 }, "compId": 5 }, { "type": "Button", "props": { "y": 587, "x": 510.5, "width": 263, "var": "restartBtn", "skin": "comp/button.png", "labelSize": 60, "labelColors": "#ffffff", "label": "重新开始", "height": 86 }, "compId": 4 }], "loadList": ["actors/gameover.jpg", "comp/button.png"], "loadList3D": [] };
        return gameOverUI;
    }(Scene));
    ui.gameOverUI = gameOverUI;
    REG("ui.gameOverUI", gameOverUI);
    var succeedUI = /** @class */ (function (_super) {
        __extends(succeedUI, _super);
        function succeedUI() {
            return _super.call(this) || this;
        }
        succeedUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(succeedUI.uiView);
        };
        succeedUI.uiView = { "type": "Scene", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "texture": "actors/succeed.jpg" }, "compId": 3 }, { "type": "Button", "props": { "y": 615, "x": 517, "width": 246, "var": "againBtn", "skin": "comp/button.png", "labelSize": 60, "label": "再来一次", "height": 96 }, "compId": 4 }], "loadList": ["actors/succeed.jpg", "comp/button.png"], "loadList3D": [] };
        return succeedUI;
    }(Scene));
    ui.succeedUI = succeedUI;
    REG("ui.succeedUI", succeedUI);
})(ui = exports.ui || (exports.ui = {}));

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9MYXlhQWlySURFX2JldGEuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9Cb2F0LnRzIiwic3JjL0dhbWVPdmVyLnRzIiwic3JjL0l0ZW0udHMiLCJzcmMvTWFpbi50cyIsInNyYy9SaXZlckJhbmsudHMiLCJzcmMvU2NyaXB0LnRzIiwic3JjL1N0YXRpY0RhdGEudHMiLCJzcmMvU3VjY2VlZC50cyIsInNyYy91aS9sYXlhTWF4VUkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVEEsMkNBQXNDO0FBRXRDO0lBS0UsY0FBWSxHQUFnQjtRQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNqQixDQUFDO0lBRUQsVUFBVTtJQUNILHFCQUFNLEdBQWIsVUFBYyxFQUFNO1lBQUwsUUFBQyxFQUFFLFFBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxRQUFRO0lBQ0QseUJBQVUsR0FBakIsVUFBa0IsT0FBYTtRQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUV6QixDQUFDO0lBRUQsUUFBUTtJQUNELDRCQUFhLEdBQXBCO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELFdBQVc7SUFDSixvQkFBSyxHQUFaO1FBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNyQyxDQUFDO0lBRUQsY0FBYztJQUNQLHdCQUFTLEdBQWhC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RUFBRSxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxTQUFTLEVBQUMsb0JBQW9CLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFlBQVksRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFD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QUM7UUFMYyxnQkFBTSxHQUFNLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsU0FBUyxFQUFDLG9CQUFvQixFQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLE1BQU0sRUFBQyxpQkFBaUIsRUFBQyxXQUFXLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLFVBQVUsRUFBQyxDQUFDLG9CQUFvQixFQUFDLGlCQUFpQixDQUFDLEVBQUMsWUFBWSxFQUFDLEVBQUUsRUFBQyxDQUFDO1FBTXRaLGdCQUFDO0tBUkQsQUFRQyxDQVI4QixLQUFLLEdBUW5DO0lBUlksWUFBUyxZQVFyQixDQUFBO0lBQ0QsR0FBRyxDQUFDLGNBQWMsRUFBQyxTQUFTLENBQUMsQ0FBQztBQUNsQyxDQUFDLEVBbkNhLEVBQUUsR0FBRixVQUFFLEtBQUYsVUFBRSxRQW1DZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nO1xuaW1wb3J0IFN0YXRpY0RhdGEgZnJvbSAnLi9TdGF0aWNEYXRhJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9hdCB7XG4gIHByaXZhdGUgcGFzc2FnZTogSXRlbTtcblxuICBwcml2YXRlIGltZzogTGF5YS5TcHJpdGU7XG5cbiAgY29uc3RydWN0b3IoaW1nOiBMYXlhLlNwcml0ZSkge1xuICAgIHRoaXMuaW1nID0gaW1nO1xuICB9XG5cbiAgLy8gIOiuvue9ruiIueeahOWdkOagh1xuICBwdWJsaWMgc2V0UG9zKHt4LCB5fSk6IHZvaWQge1xuICAgIHRoaXMuaW1nLnggPSB4O1xuICAgIHRoaXMuaW1nLnkgPSB5O1xuICB9XG5cbiAgLy8gIOa3u+WKoOS5mOWuolxuICBwdWJsaWMgYWRkUGFzc2FnZShwYXNzYWdlOiBJdGVtKTogdm9pZCB7XG4gICAgdGhpcy5wYXNzYWdlID0gcGFzc2FnZTtcblxuICB9XG5cbiAgLy8gIOenu+mZpOS5mOWuolxuICBwdWJsaWMgcmVtb3ZlUGFzc2FnZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhc3NhZ2UgPSBudWxsO1xuICB9XG5cbiAgLy8gIOWIpOaWreiIueaYr+WQpuS4uuepulxuICBwdWJsaWMgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFzc2FnZSA/IGZhbHNlIDogdHJ1ZTtcbiAgfVxuXG4gIC8vICDojrflj5ZzcHJpdGXlr7nosaFcbiAgcHVibGljIGdldFNwcml0ZSgpOiBMYXlhLlNwcml0ZSB7XG4gICAgcmV0dXJuIHRoaXMuaW1nO1xuICB9XG5cbiAgLy8gIOiOt+WPluS5mOWuolxuICBwdWJsaWMgZ2V0UGFzc2FnZSgpOiBJdGVtIHtcbiAgICByZXR1cm4gdGhpcy5wYXNzYWdlO1xuICB9XG5cbiAgLy8gIOenu+WKqO+8jOaIkOWKn+enu+WKqOWFqOeoi++8jOWksei0peenu+WKqOWNiueoi1xuICBwdWJsaWMgbW92ZUJvYXQoc3VjY2VlZDogYm9vbGVhbiA9IHRydWUpOiBhbnkge1xuICAgIGxldCBib2F0UG9zOiB7fTtcbiAgICBsZXQgcGFzc2FnZVBvczoge307XG5cbiAgICBsZXQgZGVsRmxhZyA9IDE7XG5cbiAgICAvLyAg56Gu5a6a56e75Yqo55qE5pa55ZCRXG4gICAgaWYgKHRoaXMuaW1nLnggPT09IFN0YXRpY0RhdGEuYm9hdC5sZWZ0LngpIHtcbiAgICAgIGJvYXRQb3MgPSBPYmplY3QuY3JlYXRlKFN0YXRpY0RhdGEuYm9hdC5yaWdodCk7XG4gICAgICBwYXNzYWdlUG9zID0gT2JqZWN0LmNyZWF0ZShTdGF0aWNEYXRhLnJpZ2h0Uml2ZXJCYW5rUG9zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29uc29sZS5sb2coJ+WQkeW3pui1sCcpO1xuICAgICAgYm9hdFBvcyA9IE9iamVjdC5jcmVhdGUoU3RhdGljRGF0YS5ib2F0LmxlZnQpO1xuICAgICAgcGFzc2FnZVBvcyA9IE9iamVjdC5jcmVhdGUoU3RhdGljRGF0YS5sZWZ0Uml2ZXJCYW5rUG9zKTtcbiAgICAgIGRlbEZsYWcgPSAtMTtcbiAgICB9XG4gICAgXG5cbiAgICAvLyAg56Gu5a6a56e75Yqo55qE6Led56a7XG4gICAgaWYgKCFzdWNjZWVkKSB7XG4gICAgICBib2F0UG9zWyd4J10gLT0gMTUwICogZGVsRmxhZztcbiAgICAgIHBhc3NhZ2VQb3NbJ3gnXSAtPSAxNTAgKiBkZWxGbGFnO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBib2F0UG9zLFxuICAgICAgcGFzc2FnZVBvcyxcbiAgICB9O1xuXG4gICAgLy8gIOiIueenu+WKqFxuICAgIExheWEuVHdlZW4udG8oXG4gICAgICB0aGlzLmltZyxcbiAgICAgIGJvYXRQb3MsXG4gICAgICAyMDAwLFxuICAgICk7XG5cbiAgICAvLyAgaXRlbeenu+WKqFxuICAgIExheWEuVHdlZW4udG8oXG4gICAgICB0aGlzLnBhc3NhZ2UuZ2V0U3ByaXRlKCksXG4gICAgICBwYXNzYWdlUG9zLFxuICAgICAgMjAwMCxcbiAgICAgIG51bGwsXG4gICAgKTtcbiAgfVxufSIsImltcG9ydCB7IHVpIH0gZnJvbSAnLi91aS9sYXlhTWF4VUknO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZU92ZXIgZXh0ZW5kcyB1aS5nYW1lT3ZlclVJIHtcbiAgcHJpdmF0ZSByZXNldDogTGF5YS5IYW5kbGVyO1xuXG4gIGNvbnN0cnVjdG9yKHJlc2V0SGFuZGxlcjogTGF5YS5IYW5kbGVyKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnJlc2V0ID0gcmVzZXRIYW5kbGVyO1xuICAgIHRoaXMucmVzdGFydEJ0bi5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sIHRoaXMsIHRoaXMucmVzdGFydEdhbWUpO1xuICB9XG5cbiAgcmVzdGFydEdhbWUoKTogdm9pZCB7XG4gICAgdGhpcy5yZXNldC5ydW4oKTtcbiAgICB0aGlzLnJlbW92ZVNlbGYoKTtcbiAgfVxuXG59IiwiaW1wb3J0IFNwcml0ZSA9IExheWEuU3ByaXRlO1xuaW1wb3J0IFN0YXRpY0RhdGEgZnJvbSAnLi9TdGF0aWNEYXRhJztcbmltcG9ydCBCb2F0IGZyb20gJy4vQm9hdCc7XG5pbXBvcnQgUml2ZXJCYW5rIGZyb20gJy4vUml2ZXJCYW5rJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbSB7XG4gIHByaXZhdGUgaW1nOiBTcHJpdGU7XG5cbiAgcHJpdmF0ZSB0eXBlU3RyOiBzdHJpbmc7ICAvLyAg55So5LqO5Yy65Yir5piv6LCB6KKr54K55Ye75LqG77yM6LCB6K+l6Lez77yI5Z2Q5qCH5LiN5ZCM77yJXG5cbiAgcHJpdmF0ZSBib2F0OiBCb2F0O1xuXG4gIHByaXZhdGUgcml2ZXJCYW5rczogQXJyYXk8Uml2ZXJCYW5rPjtcblxuICBwcml2YXRlIHN1Y2NlZWQ6IExheWEuSGFuZGxlcjtcblxuICBjb25zdHJ1Y3RvcihpbWc6IFNwcml0ZSwgdHlwZVN0cjogc3RyaW5nLCBib2F0OiBCb2F0LCByaXZlckJhbmtzOiBBcnJheTxSaXZlckJhbms+LCBzdWNjZWVkOiBMYXlhLkhhbmRsZXIpIHtcbiAgICB0aGlzLmltZyA9IGltZztcbiAgICB0aGlzLmJpbmRDbGlja0V2ZW50KCk7XG4gICAgdGhpcy50eXBlU3RyID0gdHlwZVN0cjtcbiAgICB0aGlzLmJvYXQgPSBib2F0O1xuICAgIHRoaXMucml2ZXJCYW5rcyA9IHJpdmVyQmFua3M7XG4gICAgdGhpcy5zdWNjZWVkID0gc3VjY2VlZDtcbiAgfVxuXG4gIC8vICDnu5Hlrprngrnlh7vkuovku7ZcbiAgYmluZENsaWNrRXZlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5pbWcub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLCB0aGlzLCB0aGlzLmp1bXApO1xuICB9XG5cbiAgLy8gIOiuvue9ruWbvueJh+WdkOagh1xuICBwdWJsaWMgc2V0UG9zKHt4LCB5fSk6IHZvaWQge1xuICAgIHRoaXMuaW1nLnggPSB4O1xuICAgIHRoaXMuaW1nLnkgPSB5O1xuICB9XG5cbiAgLy8gIOiuvue9rnJpdmVyYmFua3PvvIzmlrnkvr/ph43nva5cbiAgcHVibGljIHNldFJpdmVyQmFua3Mocml2ZXJCYW5rczogQXJyYXk8Uml2ZXJCYW5rPik6dm9pZCB7XG4gICAgdGhpcy5yaXZlckJhbmtzID0gcml2ZXJCYW5rcztcbiAgfVxuXG4gIC8vICDku47lvoDoiLnkuIrot7NcbiAganVtcCgpOiB2b2lkIHtcbiAgICBsZXQgcG9zWDogbnVtYmVyO1xuICAgIGxldCBwb3NZOiBudW1iZXI7XG5cbiAgICBsZXQgcm9sbEZsYWc6IG51bWJlciA9IDE7ICAvLyAg5o6n5Yi25peL6L2sXG5cbiAgICBsZXQgY2FuSnVtcDogYm9vbGVhbiA9IHRydWU7ICAvLyAg5o6n5Yi25piv5ZCm6IO96LezXG5cbiAgICAvLyAg5pi+56S65L+h5oGvXG4gICAgdGhpcy5zaG93TWVzc2FnZSgpO1xuXG4gICAgLy8gIOWFiOWIpOaWreW+gOWTqumHjOi3s1xuICAgIGlmICh0aGlzLmltZy54IDwgU3RhdGljRGF0YS5sZWZ0Uml2ZXJCYW5rUG9zLngpIHsgIC8vICDmraTml7bmmK/ku47lt6blsrjlkJHoiLnkuIrot7NcbiAgICAgIHBvc1ggPSBTdGF0aWNEYXRhLmxlZnRSaXZlckJhbmtQb3MueDtcbiAgICAgIHBvc1kgPSBTdGF0aWNEYXRhLmxlZnRSaXZlckJhbmtQb3MueTtcblxuICAgICAgaWYgKCF0aGlzLmJvYXQuZW1wdHkoKSkge1xuICAgICAgICBjYW5KdW1wID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJvYXQuYWRkUGFzc2FnZSh0aGlzKTtcbiAgICAgICAgdGhpcy5yaXZlckJhbmtzW1N0YXRpY0RhdGEuaW5kZXguTEVGVF9CQU5LXS5nZXRPdXQoU3RhdGljRGF0YVt0aGlzLnR5cGVTdHJdLmluZGV4KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ+i3s+i3g+S5i+WQjueahHJpdmVyYmFuaycsIHRoaXMucml2ZXJCYW5rcyk7XG4gICAgICAgIFxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5pbWcueCA9PT0gU3RhdGljRGF0YS5sZWZ0Uml2ZXJCYW5rUG9zLngpIHsgIC8vICDmraTml7bmmK/ku47oiLnkuIrlkJHlt6blsrjot7NcbiAgICAgIHBvc1ggPSBTdGF0aWNEYXRhW3RoaXMudHlwZVN0cl0ubGVmdC54O1xuICAgICAgcG9zWSA9IFN0YXRpY0RhdGFbdGhpcy50eXBlU3RyXS5sZWZ0Lnk7XG4gICAgICByb2xsRmxhZyA9IDA7XG4gICAgICB0aGlzLmJvYXQucmVtb3ZlUGFzc2FnZSgpO1xuICAgICAgdGhpcy5yaXZlckJhbmtzW1N0YXRpY0RhdGEuaW5kZXguTEVGVF9CQU5LXS5nZXRJbihTdGF0aWNEYXRhW3RoaXMudHlwZVN0cl0uaW5kZXgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pbWcueCA9PT0gU3RhdGljRGF0YS5yaWdodFJpdmVyQmFua1Bvcy54KSB7ICAvLyAg5q2k5pe25piv5LuO6Ii55LiK5ZCR5Y+z5bK46LezXG4gICAgICBwb3NYID0gU3RhdGljRGF0YVt0aGlzLnR5cGVTdHJdLnJpZ2h0Lng7XG4gICAgICBwb3NZID0gU3RhdGljRGF0YVt0aGlzLnR5cGVTdHJdLnJpZ2h0Lnk7XG4gICAgICByb2xsRmxhZyA9IC0xO1xuICAgICAgdGhpcy5ib2F0LnJlbW92ZVBhc3NhZ2UoKTtcbiAgICAgIHRoaXMucml2ZXJCYW5rc1tTdGF0aWNEYXRhLmluZGV4LlJJR0hUX0JBTktdLmdldEluKFN0YXRpY0RhdGFbdGhpcy50eXBlU3RyXS5pbmRleCk7XG4gICAgfSBlbHNlIHsgIC8vICDmraTml7bmmK/ku47lj7PlsrjlvoDoiLnkuIrot7NcbiAgICAgIHBvc1ggPSBTdGF0aWNEYXRhLnJpZ2h0Uml2ZXJCYW5rUG9zLng7XG4gICAgICBwb3NZID0gU3RhdGljRGF0YS5yaWdodFJpdmVyQmFua1Bvcy55O1xuICAgICAgaWYgKCF0aGlzLmJvYXQuZW1wdHkoKSkge1xuICAgICAgICBjYW5KdW1wID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJvYXQuYWRkUGFzc2FnZSh0aGlzKTtcbiAgICAgICAgdGhpcy5yaXZlckJhbmtzW1N0YXRpY0RhdGEuaW5kZXguUklHSFRfQkFOS10uZ2V0T3V0KFN0YXRpY0RhdGFbdGhpcy50eXBlU3RyXS5pbmRleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gIOW8gOWni+i3s1xuICAgIGlmIChjYW5KdW1wKSB7XG4gICAgICBMYXlhLlR3ZWVuLnRvKFxuICAgICAgICB0aGlzLmltZyxcbiAgICAgICAge1xuICAgICAgICAgIHg6IHBvc1gsXG4gICAgICAgICAgeTogcG9zWSxcbiAgICAgICAgICByb3RhdGlvbjogMzYwICogcm9sbEZsYWcsXG4gICAgICAgIH0sXG4gICAgICAgIDEwMDAsXG4gICAgICAgIExheWEuRWFzZS5iYWNrSW5PdXQsXG5cbiAgICAgICAgLy8gIOWIpOaWreaYr+WQpuaIkOWKn1xuICAgICAgICBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5yaXZlckJhbmtzWzFdLnN1Y2NlZWQoKSkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2NlZWQnKTtcbiAgICAgICAgICAgIHRoaXMuc3VjY2VlZC5ydW4oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgICB9XG5cbiAgfVxuXG4gIC8vICDliKTmlq3mmK/lkKbmiJDlip9cblxuICAvLyAg5ri45oiP5Yik5a6a5aSx6LSl5ZCO55qE5ZCD55qE5Yqo5L2cXG4gIGVhdChmb29kIDogSXRlbSk6IHZvaWQge1xuICAgIC8vICDlkIPkuJzopb/nmoRpdGVt56e75Yqo5Yiw6KKr5ZCD55qEaXRlbeS4ilxuICAgIExheWEuVHdlZW4udG8oXG4gICAgICB0aGlzLmltZyxcbiAgICAgIHtcbiAgICAgICAgeDogZm9vZC5nZXRTcHJpdGUoKS54LFxuICAgICAgICB5OiBmb29kLmdldFNwcml0ZSgpLnksXG4gICAgICB9LFxuICAgICAgMTAwMCxcbiAgICAgIG51bGwsXG4gICAgICBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcbiAgICAgICAgZm9vZC5nZXRTcHJpdGUoKS52aXNpYmxlID0gZmFsc2U7XG4gICAgICB9KSxcbiAgICApO1xuXG4gIH1cblxuICAvLyAg6I635Y+W57G75Z6L56CBXG4gIHB1YmxpYyBnZXRUeXBlU3RyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudHlwZVN0cjtcbiAgfVxuXG4gIC8vICDojrflj5blm77niYflr7nosaHvvIjnsr7ngbXvvIlcbiAgcHVibGljIGdldFNwcml0ZSgpOiBMYXlhLlNwcml0ZSB7XG4gICAgcmV0dXJuIHRoaXMuaW1nO1xuICB9XG5cbiAgLy8gIOaYvuekuuS/oeaBr1xuICBzaG93TWVzc2FnZSgpOiB2b2lkIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLmJvYXQuZ2V0U3ByaXRlKCkueCA9PT0gU3RhdGljRGF0YS5ib2F0LmxlZnQueCA/ICflt6blsrgnIDogJ+WPs+WyuCc7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5ib2F0LmVtcHR5KCkgPyAn5LiK6Ii5JyA6ICfkuIvoiLknO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBTdGF0aWNEYXRhW3RoaXMudHlwZVN0cl0ubmFtZSArICfku44nICsgcG9zICsgYWN0aW9uO1xuICAgIFN0YXRpY0RhdGEubWVzc2FnZS50ZXh0ICs9IG1lc3NhZ2UgKyAnXFxuJztcbiAgfVxuXG59IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xuaW1wb3J0IFNjcmlwdCBmcm9tIFwiLi9TY3JpcHRcIjtcblxuY2xhc3MgTWFpbiB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuaW5pdFVJKCk7XG5cdH1cblx0XG5cdC8vICDliJ3lp4vljJbmuLjmiI/nlYzpnaJcblx0aW5pdFVJKCk6IHZvaWQge1xuXHRcdExheWEuaW5pdCgxMjgwLCA3MjApO1xuXHRcdExheWEuc3RhZ2UuYmdDb2xvciA9ICcjZmZmZmZmJztcblx0XHRjb25zdCByZXNBcnJheSA9IFtcblx0XHRcdHt1cmw6ICdyZXMvYXRsYXMvYWN0b3JzLmF0bGFzJywgdHlwZTogTGF5YS5Mb2FkZXIuQVRMQVN9LFxuXHRcdFx0e3VybDogJ2FjdG9ycy9nYW1lb3Zlci5qcGcnfSxcblx0XHRcdHt1cmw6ICdhY3RvcnMvc3VjY2VlZC5qcGcnfSxcblx0XHRdO1xuXG5cdFx0Ly8gIOWKoOi9veWbvuWDj1xuXHRcdExheWEubG9hZGVyLmxvYWQocmVzQXJyYXksIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xuXHRcdFx0Y29uc3Qgc2NlbmU6IFNjcmlwdCA9IG5ldyBTY3JpcHQoKTtcblx0XHRcdExheWEuc3RhZ2UuYWRkQ2hpbGQoc2NlbmUpO1xuXHRcdH0pKTtcblx0fVxufVxuLy/mv4DmtLvlkK/liqjnsbtcbm5ldyBNYWluKCk7XG4iLCJpbXBvcnQgU3RhdGljRGF0YSBmcm9tIFwiLi9TdGF0aWNEYXRhXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJpdmVyQmFuayB7XG4gIHByaXZhdGUgaXRlbXMgOiBBcnJheTxudW1iZXI+OyAgLy8gIDHooajnpLrlnKjov5nkuIDovrnnmoTlsrjkuIrvvIww6KGo56S65LiN5ZyoXG5cbiAgY29uc3RydWN0b3Iob3JpZ2luU3RhdGUgOiBBcnJheTxudW1iZXI+KSB7XG4gICAgdGhpcy5pdGVtcyA9IG9yaWdpblN0YXRlOyAgLy8gIOiuvue9ruWIneWni+eKtuaAgVxuICB9XG5cbiAgcHVibGljIHJlc2V0QmFua0FycihsZWZ0OiBib29sZWFuKTp2b2lkIHtcbiAgICB0aGlzLml0ZW1zID0gbGVmdCA/IFsxLCAxLCAxXSA6IFswLCAwLCAwXTtcbiAgfVxuICAvLyAg5pyJaXRlbeS4iuWyuFxuICBwdWJsaWMgZ2V0SW4oaW5kZXggOiBudW1iZXIpIDogdm9pZCB7XG4gICAgdGhpcy5pdGVtc1tpbmRleF0gPSAxO1xuICB9XG5cbiAgLy8gIOaciWl0ZW3lh7rlsrhcbiAgcHVibGljIGdldE91dChpbmRleCA6IG51bWJlcikgOiB2b2lkIHtcbiAgICB0aGlzLml0ZW1zW2luZGV4XSA9IDA7XG4gIH1cblxuICAvLyAg5Yik5pat5piv5ZCm5pyJ5ZCD55qE5LqL5Lu25Y+R55Sf77yM6L+U5Zue5ZCD5ZKM6KKr5ZCD55qE5a+56LGhXG4gIHB1YmxpYyBFYXRPck5vdCgpIDogQXJyYXk8bnVtYmVyPiB7XG4gICAgaWYgKGV2YWwodGhpcy5pdGVtcy5qb2luKFwiK1wiKSkgIT09IDIpIHJldHVybiBudWxsO1xuICAgIGlmICh0aGlzLml0ZW1zW1N0YXRpY0RhdGEud29sZlBvcy5pbmRleF0gKyB0aGlzLml0ZW1zW1N0YXRpY0RhdGEuc2hlZXBQb3MuaW5kZXhdID09PSAyKSByZXR1cm4gW1N0YXRpY0RhdGEud29sZlBvcy5pbmRleCwgU3RhdGljRGF0YS5zaGVlcFBvcy5pbmRleF07XG4gICAgaWYgKHRoaXMuaXRlbXNbU3RhdGljRGF0YS5zaGVlcFBvcy5pbmRleF0gKyB0aGlzLml0ZW1zW1N0YXRpY0RhdGEuY2FiYmFnZVBvcy5pbmRleF0gPT09IDIpIHJldHVybiBbU3RhdGljRGF0YS5zaGVlcFBvcy5pbmRleCwgU3RhdGljRGF0YS5jYWJiYWdlUG9zLmluZGV4XTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vICDliKTmlq3ml7blgJnmuLjmiI/og5zliKlcbiAgcHVibGljIHN1Y2NlZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKGV2YWwodGhpcy5pdGVtcy5qb2luKFwiK1wiKSkgPT09IDMpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufSIsImltcG9ydCB7IHVpIH0gZnJvbSAnLi91aS9sYXlhTWF4VUknO1xuaW1wb3J0IEl0ZW0gZnJvbSAnLi9JdGVtJztcbmltcG9ydCBCb2F0IGZyb20gJy4vQm9hdCc7XG5pbXBvcnQgU3RhdGljRGF0YSBmcm9tICcuL1N0YXRpY0RhdGEnO1xuaW1wb3J0IFJpdmVyQmFuayBmcm9tICcuL1JpdmVyQmFuayc7XG5pbXBvcnQgR2FtZU92ZXIgZnJvbSAnLi9HYW1lT3Zlcic7XG5pbXBvcnQgU3VjY2VlZCBmcm9tICcuL1N1Y2NlZWQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JpcHQgZXh0ZW5kcyB1aS5CYWNrR3JvdW5kVUkge1xuICBwcml2YXRlIGl0ZW1zOiBBcnJheTxJdGVtPjtcbiAgcHJpdmF0ZSBib2F0OiBCb2F0ID0gbmV3IEJvYXQodGhpcy5ib2F0U3ByaXRlKTtcbiAgcHJpdmF0ZSByaXZlckJhbmtzOiBBcnJheTxSaXZlckJhbms+O1xuXG4gIHByaXZhdGUgY2xpY2tDb3VudCA9IDA7ICAvLyAg5o6n5Yi2566t5aS055qE5pa55ZCRXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmluaXRBY3RvcnMoKTtcbiAgICB0aGlzLmJpbmRHb0V2ZW50KCk7XG4gICAgdGhpcy5pbml0TWVzc2FnZSgpO1xuICAgIC8vIHRoaXMuZ2FtZU92ZXIoKTtcbiAgfVxuXG4gIC8vICDliJ3lp4vljJbni7zjgIHnvorlkozljbflv4Poj5zlrp7kvotcbiAgaW5pdEFjdG9ycygpOiB2b2lkIHtcbiAgICB0aGlzLnJpdmVyQmFua3MgPSBbXG4gICAgICBuZXcgUml2ZXJCYW5rKFsxLCAxLCAxXSksXG4gICAgICBuZXcgUml2ZXJCYW5rKFswLCAwLCAwXSksXG4gICAgXTtcblxuICAgIHRoaXMuaXRlbXMgPSBuZXcgQXJyYXk8SXRlbT4oKTtcbiAgICB0aGlzLml0ZW1zLnB1c2gobmV3IEl0ZW0odGhpcy53b2xmLCAnd29sZlBvcycsIHRoaXMuYm9hdCwgdGhpcy5yaXZlckJhbmtzLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMuc3VjY2VlZCkpKTtcbiAgICB0aGlzLml0ZW1zLnB1c2gobmV3IEl0ZW0odGhpcy5zaGVlcCwgJ3NoZWVwUG9zJywgdGhpcy5ib2F0LCB0aGlzLnJpdmVyQmFua3MsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5zdWNjZWVkKSkpO1xuICAgIHRoaXMuaXRlbXMucHVzaChuZXcgSXRlbSh0aGlzLmNhYmJhZ2UsICdjYWJiYWdlUG9zJywgdGhpcy5ib2F0LCB0aGlzLnJpdmVyQmFua3MsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5zdWNjZWVkKSkpO1xuICB9XG5cbiAgLy8gIOe7keWumkdP54K55Ye75LqL5Lu2XG4gIGJpbmRHb0V2ZW50KCk6IHZvaWQge1xuICAgIHRoaXMuZ28ub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLCB0aGlzLCB0aGlzLmdvZ29nbyk7XG4gIH1cblxuICAvLyAg5Ye65Y+R77yBXG4gIGdvZ29nbygpOiB2b2lkIHtcbiAgICAvLyAg6ZqQ6JeP6byg5qCHXG4gICAgTGF5YS5Nb3VzZS5oaWRlKCk7XG4gICAgLy8gIOe/u+i9rOeureWktFxuICAgIHRoaXMuY2xpY2tDb3VudCArPSAxO1xuICAgIHRoaXMuZ28ucm90YXRpb24gPSAxODAgKiB0aGlzLmNsaWNrQ291bnQ7XG4gICAgLy8gIOaYvuekuui/kOi+k+S/oeaBr1xuICAgIHRoaXMuc2hvd01lc3NhZ2UoKTtcbiAgICAvLyDnoa7lrpropoHliKTmlq3pgqPovrnlsrjnmoTmg4XlhrVcbiAgICBjb25zdCBiYW5rSW5kZXg6IG51bWJlciA9IHRoaXMuYm9hdC5nZXRTcHJpdGUoKS54ID09PSBTdGF0aWNEYXRhLmJvYXQubGVmdC54XG4gICAgICA/IFN0YXRpY0RhdGEuaW5kZXguTEVGVF9CQU5LXG4gICAgICA6IFN0YXRpY0RhdGEuaW5kZXguUklHSFRfQkFOS1xuXG4gICAgXG4gICAgY29uc3QgZWF0QXJyID0gdGhpcy5yaXZlckJhbmtzW2JhbmtJbmRleF0uRWF0T3JOb3QoKTtcbiAgICBjb25zb2xlLmxvZygnc3RhcnQgbW92aW5nIGJvYXQnKTtcbiAgICBpZiAoZWF0QXJyKSB7ICAvLyAg5aaC5p6c5Y+R55Sf5LqG5ZCD5LqL5Lu2XG4gICAgICBjb25zdCBlYXRvciA9IHRoaXMuaXRlbXNbZWF0QXJyWzBdXTtcbiAgICAgIGNvbnN0IGZvb2QgPSB0aGlzLml0ZW1zW2VhdEFyclsxXV1cbiAgICAgIFxuICAgICAgLy8gIOWFiOenu+WKqOWGjeWQg+S4nOilv1xuICAgICAgdGhpcy5tb3ZlQm9hdCh0aGlzLmJvYXQubW92ZUJvYXQoZmFsc2UpLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcbiAgICAgICAgdGhpcy5lYXQoZWF0b3IsIGZvb2QsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5nYW1lT3ZlcikpO1xuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7ICAvLyAg5ZCm5YiZXG4gICAgICB0aGlzLm1vdmVCb2F0KHRoaXMuYm9hdC5tb3ZlQm9hdCgpLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcbiAgICAgICAgTGF5YS5Nb3VzZS5zaG93KCk7XG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgLy8gIOWIneWni+WMluS/oeaBr+agvOW8j1xuICBpbml0TWVzc2FnZSgpOiB2b2lkIHtcbiAgICBTdGF0aWNEYXRhLm1lc3NhZ2UuZm9udFNpemUgPSAxNTtcbiAgICBTdGF0aWNEYXRhLm1lc3NhZ2UueCA9IDk7XG4gICAgU3RhdGljRGF0YS5tZXNzYWdlLnkgPSAyMjg7XG4gICAgdGhpcy5hZGRDaGlsZChTdGF0aWNEYXRhLm1lc3NhZ2UpO1xuICB9XG5cbiAgLy8gIOaYvuekuui/kOi+k+S/oeaBr1xuICBzaG93TWVzc2FnZSgpOiB2b2lkIHtcbiAgICBjb25zdCBwYXNzYWdlID0gdGhpcy5ib2F0LmdldFBhc3NhZ2UoKTtcbiAgICBsZXQgcGFzc2FnZU5hbWUgPSBwYXNzYWdlID8gIFN0YXRpY0RhdGFbcGFzc2FnZS5nZXRUeXBlU3RyKCldLm5hbWUgOiAn56m65rCUJzsgIC8vICDojrflj5bkuZjlrqLlkI3np7BcbiAgICAvLyAg6I635Y+W6LW354K55ZKM57uI54K55L+h5oGvXG4gICAgbGV0IHN0YXJ0UG9pbnQgPSAn5Y+z5bK4JztcbiAgICBsZXQgZW5kUG9pbnQgPSAn5bem5bK4JztcbiAgICBpZiAodGhpcy5ib2F0LmdldFNwcml0ZSgpLnggPT09IFN0YXRpY0RhdGEuYm9hdC5sZWZ0LngpIHtcbiAgICAgIHN0YXJ0UG9pbnQgPSAn5bem5bK4JztcbiAgICAgIGVuZFBvaW50ID0gJ+WPs+WyuCc7XG4gICAgfVxuXG4gICAgLy8gIOaJk+WNsOS/oeaBr1xuICAgIGNvbnN0IG1lc3NhZ2UgPSAn5oqKJyArIHBhc3NhZ2VOYW1lICsgJ+S7jicgKyBzdGFydFBvaW50ICsgJ+i/kOi+k+WIsCcgKyBlbmRQb2ludDtcbiAgICAvLyBUZXh0LnRleHQgPSAnYWFhYWEnO1xuICAgIFN0YXRpY0RhdGEubWVzc2FnZS50ZXh0ICs9IG1lc3NhZ2UgKyAnXFxuJztcbiAgICAvLyB0aGlzLmFkZENoaWxkKFN0YXRpY0RhdGEubWVzc2FnZSk7XG4gIH1cblxuICAvLyAg6Ii556e75YqoXG4gIG1vdmVCb2F0KHsgYm9hdFBvcywgcGFzc2FnZVBvcyB9LCBuZXh0OiBMYXlhLkhhbmRsZXIgPSBudWxsKTogdm9pZCB7XG4gICAgLy8gIOiIueenu+WKqFxuICAgIExheWEuVHdlZW4udG8oXG4gICAgICB0aGlzLmJvYXQuZ2V0U3ByaXRlKCksXG4gICAgICBib2F0UG9zLFxuICAgICAgMjAwMCxcbiAgICAgIG51bGwsXG4gICAgICBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcbiAgICAgICAgTGF5YS5Nb3VzZS5zaG93KCk7XG4gICAgICAgIG5leHQucnVuKCk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyAgaXRlbeenu+WKqFxuICAgIGlmICh0aGlzLmJvYXQuZ2V0UGFzc2FnZSgpKSB7XG4gICAgICBMYXlhLlR3ZWVuLnRvKFxuICAgICAgICB0aGlzLmJvYXQuZ2V0UGFzc2FnZSgpLmdldFNwcml0ZSgpLFxuICAgICAgICBwYXNzYWdlUG9zLFxuICAgICAgICAyMDAwLFxuICAgICAgICBudWxsLFxuICAgICAgICAvLyBuZXh0LFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvLyDlkIPkuJzopb/nmoTliqjkvZxcbiAgZWF0KGVhdG9yOiBJdGVtLCBmb29kOiBJdGVtLCBuZXh0OiBMYXlhLkhhbmRsZXIgPSBudWxsKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coZWF0b3IsIGZvb2QpO1xuICAgIExheWEuVHdlZW4udG8oXG4gICAgICBlYXRvci5nZXRTcHJpdGUoKSxcbiAgICAgIHtcbiAgICAgICAgeDogZm9vZC5nZXRTcHJpdGUoKS54LFxuICAgICAgICB5OiBmb29kLmdldFNwcml0ZSgpLnksXG4gICAgICB9LFxuICAgICAgMTAwMCxcbiAgICAgIG51bGwsXG4gICAgICBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcbiAgICAgICAgZm9vZC5nZXRTcHJpdGUoKS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIG5leHQucnVuKCk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgLy8gIOi3s+i3g+eahOWKqOS9nFxuICAvLyBqdW1wKGp1bXBlcjogSXRlbSwgeyBjYW5KdW1wLCBwb3NYLCBwb3NZLCByb2xsRmxhZyB9KTogdm9pZCB7XG4gIC8vICAgaWYgKGNhbkp1bXApIHtcbiAgLy8gICAgIExheWEuVHdlZW4udG8oXG4gIC8vICAgICAgIGp1bXBlci5nZXRTcHJpdGUoKSxcbiAgLy8gICAgICAge1xuICAvLyAgICAgICAgIHg6IHBvc1gsXG4gIC8vICAgICAgICAgeTogcG9zWSxcbiAgLy8gICAgICAgICByb3RhdGlvbjogMzYwICogcm9sbEZsYWcsXG4gIC8vICAgICAgIH0sXG4gIC8vICAgICAgIDIwMDAsXG4gIC8vICAgICAgIExheWEuRWFzZS5iYWNrSW5PdXQsXG4gIC8vICAgICApO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIGdhbWVPdmVyKCk6IHZvaWQge1xuICAgIExheWEuTW91c2Uuc2hvdygpO1xuICAgIFxuICAgIGNvbnN0IGdhbWVPdmVyID0gbmV3IEdhbWVPdmVyKExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5yZXNldCkpO1xuXG4gICAgTGF5YS5zdGFnZS5hZGRDaGlsZChnYW1lT3Zlcik7XG4gIH1cblxuICAvLyAg5ri45oiP6IOc5YipXG4gIHN1Y2NlZWQoKTogdm9pZCB7XG4gICAgY29uc3Qgc3VjY2VlZCA9IG5ldyBTdWNjZWVkKExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5yZXNldCkpO1xuICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoc3VjY2VlZCk7XG4gIH1cblxuICAvLyAg6YeN572u5ri45oiPXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIC8vICDph43nva7ni7znvorojYnnmoTkvY3nva4s5pi+56S66KKr5ZCD5o6J55qEaXRlbSzph43nva7ml4vovazop5LluqZcbiAgICB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uc2V0UG9zKFN0YXRpY0RhdGFbaXRlbS5nZXRUeXBlU3RyKCldLmxlZnQpO1xuICAgICAgaXRlbS5nZXRTcHJpdGUoKS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIGl0ZW0uZ2V0U3ByaXRlKCkucm90YXRpb24gPSAwO1xuICAgIH0pO1xuXG4gICAgLy8gIOiIuee9ruepuu+8jOmHjee9ruS9jee9rlxuICAgIHRoaXMuYm9hdC5yZW1vdmVQYXNzYWdlKCk7XG4gICAgdGhpcy5ib2F0LnNldFBvcyhTdGF0aWNEYXRhLmJvYXQubGVmdCk7XG5cbiAgICAvLyAg6YeN572u5rKz5bK45L+h5oGvXG4gICAgdGhpcy5yaXZlckJhbmtzWzBdLnJlc2V0QmFua0Fycih0cnVlKTtcbiAgICB0aGlzLnJpdmVyQmFua3NbMV0ucmVzZXRCYW5rQXJyKGZhbHNlKTtcblxuICAgIC8vICDmuIXnqbrmmL7npLrkv6Hmga9cbiAgICBTdGF0aWNEYXRhLm1lc3NhZ2UudGV4dCA9ICcnO1xuICB9XG59IiwiZXhwb3J0IGRlZmF1bHQge1xuICBjYWJiYWdlUG9zOiB7XG4gICAgbGVmdDoge1xuICAgICAgeDogMTAsXG4gICAgICB5OiAxNjQsXG4gICAgfSxcbiAgICByaWdodDoge1xuICAgICAgeDogODc5LFxuICAgICAgeTogMTY0LFxuICAgIH0sXG4gICAgaW5kZXg6IDIsXG4gICAgbmFtZTogJ+WNt+W/g+iPnCcsXG4gIH0sXG5cbiAgc2hlZXBQb3M6IHtcbiAgICBsZWZ0OiB7XG4gICAgICB4OiA4OCxcbiAgICAgIHk6IDE2NCxcbiAgICB9LFxuICAgIHJpZ2h0OiB7XG4gICAgICB4OiA5NzAsXG4gICAgICB5OiAxNjQsXG4gICAgfSxcbiAgICBpbmRleDogMSxcbiAgICBuYW1lOiAn576KJyxcbiAgfSxcblxuICB3b2xmUG9zOiB7XG4gICAgbGVmdDoge1xuICAgICAgeDogMTYzLFxuICAgICAgeTogMTY0LFxuICAgIH0sXG4gICAgcmlnaHQ6IHtcbiAgICAgIHg6IDEwNTcsXG4gICAgICB5OiAxNjQsXG4gICAgfSxcbiAgICBpbmRleDogMCxcbiAgICBuYW1lOiAn54u8JyxcbiAgfSxcblxuICBsZWZ0Uml2ZXJCYW5rUG9zOiB7XG4gICAgeDogNDY0LFxuICAgIHk6IDE3MyxcbiAgfSxcblxuICByaWdodFJpdmVyQmFua1Bvczoge1xuICAgIHg6IDc3MSxcbiAgICB5OiAxNzMsXG4gIH0sXG5cbiAgYm9hdDoge1xuICAgIGxlZnQ6IHtcbiAgICAgIHg6IDI4MixcbiAgICAgIHk6IDEyMCxcbiAgICB9LFxuICAgIHJpZ2h0OiB7XG4gICAgICB4OiA1ODksXG4gICAgICB5OiAxMjAsXG4gICAgfSxcbiAgfSxcblxuICBpbmRleDoge1xuICAgIFdPTEY6IDAsXG4gICAgU0hFRVA6IDEsXG4gICAgQ0FCQkFHRTogMixcbiAgICBMRUZUX0JBTks6IDAsXG4gICAgUklHSFRfQkFOSzogMSxcbiAgfSxcblxuICBtZXNzYWdlOiBuZXcgTGF5YS5UZXh0KCksXG59XG4iLCJpbXBvcnQgeyB1aSB9IGZyb20gJy4vdWkvbGF5YU1heFVJJ1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VjY2VlZCBleHRlbmRzIHVpLnN1Y2NlZWRVSSB7XG4gIFxuICBwcml2YXRlIHJlc2V0OiBMYXlhLkhhbmRsZXI7XG5cbiAgY29uc3RydWN0b3IocmVzZXQ6IExheWEuSGFuZGxlcikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5yZXNldCA9IHJlc2V0O1xuICAgIHRoaXMuYWdhaW5CdG4ub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLCB0aGlzLCAoKSA9PiB7XG4gICAgICB0aGlzLmFnYWluKCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyAg5YaN5p2l5LiA5qyhXG4gIHB1YmxpYyBhZ2FpbigpOiB2b2lkIHtcbiAgICB0aGlzLnJlc2V0LnJ1bigpO1xuICAgIHRoaXMucmVtb3ZlU2VsZigpO1xuICB9XG59IiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXG5pbXBvcnQgVmlldz1MYXlhLlZpZXc7XG5pbXBvcnQgRGlhbG9nPUxheWEuRGlhbG9nO1xuaW1wb3J0IFNjZW5lPUxheWEuU2NlbmU7XG52YXIgUkVHOiBGdW5jdGlvbiA9IExheWEuQ2xhc3NVdGlscy5yZWdDbGFzcztcbmV4cG9ydCBtb2R1bGUgdWkge1xyXG4gICAgZXhwb3J0IGNsYXNzIEJhY2tHcm91bmRVSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBjYWJiYWdlOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzaGVlcDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgd29sZjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYm9hdFNwcml0ZTpMYXlhLkJveDtcblx0XHRwdWJsaWMgZ286TGF5YS5TcHJpdGU7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgIHVpVmlldzphbnkgPXtcInR5cGVcIjpcIlNjZW5lXCIsXCJwcm9wc1wiOntcIndpZHRoXCI6MTI4MCxcImhlaWdodFwiOjcyMH0sXCJjb21wSWRcIjoyLFwiY2hpbGRcIjpbe1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoyMTUsXCJ4XCI6MCxcIndpZHRoXCI6MjUxLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyYmFuay5wbmdcIixcImhlaWdodFwiOjUwMn0sXCJjb21wSWRcIjo1OH0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjo0ODAsXCJ4XCI6MTA4OSxcIndpZHRoXCI6NTM1LFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyYmFuay5wbmdcIixcInJvdGF0aW9uXCI6MjcwLFwicGl2b3RZXCI6MjE5LFwicGl2b3RYXCI6MjY4LFwiaGVpZ2h0XCI6NDA2fSxcImNvbXBJZFwiOjY1fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjE2NCxcInhcIjoxMCxcIndpZHRoXCI6NTgsXCJ2YXJcIjpcImNhYmJhZ2VcIixcInRleHR1cmVcIjpcImFjdG9ycy9jYWJiYWdlLnBuZ1wiLFwiaGVpZ2h0XCI6NTh9LFwiY29tcElkXCI6NzJ9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MTY0LFwieFwiOjg4LFwid2lkdGhcIjo1OCxcInZhclwiOlwic2hlZXBcIixcInRleHR1cmVcIjpcImFjdG9ycy9zaGVlcC5wbmdcIixcImhlaWdodFwiOjU4fSxcImNvbXBJZFwiOjcwfSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjE2NCxcInhcIjoxNjMsXCJ3aWR0aFwiOjU4LFwidmFyXCI6XCJ3b2xmXCIsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvd29sZi5wbmdcIixcImhlaWdodFwiOjU4fSxcImNvbXBJZFwiOjcxfSx7XCJ0eXBlXCI6XCJCb3hcIixcInByb3BzXCI6e1wieVwiOjI1MyxcInhcIjoyNTEsXCJ3aWR0aFwiOjYxNSxcImhlaWdodFwiOjQ2NH0sXCJjb21wSWRcIjo4MCxcImNoaWxkXCI6W3tcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MTMzLFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtMFwiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjN9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MTMzLFwieFwiOjEyMyxcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTFcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo1fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjEzMyxcInhcIjoyNDYsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0yXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6Nn0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoxMzMsXCJ4XCI6MzY5LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtM1wiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjd9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MTMzLFwieFwiOjQ5MixcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTRcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo4fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtMFwiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjQ3fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieFwiOjEyMyxcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTFcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo0OH0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInhcIjoyNDYsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0yXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NDl9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ4XCI6MzY5LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtM1wiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjUwfSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieFwiOjQ5MixcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTRcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo1MX0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoyNjYsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0wXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NjB9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MjY2LFwieFwiOjEyMyxcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTFcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo2MX0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoyNjYsXCJ4XCI6MjQ2LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtMlwiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjYyfSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjI2NixcInhcIjozNjksXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0zXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NjN9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MjY2LFwieFwiOjQ5MixcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTRcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo2NH0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjo0MDIsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0wXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NzV9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6NDAyLFwieFwiOjEyMyxcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTFcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo3Nn0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjo0MDIsXCJ4XCI6MjQ2LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtMlwiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjc3fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjQwMixcInhcIjozNjksXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0zXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6Nzh9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6NDAyLFwieFwiOjQ5MixcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTRcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo3OX1dfSx7XCJ0eXBlXCI6XCJCb3hcIixcInByb3BzXCI6e1wieVwiOjEyMCxcInhcIjoyODIsXCJ2YXJcIjpcImJvYXRTcHJpdGVcIn0sXCJjb21wSWRcIjo3MyxcImNoaWxkXCI6W3tcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ3aWR0aFwiOjI2MSxcInRleHR1cmVcIjpcImFjdG9ycy9ib2F0LnBuZ1wiLFwiaGVpZ2h0XCI6MTkwfSxcImNvbXBJZFwiOjY3fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjIxLFwieFwiOjExNSxcIndpZHRoXCI6ODcsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvZmFybWVyLnBuZ1wiLFwiaGVpZ2h0XCI6ODd9LFwiY29tcElkXCI6Njl9XX0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjo3OCxcInhcIjo1NTksXCJ3aWR0aFwiOjg0LFwidmFyXCI6XCJnb1wiLFwidGV4dHVyZVwiOlwiYWN0b3JzL2dvLnBuZ1wiLFwicGl2b3RZXCI6NDIsXCJwaXZvdFhcIjo0MixcImhlaWdodFwiOjg0fSxcImNvbXBJZFwiOjc0fV0sXCJsb2FkTGlzdFwiOltcImFjdG9ycy9yaXZlcmJhbmsucG5nXCIsXCJhY3RvcnMvY2FiYmFnZS5wbmdcIixcImFjdG9ycy9zaGVlcC5wbmdcIixcImFjdG9ycy93b2xmLnBuZ1wiLFwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwiYWN0b3JzL2JvYXQucG5nXCIsXCJhY3RvcnMvZmFybWVyLnBuZ1wiLFwiYWN0b3JzL2dvLnBuZ1wiXSxcImxvYWRMaXN0M0RcIjpbXX07XHJcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVZpZXcoQmFja0dyb3VuZFVJLnVpVmlldyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgUkVHKFwidWkuQmFja0dyb3VuZFVJXCIsQmFja0dyb3VuZFVJKTtcclxuICAgIGV4cG9ydCBjbGFzcyBnYW1lT3ZlclVJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIHJlc3RhcnRCdG46TGF5YS5CdXR0b247XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgIHVpVmlldzphbnkgPXtcInR5cGVcIjpcIlNjZW5lXCIsXCJwcm9wc1wiOntcIndpZHRoXCI6MTI4MCxcImhlaWdodFwiOjcyMH0sXCJjb21wSWRcIjoyLFwiY2hpbGRcIjpbe1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjowLFwieFwiOjAsXCJ3aWR0aFwiOjEyODQsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvZ2FtZW92ZXIuanBnXCIsXCJoZWlnaHRcIjo3MjB9LFwiY29tcElkXCI6NX0se1widHlwZVwiOlwiQnV0dG9uXCIsXCJwcm9wc1wiOntcInlcIjo1ODcsXCJ4XCI6NTEwLjUsXCJ3aWR0aFwiOjI2MyxcInZhclwiOlwicmVzdGFydEJ0blwiLFwic2tpblwiOlwiY29tcC9idXR0b24ucG5nXCIsXCJsYWJlbFNpemVcIjo2MCxcImxhYmVsQ29sb3JzXCI6XCIjZmZmZmZmXCIsXCJsYWJlbFwiOlwi6YeN5paw5byA5aeLXCIsXCJoZWlnaHRcIjo4Nn0sXCJjb21wSWRcIjo0fV0sXCJsb2FkTGlzdFwiOltcImFjdG9ycy9nYW1lb3Zlci5qcGdcIixcImNvbXAvYnV0dG9uLnBuZ1wiXSxcImxvYWRMaXN0M0RcIjpbXX07XHJcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVZpZXcoZ2FtZU92ZXJVSS51aVZpZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFJFRyhcInVpLmdhbWVPdmVyVUlcIixnYW1lT3ZlclVJKTtcclxuICAgIGV4cG9ydCBjbGFzcyBzdWNjZWVkVUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgYWdhaW5CdG46TGF5YS5CdXR0b247XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgIHVpVmlldzphbnkgPXtcInR5cGVcIjpcIlNjZW5lXCIsXCJwcm9wc1wiOntcIndpZHRoXCI6MTI4MCxcImhlaWdodFwiOjcyMH0sXCJjb21wSWRcIjoyLFwiY2hpbGRcIjpbe1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjowLFwieFwiOjAsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvc3VjY2VlZC5qcGdcIn0sXCJjb21wSWRcIjozfSx7XCJ0eXBlXCI6XCJCdXR0b25cIixcInByb3BzXCI6e1wieVwiOjYxNSxcInhcIjo1MTcsXCJ3aWR0aFwiOjI0NixcInZhclwiOlwiYWdhaW5CdG5cIixcInNraW5cIjpcImNvbXAvYnV0dG9uLnBuZ1wiLFwibGFiZWxTaXplXCI6NjAsXCJsYWJlbFwiOlwi5YaN5p2l5LiA5qyhXCIsXCJoZWlnaHRcIjo5Nn0sXCJjb21wSWRcIjo0fV0sXCJsb2FkTGlzdFwiOltcImFjdG9ycy9zdWNjZWVkLmpwZ1wiLFwiY29tcC9idXR0b24ucG5nXCJdLFwibG9hZExpc3QzRFwiOltdfTtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVmlldyhzdWNjZWVkVUkudWlWaWV3KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBSRUcoXCJ1aS5zdWNjZWVkVUlcIixzdWNjZWVkVUkpO1xyXG59XHIiXX0=
