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
},{"./ui/layaMaxUI":8}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StaticData_1 = require("./StaticData");
var Item = /** @class */ (function () {
    function Item(img, typeStr, boat, riverBanks) {
        this.img = img;
        this.bindClickEvent();
        this.typeStr = typeStr;
        this.boat = boat;
        this.riverBanks = riverBanks;
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
                    console.log('succeed');
                }
            }));
        }
    };
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
var Script = /** @class */ (function (_super) {
    __extends(Script, _super);
    function Script() {
        var _this = _super.call(this) || this;
        _this.boat = new Boat_1.default(_this.boatSprite);
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
        this.items.push(new Item_1.default(this.wolf, 'wolfPos', this.boat, this.riverBanks));
        this.items.push(new Item_1.default(this.sheep, 'sheepPos', this.boat, this.riverBanks));
        this.items.push(new Item_1.default(this.cabbage, 'cabbagePos', this.boat, this.riverBanks));
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
        //  显示运输信息
        this.showMessage();
        // 确定要判断那边岸的情况
        var bankIndex = this.boat.getSprite().x === StaticData_1.default.boat.left.x
            ? StaticData_1.default.index.LEFT_BANK
            : StaticData_1.default.index.RIGHT_BANK;
        var eatArr = this.riverBanks[bankIndex].EatOrNot();
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
        StaticData_1.default.message.fontSize = 50;
        this.addChild(StaticData_1.default.message);
    };
    //  显示运输信息
    Script.prototype.showMessage = function () {
        var passage = this.boat.getPassage();
        var passageName = StaticData_1.default[passage.getTypeStr()].name; //  获取乘客名称
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
    };
    return Script;
}(layaMaxUI_1.ui.BackGroundUI));
exports.default = Script;
},{"./Boat":1,"./GameOver":2,"./Item":3,"./RiverBank":5,"./StaticData":7,"./ui/layaMaxUI":8}],7:[function(require,module,exports){
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
        BackGroundUI.uiView = { "type": "Scene", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 215, "x": 0, "width": 251, "texture": "actors/riverbank.png", "height": 502 }, "compId": 58 }, { "type": "Sprite", "props": { "y": 480, "x": 1089, "width": 535, "texture": "actors/riverbank.png", "rotation": 270, "pivotY": 219, "pivotX": 268, "height": 406 }, "compId": 65 }, { "type": "Sprite", "props": { "y": 164, "x": 10, "width": 58, "var": "cabbage", "texture": "actors/cabbage.png", "height": 58 }, "compId": 72 }, { "type": "Sprite", "props": { "y": 164, "x": 88, "width": 58, "var": "sheep", "texture": "actors/sheep.png", "height": 58 }, "compId": 70 }, { "type": "Sprite", "props": { "y": 164, "x": 163, "width": 58, "var": "wolf", "texture": "actors/wolf.png", "height": 58 }, "compId": 71 }, { "type": "Box", "props": { "y": 253, "x": 251, "width": 615, "height": 464 }, "compId": 80, "child": [{ "type": "Sprite", "props": { "y": 133, "width": 123, "texture": "actors/river.png", "name": "item0", "height": 123 }, "compId": 3 }, { "type": "Sprite", "props": { "y": 133, "x": 123, "width": 123, "texture": "actors/river.png", "name": "item1", "height": 123 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 133, "x": 246, "width": 123, "texture": "actors/river.png", "name": "item2", "height": 123 }, "compId": 6 }, { "type": "Sprite", "props": { "y": 133, "x": 369, "width": 123, "texture": "actors/river.png", "name": "item3", "height": 123 }, "compId": 7 }, { "type": "Sprite", "props": { "y": 133, "x": 492, "width": 123, "texture": "actors/river.png", "name": "item4", "height": 123 }, "compId": 8 }, { "type": "Sprite", "props": { "width": 123, "texture": "actors/river.png", "name": "item0", "height": 123 }, "compId": 47 }, { "type": "Sprite", "props": { "x": 123, "width": 123, "texture": "actors/river.png", "name": "item1", "height": 123 }, "compId": 48 }, { "type": "Sprite", "props": { "x": 246, "width": 123, "texture": "actors/river.png", "name": "item2", "height": 123 }, "compId": 49 }, { "type": "Sprite", "props": { "x": 369, "width": 123, "texture": "actors/river.png", "name": "item3", "height": 123 }, "compId": 50 }, { "type": "Sprite", "props": { "x": 492, "width": 123, "texture": "actors/river.png", "name": "item4", "height": 123 }, "compId": 51 }, { "type": "Sprite", "props": { "y": 266, "width": 123, "texture": "actors/river.png", "name": "item0", "height": 123 }, "compId": 60 }, { "type": "Sprite", "props": { "y": 266, "x": 123, "width": 123, "texture": "actors/river.png", "name": "item1", "height": 123 }, "compId": 61 }, { "type": "Sprite", "props": { "y": 266, "x": 246, "width": 123, "texture": "actors/river.png", "name": "item2", "height": 123 }, "compId": 62 }, { "type": "Sprite", "props": { "y": 266, "x": 369, "width": 123, "texture": "actors/river.png", "name": "item3", "height": 123 }, "compId": 63 }, { "type": "Sprite", "props": { "y": 266, "x": 492, "width": 123, "texture": "actors/river.png", "name": "item4", "height": 123 }, "compId": 64 }, { "type": "Sprite", "props": { "y": 402, "width": 123, "texture": "actors/river.png", "name": "item0", "height": 123 }, "compId": 75 }, { "type": "Sprite", "props": { "y": 402, "x": 123, "width": 123, "texture": "actors/river.png", "name": "item1", "height": 123 }, "compId": 76 }, { "type": "Sprite", "props": { "y": 402, "x": 246, "width": 123, "texture": "actors/river.png", "name": "item2", "height": 123 }, "compId": 77 }, { "type": "Sprite", "props": { "y": 402, "x": 369, "width": 123, "texture": "actors/river.png", "name": "item3", "height": 123 }, "compId": 78 }, { "type": "Sprite", "props": { "y": 402, "x": 492, "width": 123, "texture": "actors/river.png", "name": "item4", "height": 123 }, "compId": 79 }] }, { "type": "Box", "props": { "y": 120, "x": 282, "var": "boatSprite" }, "compId": 73, "child": [{ "type": "Sprite", "props": { "width": 261, "texture": "actors/boat.png", "height": 190 }, "compId": 67 }, { "type": "Sprite", "props": { "y": 21, "x": 115, "width": 87, "texture": "actors/farmer.png", "height": 87 }, "compId": 69 }] }, { "type": "Sprite", "props": { "y": 36, "x": 516.5, "width": 84, "var": "go", "texture": "actors/go.png", "height": 84 }, "compId": 74 }], "loadList": ["actors/riverbank.png", "actors/cabbage.png", "actors/sheep.png", "actors/wolf.png", "actors/river.png", "actors/boat.png", "actors/farmer.png", "actors/go.png"], "loadList3D": [] };
        return BackGroundUI;
    }(Laya.Scene));
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
    }(Laya.Scene));
    ui.gameOverUI = gameOverUI;
    REG("ui.gameOverUI", gameOverUI);
})(ui = exports.ui || (exports.ui = {}));
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2g15ri45oiPL0xheWFBaXJJREVfYmV0YS9yZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQm9hdC50cyIsInNyYy9HYW1lT3Zlci50cyIsInNyYy9JdGVtLnRzIiwic3JjL01haW4udHMiLCJzcmMvUml2ZXJCYW5rLnRzIiwic3JjL1NjcmlwdC50cyIsInNyYy9TdGF0aWNEYXRhLnRzIiwic3JjL3VpL2xheWFNYXhVSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNUQSwyQ0FBc0M7QUFFdEM7SUFLRSxjQUFZLEdBQWdCO1FBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxVQUFVO0lBQ0gscUJBQU0sR0FBYixVQUFjLEVBQU07WUFBTCxRQUFDLEVBQUUsUUFBQztRQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVELFFBQVE7SUFDRCx5QkFBVSxHQUFqQixVQUFrQixPQUFhO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBRXpCLENBQUM7SUFFRCxRQUFRO0lBQ0QsNEJBQWEsR0FBcEI7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQsV0FBVztJQUNKLG9CQUFLLEdBQVo7UUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxjQUFjO0lBQ1Asd0JBQVMsR0FBaEI7UUFDRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDbEIsQ0FBQztJ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QUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLHNCQUFzQixFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxzQkFBc0IsRUFBQyxVQUFVLEVBQUMsR0FBRyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLFNBQVMsRUFBQyxvQkFBb0IsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsWUFBWSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsU0FBUyxFQUFDLG1CQUFtQixFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxlQUFlLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLFVBQVUsRUFBQyxDQUFDLHNCQUFzQixFQUFDLG9CQUFvQixFQUFDLGtCQUFrQixFQUFDLGlCQUFpQixFQUFDLGtCQUFrQixFQUFDLGlCQUFpQixFQUFDLG1CQUFtQixFQUFDLGVBQWUsQ0FBQyxFQUFDLFlBQVksRUFBQyxFQUFFLEVBQUMsQ0FBQztRQU16dkgsbUJBQUM7S0FaRCxBQVlDLENBWmlDLElBQUksQ0FBQyxLQUFLLEdBWTNDO0lBWlksZUFBWSxlQVl4QixDQUFBO0lBQ0QsR0FBRyxDQUFDLGlCQUFpQixFQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BDO1FBQWdDLDhCQUFVO1FBR3RDO21CQUFlLGlCQUFPO1FBQUEsQ0FBQztRQUN2QixtQ0FBYyxHQUFkO1lBQ0ksaUJBQU0sY0FBYyxXQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUxjLGlCQUFNLEdBQU0sRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxxQkFBcUIsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsWUFBWSxFQUFDLE1BQU0sRUFBQyxpQkFBaUIsRUFBQyxXQUFXLEVBQUMsRUFBRSxFQUFDLGFBQWEsRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsVUFBVSxFQUFDLENBQUMscUJBQXFCLEVBQUMsaUJBQWlCLENBQUMsRUFBQyxZQUFZLEVBQUMsRUFBRSxFQUFDLENBQUM7UUFNOWMsaUJBQUM7S0FSRCxBQVFDLENBUitCLElBQUksQ0FBQyxLQUFLLEdBUXpDO0lBUlksYUFBVSxhQVF0QixDQUFBO0lBQ0QsR0FBRyxDQUFDLGVBQWUsRUFBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxDQUFDLEVBekJhLEVBQUUsR0FBRixVQUFFLEtBQUYsVUFBRSxRQXlCZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nO1xyXG5pbXBvcnQgU3RhdGljRGF0YSBmcm9tICcuL1N0YXRpY0RhdGEnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9hdCB7XHJcbiAgcHJpdmF0ZSBwYXNzYWdlOiBJdGVtO1xyXG5cclxuICBwcml2YXRlIGltZzogTGF5YS5TcHJpdGU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGltZzogTGF5YS5TcHJpdGUpIHtcclxuICAgIHRoaXMuaW1nID0gaW1nO1xyXG4gIH1cclxuXHJcbiAgLy8gIOiuvue9ruiIueeahOWdkOagh1xyXG4gIHB1YmxpYyBzZXRQb3Moe3gsIHl9KTogdm9pZCB7XHJcbiAgICB0aGlzLmltZy54ID0geDtcclxuICAgIHRoaXMuaW1nLnkgPSB5O1xyXG4gIH1cclxuXHJcbiAgLy8gIOa3u+WKoOS5mOWuolxyXG4gIHB1YmxpYyBhZGRQYXNzYWdlKHBhc3NhZ2U6IEl0ZW0pOiB2b2lkIHtcclxuICAgIHRoaXMucGFzc2FnZSA9IHBhc3NhZ2U7XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gIOenu+mZpOS5mOWuolxyXG4gIHB1YmxpYyByZW1vdmVQYXNzYWdlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5wYXNzYWdlID0gbnVsbDtcclxuICB9XHJcblxyXG4gIC8vICDliKTmlq3oiLnmmK/lkKbkuLrnqbpcclxuICBwdWJsaWMgZW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5wYXNzYWdlID8gZmFsc2UgOiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLy8gIOiOt+WPlnNwcml0ZeWvueixoVxyXG4gIHB1YmxpYyBnZXRTcHJpdGUoKTogTGF5YS5TcHJpdGUge1xyXG4gICAgcmV0dXJuIHRoaXMuaW1nO1xyXG4gIH1cclxuXHJcbiAgLy8gIOiOt+WPluS5mOWuolxyXG4gIHB1YmxpYyBnZXRQYXNzYWdlKCk6IEl0ZW0ge1xyXG4gICAgcmV0dXJuIHRoaXMucGFzc2FnZTtcclxuICB9XHJcblxyXG4gIC8vICDnp7vliqjvvIzmiJDlip/np7vliqjlhajnqIvvvIzlpLHotKXnp7vliqjljYrnqItcclxuICBwdWJsaWMgbW92ZUJvYXQoc3VjY2VlZDogYm9vbGVhbiA9IHRydWUpOiBhbnkge1xyXG4gICAgbGV0IGJvYXRQb3M6IHt9O1xyXG4gICAgbGV0IHBhc3NhZ2VQb3M6IHt9O1xyXG5cclxuICAgIGxldCBkZWxGbGFnID0gMTtcclxuXHJcbiAgICAvLyAg56Gu5a6a56e75Yqo55qE5pa55ZCRXHJcbiAgICBpZiAodGhpcy5pbWcueCA9PT0gU3RhdGljRGF0YS5ib2F0LmxlZnQueCkge1xyXG4gICAgICBib2F0UG9zID0gT2JqZWN0LmNyZWF0ZShTdGF0aWNEYXRhLmJvYXQucmlnaHQpO1xyXG4gICAgICBwYXNzYWdlUG9zID0gT2JqZWN0LmNyZWF0ZShTdGF0aWNEYXRhLnJpZ2h0Uml2ZXJCYW5rUG9zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCflkJHlt6botbAnKTtcclxuICAgICAgYm9hdFBvcyA9IE9iamVjdC5jcmVhdGUoU3RhdGljRGF0YS5ib2F0LmxlZnQpO1xyXG4gICAgICBwYXNzYWdlUG9zID0gT2JqZWN0LmNyZWF0ZShTdGF0aWNEYXRhLmxlZnRSaXZlckJhbmtQb3MpO1xyXG4gICAgICBkZWxGbGFnID0gLTE7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICAvLyAg56Gu5a6a56e75Yqo55qE6Led56a7XHJcbiAgICBpZiAoIXN1Y2NlZWQpIHtcclxuICAgICAgYm9hdFBvc1sneCddIC09IDE1MCAqIGRlbEZsYWc7XHJcbiAgICAgIHBhc3NhZ2VQb3NbJ3gnXSAtPSAxNTAgKiBkZWxGbGFnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJvYXRQb3MsXHJcbiAgICAgIHBhc3NhZ2VQb3MsXHJcbiAgICB9O1xyXG5cclxuICAgIC8vICDoiLnnp7vliqhcclxuICAgIExheWEuVHdlZW4udG8oXHJcbiAgICAgIHRoaXMuaW1nLFxyXG4gICAgICBib2F0UG9zLFxyXG4gICAgICAyMDAwLFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyAgaXRlbeenu+WKqFxyXG4gICAgTGF5YS5Ud2Vlbi50byhcclxuICAgICAgdGhpcy5wYXNzYWdlLmdldFNwcml0ZSgpLFxyXG4gICAgICBwYXNzYWdlUG9zLFxyXG4gICAgICAyMDAwLFxyXG4gICAgICBudWxsLFxyXG4gICAgKTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyB1aSB9IGZyb20gJy4vdWkvbGF5YU1heFVJJztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZU92ZXIgZXh0ZW5kcyB1aS5nYW1lT3ZlclVJIHtcclxuICBwcml2YXRlIHJlc2V0OiBMYXlhLkhhbmRsZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHJlc2V0SGFuZGxlcjogTGF5YS5IYW5kbGVyKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5yZXNldCA9IHJlc2V0SGFuZGxlcjtcclxuICAgIHRoaXMucmVzdGFydEJ0bi5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sIHRoaXMsIHRoaXMucmVzdGFydEdhbWUpO1xyXG4gIH1cclxuXHJcbiAgcmVzdGFydEdhbWUoKTogdm9pZCB7XHJcbiAgICB0aGlzLnJlc2V0LnJ1bigpO1xyXG4gICAgdGhpcy5yZW1vdmVTZWxmKCk7XHJcbiAgfVxyXG5cclxufSIsImltcG9ydCBTcHJpdGUgPSBMYXlhLlNwcml0ZTtcclxuaW1wb3J0IFN0YXRpY0RhdGEgZnJvbSAnLi9TdGF0aWNEYXRhJztcclxuaW1wb3J0IEJvYXQgZnJvbSAnLi9Cb2F0JztcclxuaW1wb3J0IFJpdmVyQmFuayBmcm9tICcuL1JpdmVyQmFuayc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJdGVtIHtcclxuICBwcml2YXRlIGltZzogU3ByaXRlO1xyXG5cclxuICBwcml2YXRlIHR5cGVTdHI6IHN0cmluZzsgIC8vICDnlKjkuo7ljLrliKvmmK/osIHooqvngrnlh7vkuobvvIzosIHor6Xot7PvvIjlnZDmoIfkuI3lkIzvvIlcclxuXHJcbiAgcHJpdmF0ZSBib2F0OiBCb2F0O1xyXG5cclxuICBwcml2YXRlIHJpdmVyQmFua3M6IEFycmF5PFJpdmVyQmFuaz47XHJcblxyXG4gIGNvbnN0cnVjdG9yKGltZzogU3ByaXRlLCB0eXBlU3RyOiBzdHJpbmcsIGJvYXQ6IEJvYXQsIHJpdmVyQmFua3M6IEFycmF5PFJpdmVyQmFuaz4pIHtcclxuICAgIHRoaXMuaW1nID0gaW1nO1xyXG4gICAgdGhpcy5iaW5kQ2xpY2tFdmVudCgpO1xyXG4gICAgdGhpcy50eXBlU3RyID0gdHlwZVN0cjtcclxuICAgIHRoaXMuYm9hdCA9IGJvYXQ7XHJcbiAgICB0aGlzLnJpdmVyQmFua3MgPSByaXZlckJhbmtzO1xyXG4gIH1cclxuXHJcbiAgLy8gIOe7keWumueCueWHu+S6i+S7tlxyXG4gIGJpbmRDbGlja0V2ZW50KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbWcub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLCB0aGlzLCB0aGlzLmp1bXApO1xyXG4gIH1cclxuXHJcbiAgLy8gIOiuvue9ruWbvueJh+WdkOagh1xyXG4gIHB1YmxpYyBzZXRQb3Moe3gsIHl9KTogdm9pZCB7XHJcbiAgICB0aGlzLmltZy54ID0geDtcclxuICAgIHRoaXMuaW1nLnkgPSB5O1xyXG4gIH1cclxuXHJcbiAgLy8gIOiuvue9rnJpdmVyYmFua3PvvIzmlrnkvr/ph43nva5cclxuICBwdWJsaWMgc2V0Uml2ZXJCYW5rcyhyaXZlckJhbmtzOiBBcnJheTxSaXZlckJhbms+KTp2b2lkIHtcclxuICAgIHRoaXMucml2ZXJCYW5rcyA9IHJpdmVyQmFua3M7XHJcbiAgfVxyXG5cclxuICAvLyAg5LuO5b6A6Ii55LiK6LezXHJcbiAganVtcCgpOiB2b2lkIHtcclxuICAgIGxldCBwb3NYOiBudW1iZXI7XHJcbiAgICBsZXQgcG9zWTogbnVtYmVyO1xyXG5cclxuICAgIGxldCByb2xsRmxhZzogbnVtYmVyID0gMTsgIC8vICDmjqfliLbml4vovaxcclxuXHJcbiAgICBsZXQgY2FuSnVtcDogYm9vbGVhbiA9IHRydWU7ICAvLyAg5o6n5Yi25piv5ZCm6IO96LezXHJcblxyXG4gICAgLy8gIOaYvuekuuS/oeaBr1xyXG4gICAgdGhpcy5zaG93TWVzc2FnZSgpO1xyXG5cclxuICAgIC8vICDlhYjliKTmlq3lvoDlk6rph4zot7NcclxuICAgIGlmICh0aGlzLmltZy54IDwgU3RhdGljRGF0YS5sZWZ0Uml2ZXJCYW5rUG9zLngpIHsgIC8vICDmraTml7bmmK/ku47lt6blsrjlkJHoiLnkuIrot7NcclxuICAgICAgcG9zWCA9IFN0YXRpY0RhdGEubGVmdFJpdmVyQmFua1Bvcy54O1xyXG4gICAgICBwb3NZID0gU3RhdGljRGF0YS5sZWZ0Uml2ZXJCYW5rUG9zLnk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuYm9hdC5lbXB0eSgpKSB7XHJcbiAgICAgICAgY2FuSnVtcCA9IGZhbHNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuYm9hdC5hZGRQYXNzYWdlKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucml2ZXJCYW5rc1tTdGF0aWNEYXRhLmluZGV4LkxFRlRfQkFOS10uZ2V0T3V0KFN0YXRpY0RhdGFbdGhpcy50eXBlU3RyXS5pbmRleCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ+i3s+i3g+S5i+WQjueahHJpdmVyYmFuaycsIHRoaXMucml2ZXJCYW5rcyk7XHJcbiAgICAgICAgXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5pbWcueCA9PT0gU3RhdGljRGF0YS5sZWZ0Uml2ZXJCYW5rUG9zLngpIHsgIC8vICDmraTml7bmmK/ku47oiLnkuIrlkJHlt6blsrjot7NcclxuICAgICAgcG9zWCA9IFN0YXRpY0RhdGFbdGhpcy50eXBlU3RyXS5sZWZ0Lng7XHJcbiAgICAgIHBvc1kgPSBTdGF0aWNEYXRhW3RoaXMudHlwZVN0cl0ubGVmdC55O1xyXG4gICAgICByb2xsRmxhZyA9IDA7XHJcbiAgICAgIHRoaXMuYm9hdC5yZW1vdmVQYXNzYWdlKCk7XHJcbiAgICAgIHRoaXMucml2ZXJCYW5rc1tTdGF0aWNEYXRhLmluZGV4LkxFRlRfQkFOS10uZ2V0SW4oU3RhdGljRGF0YVt0aGlzLnR5cGVTdHJdLmluZGV4KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pbWcueCA9PT0gU3RhdGljRGF0YS5yaWdodFJpdmVyQmFua1Bvcy54KSB7ICAvLyAg5q2k5pe25piv5LuO6Ii55LiK5ZCR5Y+z5bK46LezXHJcbiAgICAgIHBvc1ggPSBTdGF0aWNEYXRhW3RoaXMudHlwZVN0cl0ucmlnaHQueDtcclxuICAgICAgcG9zWSA9IFN0YXRpY0RhdGFbdGhpcy50eXBlU3RyXS5yaWdodC55O1xyXG4gICAgICByb2xsRmxhZyA9IC0xO1xyXG4gICAgICB0aGlzLmJvYXQucmVtb3ZlUGFzc2FnZSgpO1xyXG4gICAgICB0aGlzLnJpdmVyQmFua3NbU3RhdGljRGF0YS5pbmRleC5SSUdIVF9CQU5LXS5nZXRJbihTdGF0aWNEYXRhW3RoaXMudHlwZVN0cl0uaW5kZXgpO1xyXG4gICAgfSBlbHNlIHsgIC8vICDmraTml7bmmK/ku47lj7PlsrjlvoDoiLnkuIrot7NcclxuICAgICAgcG9zWCA9IFN0YXRpY0RhdGEucmlnaHRSaXZlckJhbmtQb3MueDtcclxuICAgICAgcG9zWSA9IFN0YXRpY0RhdGEucmlnaHRSaXZlckJhbmtQb3MueTtcclxuICAgICAgaWYgKCF0aGlzLmJvYXQuZW1wdHkoKSkge1xyXG4gICAgICAgIGNhbkp1bXAgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmJvYXQuYWRkUGFzc2FnZSh0aGlzKTtcclxuICAgICAgICB0aGlzLnJpdmVyQmFua3NbU3RhdGljRGF0YS5pbmRleC5SSUdIVF9CQU5LXS5nZXRPdXQoU3RhdGljRGF0YVt0aGlzLnR5cGVTdHJdLmluZGV4KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICDlvIDlp4vot7NcclxuICAgIGlmIChjYW5KdW1wKSB7XHJcbiAgICAgIExheWEuVHdlZW4udG8oXHJcbiAgICAgICAgdGhpcy5pbWcsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgeDogcG9zWCxcclxuICAgICAgICAgIHk6IHBvc1ksXHJcbiAgICAgICAgICByb3RhdGlvbjogMzYwICogcm9sbEZsYWcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAxMDAwLFxyXG4gICAgICAgIExheWEuRWFzZS5iYWNrSW5PdXQsXHJcbiAgICAgICAgLy8gIOWIpOaWreaYr+WQpuaIkOWKn1xyXG4gICAgICAgIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMucml2ZXJCYW5rc1sxXS5zdWNjZWVkKCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2NlZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvLyAg5ri45oiP5Yik5a6a5aSx6LSl5ZCO55qE5ZCD55qE5Yqo5L2cXHJcbiAgZWF0KGZvb2QgOiBJdGVtKTogdm9pZCB7XHJcbiAgICAvLyAg5ZCD5Lic6KW/55qEaXRlbeenu+WKqOWIsOiiq+WQg+eahGl0ZW3kuIpcclxuICAgIExheWEuVHdlZW4udG8oXHJcbiAgICAgIHRoaXMuaW1nLFxyXG4gICAgICB7XHJcbiAgICAgICAgeDogZm9vZC5nZXRTcHJpdGUoKS54LFxyXG4gICAgICAgIHk6IGZvb2QuZ2V0U3ByaXRlKCkueSxcclxuICAgICAgfSxcclxuICAgICAgMTAwMCxcclxuICAgICAgbnVsbCxcclxuICAgICAgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XHJcbiAgICAgICAgZm9vZC5nZXRTcHJpdGUoKS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgIH0pLFxyXG4gICAgKTtcclxuXHJcbiAgfVxyXG5cclxuICAvLyAg6I635Y+W57G75Z6L56CBXHJcbiAgcHVibGljIGdldFR5cGVTdHIoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnR5cGVTdHI7XHJcbiAgfVxyXG5cclxuICAvLyAg6I635Y+W5Zu+54mH5a+56LGh77yI57K+54G177yJXHJcbiAgcHVibGljIGdldFNwcml0ZSgpOiBMYXlhLlNwcml0ZSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbWc7XHJcbiAgfVxyXG5cclxuICBzaG93TWVzc2FnZSgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHBvcyA9IHRoaXMuYm9hdC5nZXRTcHJpdGUoKS54ID09PSBTdGF0aWNEYXRhLmJvYXQubGVmdC54ID8gJ+W3puWyuCcgOiAn5Y+z5bK4JztcclxuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuYm9hdC5lbXB0eSgpID8gJ+S4iuiIuScgOiAn5LiL6Ii5JztcclxuICAgIGNvbnN0IG1lc3NhZ2UgPSBTdGF0aWNEYXRhW3RoaXMudHlwZVN0cl0ubmFtZSArICfku44nICsgcG9zICsgYWN0aW9uO1xyXG4gICAgU3RhdGljRGF0YS5tZXNzYWdlLnRleHQgKz0gbWVzc2FnZSArICdcXG4nO1xyXG4gIH1cclxuXHJcbn0iLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCBTY3JpcHQgZnJvbSBcIi4vU2NyaXB0XCI7XHJcblxyXG5jbGFzcyBNYWluIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuaW5pdFVJKCk7XHJcblx0fVxyXG5cdFxyXG5cdC8vICDliJ3lp4vljJbmuLjmiI/nlYzpnaJcclxuXHRpbml0VUkoKTogdm9pZCB7XHJcblx0XHRMYXlhLmluaXQoMTI4MCwgNzIwKTtcclxuXHRcdExheWEuc3RhZ2UuYmdDb2xvciA9ICcjZmZmZmZmJztcclxuXHRcdGNvbnN0IHJlc0FycmF5ID0gW1xyXG5cdFx0XHR7dXJsOiAncmVzL2F0bGFzL2FjdG9ycy5hdGxhcycsIHR5cGU6IExheWEuTG9hZGVyLkFUTEFTfSxcclxuXHRcdFx0e3VybDogJ2FjdG9ycy9nYW1lb3Zlci5qcGcnfSxcclxuXHRcdF07XHJcblxyXG5cdFx0Ly8gIOWKoOi9veWbvuWDj1xyXG5cdFx0TGF5YS5sb2FkZXIubG9hZChyZXNBcnJheSwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XHJcblx0XHRcdGNvbnN0IHNjZW5lOiBTY3JpcHQgPSBuZXcgU2NyaXB0KCk7XHJcblx0XHRcdExheWEuc3RhZ2UuYWRkQ2hpbGQoc2NlbmUpO1xyXG5cdFx0fSkpO1xyXG5cdH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCJpbXBvcnQgU3RhdGljRGF0YSBmcm9tIFwiLi9TdGF0aWNEYXRhXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSaXZlckJhbmsge1xyXG4gIHByaXZhdGUgaXRlbXMgOiBBcnJheTxudW1iZXI+OyAgLy8gIDHooajnpLrlnKjov5nkuIDovrnnmoTlsrjkuIrvvIww6KGo56S65LiN5ZyoXHJcblxyXG4gIGNvbnN0cnVjdG9yKG9yaWdpblN0YXRlIDogQXJyYXk8bnVtYmVyPikge1xyXG4gICAgdGhpcy5pdGVtcyA9IG9yaWdpblN0YXRlOyAgLy8gIOiuvue9ruWIneWni+eKtuaAgVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlc2V0QmFua0FycihsZWZ0OiBib29sZWFuKTp2b2lkIHtcclxuICAgIHRoaXMuaXRlbXMgPSBsZWZ0ID8gWzEsIDEsIDFdIDogWzAsIDAsIDBdO1xyXG4gIH1cclxuICAvLyAg5pyJaXRlbeS4iuWyuFxyXG4gIHB1YmxpYyBnZXRJbihpbmRleCA6IG51bWJlcikgOiB2b2lkIHtcclxuICAgIHRoaXMuaXRlbXNbaW5kZXhdID0gMTtcclxuICB9XHJcblxyXG4gIC8vICDmnIlpdGVt5Ye65bK4XHJcbiAgcHVibGljIGdldE91dChpbmRleCA6IG51bWJlcikgOiB2b2lkIHtcclxuICAgIHRoaXMuaXRlbXNbaW5kZXhdID0gMDtcclxuICB9XHJcblxyXG4gIC8vICDliKTmlq3mmK/lkKbmnInlkIPnmoTkuovku7blj5HnlJ/vvIzov5Tlm57lkIPlkozooqvlkIPnmoTlr7nosaFcclxuICBwdWJsaWMgRWF0T3JOb3QoKSA6IEFycmF5PG51bWJlcj4ge1xyXG4gICAgaWYgKGV2YWwodGhpcy5pdGVtcy5qb2luKFwiK1wiKSkgIT09IDIpIHJldHVybiBudWxsO1xyXG4gICAgaWYgKHRoaXMuaXRlbXNbU3RhdGljRGF0YS53b2xmUG9zLmluZGV4XSArIHRoaXMuaXRlbXNbU3RhdGljRGF0YS5zaGVlcFBvcy5pbmRleF0gPT09IDIpIHJldHVybiBbU3RhdGljRGF0YS53b2xmUG9zLmluZGV4LCBTdGF0aWNEYXRhLnNoZWVwUG9zLmluZGV4XTtcclxuICAgIGlmICh0aGlzLml0ZW1zW1N0YXRpY0RhdGEuc2hlZXBQb3MuaW5kZXhdICsgdGhpcy5pdGVtc1tTdGF0aWNEYXRhLmNhYmJhZ2VQb3MuaW5kZXhdID09PSAyKSByZXR1cm4gW1N0YXRpY0RhdGEuc2hlZXBQb3MuaW5kZXgsIFN0YXRpY0RhdGEuY2FiYmFnZVBvcy5pbmRleF07XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIC8vICDliKTmlq3ml7blgJnmuLjmiI/og5zliKlcclxuICBwdWJsaWMgc3VjY2VlZCgpOiBib29sZWFuIHtcclxuICAgIGlmIChldmFsKHRoaXMuaXRlbXMuam9pbihcIitcIikpID09PSAzKSByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyB1aSB9IGZyb20gJy4vdWkvbGF5YU1heFVJJztcclxuaW1wb3J0IEl0ZW0gZnJvbSAnLi9JdGVtJztcclxuaW1wb3J0IEJvYXQgZnJvbSAnLi9Cb2F0JztcclxuaW1wb3J0IFN0YXRpY0RhdGEgZnJvbSAnLi9TdGF0aWNEYXRhJztcclxuaW1wb3J0IFJpdmVyQmFuayBmcm9tICcuL1JpdmVyQmFuayc7XHJcbmltcG9ydCBHYW1lT3ZlciBmcm9tICcuL0dhbWVPdmVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmlwdCBleHRlbmRzIHVpLkJhY2tHcm91bmRVSSB7XHJcbiAgcHJpdmF0ZSBpdGVtczogQXJyYXk8SXRlbT47XHJcbiAgcHJpdmF0ZSBib2F0OiBCb2F0ID0gbmV3IEJvYXQodGhpcy5ib2F0U3ByaXRlKTtcclxuICBwcml2YXRlIHJpdmVyQmFua3M6IEFycmF5PFJpdmVyQmFuaz47XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuaW5pdEFjdG9ycygpO1xyXG4gICAgdGhpcy5iaW5kR29FdmVudCgpO1xyXG4gICAgdGhpcy5pbml0TWVzc2FnZSgpO1xyXG4gICAgLy8gdGhpcy5nYW1lT3ZlcigpO1xyXG4gIH1cclxuXHJcbiAgLy8gIOWIneWni+WMlueLvOOAgee+iuWSjOWNt+W/g+iPnOWunuS+i1xyXG4gIGluaXRBY3RvcnMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnJpdmVyQmFua3MgPSBbXHJcbiAgICAgIG5ldyBSaXZlckJhbmsoWzEsIDEsIDFdKSxcclxuICAgICAgbmV3IFJpdmVyQmFuayhbMCwgMCwgMF0pLFxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLml0ZW1zID0gbmV3IEFycmF5PEl0ZW0+KCk7XHJcbiAgICB0aGlzLml0ZW1zLnB1c2gobmV3IEl0ZW0odGhpcy53b2xmLCAnd29sZlBvcycsIHRoaXMuYm9hdCwgdGhpcy5yaXZlckJhbmtzKSk7XHJcbiAgICB0aGlzLml0ZW1zLnB1c2gobmV3IEl0ZW0odGhpcy5zaGVlcCwgJ3NoZWVwUG9zJywgdGhpcy5ib2F0LCB0aGlzLnJpdmVyQmFua3MpKTtcclxuICAgIHRoaXMuaXRlbXMucHVzaChuZXcgSXRlbSh0aGlzLmNhYmJhZ2UsICdjYWJiYWdlUG9zJywgdGhpcy5ib2F0LCB0aGlzLnJpdmVyQmFua3MpKTtcclxuICB9XHJcblxyXG4gIC8vICDnu5HlrppHT+eCueWHu+S6i+S7tlxyXG4gIGJpbmRHb0V2ZW50KCk6IHZvaWQge1xyXG4gICAgdGhpcy5nby5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sIHRoaXMsIHRoaXMuZ29nb2dvKTtcclxuICB9XHJcblxyXG4gIC8vICDlh7rlj5HvvIFcclxuICBnb2dvZ28oKTogdm9pZCB7XHJcbiAgICAvLyAg6ZqQ6JeP6byg5qCHXHJcbiAgICBMYXlhLk1vdXNlLmhpZGUoKTtcclxuICAgIC8vICDmmL7npLrov5DovpPkv6Hmga9cclxuICAgIHRoaXMuc2hvd01lc3NhZ2UoKTtcclxuICAgIC8vIOehruWumuimgeWIpOaWremCo+i+ueWyuOeahOaDheWGtVxyXG4gICAgY29uc3QgYmFua0luZGV4OiBudW1iZXIgPSB0aGlzLmJvYXQuZ2V0U3ByaXRlKCkueCA9PT0gU3RhdGljRGF0YS5ib2F0LmxlZnQueFxyXG4gICAgICA/IFN0YXRpY0RhdGEuaW5kZXguTEVGVF9CQU5LXHJcbiAgICAgIDogU3RhdGljRGF0YS5pbmRleC5SSUdIVF9CQU5LXHJcblxyXG4gICAgXHJcbiAgICBjb25zdCBlYXRBcnIgPSB0aGlzLnJpdmVyQmFua3NbYmFua0luZGV4XS5FYXRPck5vdCgpO1xyXG4gICAgXHJcbiAgICBpZiAoZWF0QXJyKSB7ICAvLyAg5aaC5p6c5Y+R55Sf5LqG5ZCD5LqL5Lu2XHJcbiAgICAgIGNvbnN0IGVhdG9yID0gdGhpcy5pdGVtc1tlYXRBcnJbMF1dO1xyXG4gICAgICBjb25zdCBmb29kID0gdGhpcy5pdGVtc1tlYXRBcnJbMV1dXHJcbiAgICAgIFxyXG4gICAgICAvLyAg5YWI56e75Yqo5YaN5ZCD5Lic6KW/XHJcbiAgICAgIHRoaXMubW92ZUJvYXQodGhpcy5ib2F0Lm1vdmVCb2F0KGZhbHNlKSwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lYXQoZWF0b3IsIGZvb2QsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5nYW1lT3ZlcikpO1xyXG4gICAgICB9KSk7XHJcbiAgICB9IGVsc2UgeyAgLy8gIOWQpuWImVxyXG4gICAgICB0aGlzLm1vdmVCb2F0KHRoaXMuYm9hdC5tb3ZlQm9hdCgpLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcclxuICAgICAgICBMYXlhLk1vdXNlLnNob3coKTtcclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gIOWIneWni+WMluS/oeaBr+agvOW8j1xyXG4gIGluaXRNZXNzYWdlKCk6IHZvaWQge1xyXG4gICAgU3RhdGljRGF0YS5tZXNzYWdlLmZvbnRTaXplID0gNTA7XHJcbiAgICB0aGlzLmFkZENoaWxkKFN0YXRpY0RhdGEubWVzc2FnZSk7XHJcbiAgfVxyXG5cclxuICAvLyAg5pi+56S66L+Q6L6T5L+h5oGvXHJcbiAgc2hvd01lc3NhZ2UoKTogdm9pZCB7XHJcbiAgICBjb25zdCBwYXNzYWdlID0gdGhpcy5ib2F0LmdldFBhc3NhZ2UoKTtcclxuICAgIGxldCBwYXNzYWdlTmFtZSA9IFN0YXRpY0RhdGFbcGFzc2FnZS5nZXRUeXBlU3RyKCldLm5hbWU7ICAvLyAg6I635Y+W5LmY5a6i5ZCN56ewXHJcbiAgICAvLyAg6I635Y+W6LW354K55ZKM57uI54K55L+h5oGvXHJcbiAgICBsZXQgc3RhcnRQb2ludCA9ICflj7PlsrgnO1xyXG4gICAgbGV0IGVuZFBvaW50ID0gJ+W3puWyuCc7XHJcbiAgICBpZiAodGhpcy5ib2F0LmdldFNwcml0ZSgpLnggPT09IFN0YXRpY0RhdGEuYm9hdC5sZWZ0LngpIHtcclxuICAgICAgc3RhcnRQb2ludCA9ICflt6blsrgnO1xyXG4gICAgICBlbmRQb2ludCA9ICflj7PlsrgnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICDmiZPljbDkv6Hmga9cclxuICAgIGNvbnN0IG1lc3NhZ2UgPSAn5oqKJyArIHBhc3NhZ2VOYW1lICsgJ+S7jicgKyBzdGFydFBvaW50ICsgJ+i/kOi+k+WIsCcgKyBlbmRQb2ludDtcclxuICAgIC8vIFRleHQudGV4dCA9ICdhYWFhYSc7XHJcbiAgICBTdGF0aWNEYXRhLm1lc3NhZ2UudGV4dCArPSBtZXNzYWdlICsgJ1xcbic7XHJcbiAgICAvLyB0aGlzLmFkZENoaWxkKFN0YXRpY0RhdGEubWVzc2FnZSk7XHJcbiAgfVxyXG5cclxuICAvLyAg6Ii556e75YqoXHJcbiAgbW92ZUJvYXQoeyBib2F0UG9zLCBwYXNzYWdlUG9zIH0sIG5leHQ6IExheWEuSGFuZGxlciA9IG51bGwpOiB2b2lkIHtcclxuICAgIC8vICDoiLnnp7vliqhcclxuICAgIExheWEuVHdlZW4udG8oXHJcbiAgICAgIHRoaXMuYm9hdC5nZXRTcHJpdGUoKSxcclxuICAgICAgYm9hdFBvcyxcclxuICAgICAgMjAwMCxcclxuICAgICAgbnVsbCxcclxuICAgICAgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XHJcbiAgICAgICAgTGF5YS5Nb3VzZS5zaG93KCk7XHJcbiAgICAgICAgbmV4dC5ydW4oKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcblxyXG4gICAgLy8gIGl0ZW3np7vliqhcclxuICAgIGlmICh0aGlzLmJvYXQuZ2V0UGFzc2FnZSgpKSB7XHJcbiAgICAgIExheWEuVHdlZW4udG8oXHJcbiAgICAgICAgdGhpcy5ib2F0LmdldFBhc3NhZ2UoKS5nZXRTcHJpdGUoKSxcclxuICAgICAgICBwYXNzYWdlUG9zLFxyXG4gICAgICAgIDIwMDAsXHJcbiAgICAgICAgbnVsbCxcclxuICAgICAgICAvLyBuZXh0LFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8g5ZCD5Lic6KW/55qE5Yqo5L2cXHJcbiAgZWF0KGVhdG9yOiBJdGVtLCBmb29kOiBJdGVtLCBuZXh0OiBMYXlhLkhhbmRsZXIgPSBudWxsKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLmxvZyhlYXRvciwgZm9vZCk7XHJcbiAgICBMYXlhLlR3ZWVuLnRvKFxyXG4gICAgICBlYXRvci5nZXRTcHJpdGUoKSxcclxuICAgICAge1xyXG4gICAgICAgIHg6IGZvb2QuZ2V0U3ByaXRlKCkueCxcclxuICAgICAgICB5OiBmb29kLmdldFNwcml0ZSgpLnksXHJcbiAgICAgIH0sXHJcbiAgICAgIDEwMDAsXHJcbiAgICAgIG51bGwsXHJcbiAgICAgIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG4gICAgICAgIGZvb2QuZ2V0U3ByaXRlKCkudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIG5leHQucnVuKCk7XHJcbiAgICAgIH0pLFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vICDot7Pot4PnmoTliqjkvZxcclxuICAvLyBqdW1wKGp1bXBlcjogSXRlbSwgeyBjYW5KdW1wLCBwb3NYLCBwb3NZLCByb2xsRmxhZyB9KTogdm9pZCB7XHJcbiAgLy8gICBpZiAoY2FuSnVtcCkge1xyXG4gIC8vICAgICBMYXlhLlR3ZWVuLnRvKFxyXG4gIC8vICAgICAgIGp1bXBlci5nZXRTcHJpdGUoKSxcclxuICAvLyAgICAgICB7XHJcbiAgLy8gICAgICAgICB4OiBwb3NYLFxyXG4gIC8vICAgICAgICAgeTogcG9zWSxcclxuICAvLyAgICAgICAgIHJvdGF0aW9uOiAzNjAgKiByb2xsRmxhZyxcclxuICAvLyAgICAgICB9LFxyXG4gIC8vICAgICAgIDIwMDAsXHJcbiAgLy8gICAgICAgTGF5YS5FYXNlLmJhY2tJbk91dCxcclxuICAvLyAgICAgKTtcclxuICAvLyAgIH1cclxuICAvLyB9XHJcblxyXG4gIGdhbWVPdmVyKCk6IHZvaWQge1xyXG4gICAgTGF5YS5Nb3VzZS5zaG93KCk7XHJcbiAgICBcclxuICAgIGNvbnN0IGdhbWVPdmVyID0gbmV3IEdhbWVPdmVyKExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5yZXNldCkpO1xyXG5cclxuICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoZ2FtZU92ZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gIOmHjee9rua4uOaIj1xyXG4gIHJlc2V0KCk6IHZvaWQge1xyXG4gICAgLy8gIOmHjee9rueLvOe+iuiNieeahOS9jee9rizmmL7npLrooqvlkIPmjonnmoRpdGVtLOmHjee9ruaXi+i9rOinkuW6plxyXG4gICAgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGl0ZW0uc2V0UG9zKFN0YXRpY0RhdGFbaXRlbS5nZXRUeXBlU3RyKCldLmxlZnQpO1xyXG4gICAgICBpdGVtLmdldFNwcml0ZSgpLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICBpdGVtLmdldFNwcml0ZSgpLnJvdGF0aW9uID0gMDtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vICDoiLnnva7nqbrvvIzph43nva7kvY3nva5cclxuICAgIHRoaXMuYm9hdC5yZW1vdmVQYXNzYWdlKCk7XHJcbiAgICB0aGlzLmJvYXQuc2V0UG9zKFN0YXRpY0RhdGEuYm9hdC5sZWZ0KTtcclxuXHJcbiAgICAvLyAg6YeN572u5rKz5bK45L+h5oGvXHJcbiAgICB0aGlzLnJpdmVyQmFua3NbMF0ucmVzZXRCYW5rQXJyKHRydWUpO1xyXG4gICAgdGhpcy5yaXZlckJhbmtzWzFdLnJlc2V0QmFua0FycihmYWxzZSk7XHJcbiAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIGNhYmJhZ2VQb3M6IHtcclxuICAgIGxlZnQ6IHtcclxuICAgICAgeDogMTAsXHJcbiAgICAgIHk6IDE2NCxcclxuICAgIH0sXHJcbiAgICByaWdodDoge1xyXG4gICAgICB4OiA4NzksXHJcbiAgICAgIHk6IDE2NCxcclxuICAgIH0sXHJcbiAgICBpbmRleDogMixcclxuICAgIG5hbWU6ICfljbflv4Poj5wnLFxyXG4gIH0sXHJcblxyXG4gIHNoZWVwUG9zOiB7XHJcbiAgICBsZWZ0OiB7XHJcbiAgICAgIHg6IDg4LFxyXG4gICAgICB5OiAxNjQsXHJcbiAgICB9LFxyXG4gICAgcmlnaHQ6IHtcclxuICAgICAgeDogOTcwLFxyXG4gICAgICB5OiAxNjQsXHJcbiAgICB9LFxyXG4gICAgaW5kZXg6IDEsXHJcbiAgICBuYW1lOiAn576KJyxcclxuICB9LFxyXG5cclxuICB3b2xmUG9zOiB7XHJcbiAgICBsZWZ0OiB7XHJcbiAgICAgIHg6IDE2MyxcclxuICAgICAgeTogMTY0LFxyXG4gICAgfSxcclxuICAgIHJpZ2h0OiB7XHJcbiAgICAgIHg6IDEwNTcsXHJcbiAgICAgIHk6IDE2NCxcclxuICAgIH0sXHJcbiAgICBpbmRleDogMCxcclxuICAgIG5hbWU6ICfni7wnLFxyXG4gIH0sXHJcblxyXG4gIGxlZnRSaXZlckJhbmtQb3M6IHtcclxuICAgIHg6IDQ2NCxcclxuICAgIHk6IDE3MyxcclxuICB9LFxyXG5cclxuICByaWdodFJpdmVyQmFua1Bvczoge1xyXG4gICAgeDogNzcxLFxyXG4gICAgeTogMTczLFxyXG4gIH0sXHJcblxyXG4gIGJvYXQ6IHtcclxuICAgIGxlZnQ6IHtcclxuICAgICAgeDogMjgyLFxyXG4gICAgICB5OiAxMjAsXHJcbiAgICB9LFxyXG4gICAgcmlnaHQ6IHtcclxuICAgICAgeDogNTg5LFxyXG4gICAgICB5OiAxMjAsXHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIGluZGV4OiB7XHJcbiAgICBXT0xGOiAwLFxyXG4gICAgU0hFRVA6IDEsXHJcbiAgICBDQUJCQUdFOiAyLFxyXG4gICAgTEVGVF9CQU5LOiAwLFxyXG4gICAgUklHSFRfQkFOSzogMSxcclxuICB9LFxyXG5cclxuICBtZXNzYWdlOiBuZXcgTGF5YS5UZXh0KCksXHJcbn1cclxuIiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXG5pbXBvcnQgVmlldz1MYXlhLlZpZXc7XHJcbmltcG9ydCBEaWFsb2c9TGF5YS5EaWFsb2c7XHJcbmltcG9ydCBTY2VuZT1MYXlhLlNjZW5lO1xudmFyIFJFRzogRnVuY3Rpb24gPSBMYXlhLkNsYXNzVXRpbHMucmVnQ2xhc3M7XG5leHBvcnQgbW9kdWxlIHVpIHtcclxuICAgIGV4cG9ydCBjbGFzcyBCYWNrR3JvdW5kVUkgZXh0ZW5kcyBMYXlhLlNjZW5lIHtcclxuXHRcdHB1YmxpYyBjYWJiYWdlOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzaGVlcDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgd29sZjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYm9hdFNwcml0ZTpMYXlhLkJveDtcblx0XHRwdWJsaWMgZ286TGF5YS5TcHJpdGU7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgIHVpVmlldzphbnkgPXtcInR5cGVcIjpcIlNjZW5lXCIsXCJwcm9wc1wiOntcIndpZHRoXCI6MTI4MCxcImhlaWdodFwiOjcyMH0sXCJjb21wSWRcIjoyLFwiY2hpbGRcIjpbe1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoyMTUsXCJ4XCI6MCxcIndpZHRoXCI6MjUxLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyYmFuay5wbmdcIixcImhlaWdodFwiOjUwMn0sXCJjb21wSWRcIjo1OH0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjo0ODAsXCJ4XCI6MTA4OSxcIndpZHRoXCI6NTM1LFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyYmFuay5wbmdcIixcInJvdGF0aW9uXCI6MjcwLFwicGl2b3RZXCI6MjE5LFwicGl2b3RYXCI6MjY4LFwiaGVpZ2h0XCI6NDA2fSxcImNvbXBJZFwiOjY1fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjE2NCxcInhcIjoxMCxcIndpZHRoXCI6NTgsXCJ2YXJcIjpcImNhYmJhZ2VcIixcInRleHR1cmVcIjpcImFjdG9ycy9jYWJiYWdlLnBuZ1wiLFwiaGVpZ2h0XCI6NTh9LFwiY29tcElkXCI6NzJ9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MTY0LFwieFwiOjg4LFwid2lkdGhcIjo1OCxcInZhclwiOlwic2hlZXBcIixcInRleHR1cmVcIjpcImFjdG9ycy9zaGVlcC5wbmdcIixcImhlaWdodFwiOjU4fSxcImNvbXBJZFwiOjcwfSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjE2NCxcInhcIjoxNjMsXCJ3aWR0aFwiOjU4LFwidmFyXCI6XCJ3b2xmXCIsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvd29sZi5wbmdcIixcImhlaWdodFwiOjU4fSxcImNvbXBJZFwiOjcxfSx7XCJ0eXBlXCI6XCJCb3hcIixcInByb3BzXCI6e1wieVwiOjI1MyxcInhcIjoyNTEsXCJ3aWR0aFwiOjYxNSxcImhlaWdodFwiOjQ2NH0sXCJjb21wSWRcIjo4MCxcImNoaWxkXCI6W3tcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MTMzLFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtMFwiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjN9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MTMzLFwieFwiOjEyMyxcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTFcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo1fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjEzMyxcInhcIjoyNDYsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0yXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6Nn0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoxMzMsXCJ4XCI6MzY5LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtM1wiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjd9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MTMzLFwieFwiOjQ5MixcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTRcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo4fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtMFwiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjQ3fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieFwiOjEyMyxcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTFcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo0OH0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInhcIjoyNDYsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0yXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NDl9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ4XCI6MzY5LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtM1wiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjUwfSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieFwiOjQ5MixcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTRcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo1MX0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoyNjYsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0wXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NjB9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MjY2LFwieFwiOjEyMyxcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTFcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo2MX0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoyNjYsXCJ4XCI6MjQ2LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtMlwiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjYyfSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjI2NixcInhcIjozNjksXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0zXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NjN9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MjY2LFwieFwiOjQ5MixcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTRcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo2NH0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjo0MDIsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0wXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NzV9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6NDAyLFwieFwiOjEyMyxcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTFcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo3Nn0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjo0MDIsXCJ4XCI6MjQ2LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtMlwiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjc3fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjQwMixcInhcIjozNjksXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0zXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6Nzh9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6NDAyLFwieFwiOjQ5MixcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTRcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo3OX1dfSx7XCJ0eXBlXCI6XCJCb3hcIixcInByb3BzXCI6e1wieVwiOjEyMCxcInhcIjoyODIsXCJ2YXJcIjpcImJvYXRTcHJpdGVcIn0sXCJjb21wSWRcIjo3MyxcImNoaWxkXCI6W3tcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ3aWR0aFwiOjI2MSxcInRleHR1cmVcIjpcImFjdG9ycy9ib2F0LnBuZ1wiLFwiaGVpZ2h0XCI6MTkwfSxcImNvbXBJZFwiOjY3fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjIxLFwieFwiOjExNSxcIndpZHRoXCI6ODcsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvZmFybWVyLnBuZ1wiLFwiaGVpZ2h0XCI6ODd9LFwiY29tcElkXCI6Njl9XX0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjozNixcInhcIjo1MTYuNSxcIndpZHRoXCI6ODQsXCJ2YXJcIjpcImdvXCIsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvZ28ucG5nXCIsXCJoZWlnaHRcIjo4NH0sXCJjb21wSWRcIjo3NH1dLFwibG9hZExpc3RcIjpbXCJhY3RvcnMvcml2ZXJiYW5rLnBuZ1wiLFwiYWN0b3JzL2NhYmJhZ2UucG5nXCIsXCJhY3RvcnMvc2hlZXAucG5nXCIsXCJhY3RvcnMvd29sZi5wbmdcIixcImFjdG9ycy9yaXZlci5wbmdcIixcImFjdG9ycy9ib2F0LnBuZ1wiLFwiYWN0b3JzL2Zhcm1lci5wbmdcIixcImFjdG9ycy9nby5wbmdcIl0sXCJsb2FkTGlzdDNEXCI6W119O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVWaWV3KEJhY2tHcm91bmRVSS51aVZpZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFJFRyhcInVpLkJhY2tHcm91bmRVSVwiLEJhY2tHcm91bmRVSSk7XHJcbiAgICBleHBvcnQgY2xhc3MgZ2FtZU92ZXJVSSBleHRlbmRzIExheWEuU2NlbmUge1xyXG5cdFx0cHVibGljIHJlc3RhcnRCdG46TGF5YS5CdXR0b247XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgIHVpVmlldzphbnkgPXtcInR5cGVcIjpcIlNjZW5lXCIsXCJwcm9wc1wiOntcIndpZHRoXCI6MTI4MCxcImhlaWdodFwiOjcyMH0sXCJjb21wSWRcIjoyLFwiY2hpbGRcIjpbe1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjowLFwieFwiOjAsXCJ3aWR0aFwiOjEyODQsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvZ2FtZW92ZXIuanBnXCIsXCJoZWlnaHRcIjo3MjB9LFwiY29tcElkXCI6NX0se1widHlwZVwiOlwiQnV0dG9uXCIsXCJwcm9wc1wiOntcInlcIjo1ODcsXCJ4XCI6NTEwLjUsXCJ3aWR0aFwiOjI2MyxcInZhclwiOlwicmVzdGFydEJ0blwiLFwic2tpblwiOlwiY29tcC9idXR0b24ucG5nXCIsXCJsYWJlbFNpemVcIjo2MCxcImxhYmVsQ29sb3JzXCI6XCIjZmZmZmZmXCIsXCJsYWJlbFwiOlwi6YeN5paw5byA5aeLXCIsXCJoZWlnaHRcIjo4Nn0sXCJjb21wSWRcIjo0fV0sXCJsb2FkTGlzdFwiOltcImFjdG9ycy9nYW1lb3Zlci5qcGdcIixcImNvbXAvYnV0dG9uLnBuZ1wiXSxcImxvYWRMaXN0M0RcIjpbXX07XHJcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVZpZXcoZ2FtZU92ZXJVSS51aVZpZXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFJFRyhcInVpLmdhbWVPdmVyVUlcIixnYW1lT3ZlclVJKTtcclxufVxyIl19
