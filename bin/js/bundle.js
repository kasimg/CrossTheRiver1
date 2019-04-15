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
        //  确定移动的方向
        if (this.img.x === StaticData_1.default.boat.left.x) {
            boatPos = StaticData_1.default.boat.right;
            passagePos = StaticData_1.default.rightRiverBankPos;
        }
        else {
            boatPos = StaticData_1.default.boat.left;
            passagePos = StaticData_1.default.leftRiverBankPos;
        }
        //  确定移动的距离
        if (!succeed) {
            boatPos['x'] -= 150;
            passagePos['x'] -= 150;
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
},{"./StaticData":6}],2:[function(require,module,exports){
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
    //  从往船上跳
    Item.prototype.jump = function () {
        var posX;
        var posY;
        var rollFlag = 1; //  控制旋转
        var canJump = true; //  控制是否能跳
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
            rollFlag = 0;
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
            }, 2000, Laya.Ease.backInOut);
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
    //  被吃
    Item.prototype.getEaten = function () {
    };
    //  获取类型码
    Item.prototype.getTypeStr = function () {
        return this.typeStr;
    };
    //  获取图片对象（精灵）
    Item.prototype.getSprite = function () {
        return this.img;
    };
    return Item;
}());
exports.default = Item;
},{"./StaticData":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Script_1 = require("./Script");
var Main = /** @class */ (function () {
    function Main() {
        this.initUI();
    }
    //  初始化游戏界面
    Main.prototype.initUI = function () {
        Laya.init(1336, 700);
        Laya.stage.bgColor = '#ffffff';
        var resArray = [
            { url: 'res/atlas/actors.atlas', type: Laya.Loader.ATLAS },
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
},{"./Script":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StaticData_1 = require("./StaticData");
var RiverBank = /** @class */ (function () {
    function RiverBank(originState) {
        this.items = originState; //  设置初始状态
    }
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
    return RiverBank;
}());
exports.default = RiverBank;
},{"./StaticData":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("./ui/layaMaxUI");
var Item_1 = require("./Item");
var Boat_1 = require("./Boat");
var StaticData_1 = require("./StaticData");
var RiverBank_1 = require("./RiverBank");
var Script = /** @class */ (function (_super) {
    __extends(Script, _super);
    function Script() {
        var _this = _super.call(this) || this;
        _this.items = new Array();
        _this.boat = new Boat_1.default(_this.boatSprite);
        _this.initActors();
        _this.bindGoEvent();
        return _this;
    }
    //  初始化狼、羊和卷心菜实例
    Script.prototype.initActors = function () {
        this.riverBanks = [
            new RiverBank_1.default([1, 1, 1]),
            new RiverBank_1.default([0, 0, 0]),
        ];
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
        // 确定要判断那边岸的情况
        var bankIndex = this.boat.getSprite().x === StaticData_1.default.boat.left.x
            ? StaticData_1.default.index.LEFT_BANK
            : StaticData_1.default.index.RIGHT_BANK;
        var eatArr = this.riverBanks[bankIndex].EatOrNot();
        if (eatArr) { //  如果发生了吃事件
            var eator_1 = this.items[eatArr[0]];
            var food_1 = this.items[eatArr[1]];
            //  先移动再吃东西
            // this.boat.moveBoat(false);
            this.moveBoat(this.boat.moveBoat(false), Laya.Handler.create(this, function () {
                _this.eat(eator_1, food_1);
            }));
        }
        else { //  否则
            // this.boat.moveBoat();
            this.moveBoat(this.boat.moveBoat(), Laya.Handler.create(this, function () {
                Laya.Mouse.show();
            }));
        }
    };
    //  船移动
    Script.prototype.moveBoat = function (_a, next) {
        var boatPos = _a.boatPos, passagePos = _a.passagePos;
        if (next === void 0) { next = null; }
        //  船移动
        Laya.Tween.to(this.boat.getSprite(), boatPos, 2000);
        //  item移动
        if (this.boat.getPassage()) {
            Laya.Tween.to(this.boat.getPassage().getSprite(), passagePos, 2000, null, next);
        }
    };
    // 吃东西的动作
    Script.prototype.eat = function (eator, food, next) {
        if (next === void 0) { next = null; }
        Laya.Tween.to(eator.getSprite(), {
            x: food.getSprite().x,
            y: food.getSprite().y,
        }, 1000, null, Laya.Handler.create(this, function () {
            food.getSprite().visible = false;
            // next();
        }));
    };
    //  跳跃的动作
    Script.prototype.jump = function (jumper, _a) {
        var canJump = _a.canJump, posX = _a.posX, posY = _a.posY, rollFlag = _a.rollFlag;
        if (canJump) {
            Laya.Tween.to(jumper.getSprite(), {
                x: posX,
                y: posY,
                rotation: 360 * rollFlag,
            }, 2000, Laya.Ease.backInOut);
        }
    };
    return Script;
}(layaMaxUI_1.ui.BackGroundUI));
exports.default = Script;
},{"./Boat":1,"./Item":2,"./RiverBank":4,"./StaticData":6,"./ui/layaMaxUI":7}],6:[function(require,module,exports){
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
        index: 1
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
};
},{}],7:[function(require,module,exports){
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
        BackGroundUI.uiView = { "type": "Scene", "props": { "width": 1136, "height": 640 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 215, "x": 0, "width": 251, "texture": "actors/riverbank.png", "height": 427 }, "compId": 58 }, { "type": "Sprite", "props": { "y": 640, "x": 866, "width": 423, "texture": "actors/riverbank.png", "rotation": -90, "height": 271 }, "compId": 65 }, { "type": "Box", "props": { "y": 253, "x": 251 }, "compId": 68, "child": [{ "type": "Sprite", "props": { "y": 133, "width": 123, "texture": "actors/river.png", "name": "item0", "height": 123 }, "compId": 3 }, { "type": "Sprite", "props": { "y": 133, "x": 123, "width": 123, "texture": "actors/river.png", "name": "item1", "height": 123 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 133, "x": 246, "width": 123, "texture": "actors/river.png", "name": "item2", "height": 123 }, "compId": 6 }, { "type": "Sprite", "props": { "y": 133, "x": 369, "width": 123, "texture": "actors/river.png", "name": "item3", "height": 123 }, "compId": 7 }, { "type": "Sprite", "props": { "y": 133, "x": 492, "width": 123, "texture": "actors/river.png", "name": "item4", "height": 123 }, "compId": 8 }, { "type": "Sprite", "props": { "width": 123, "texture": "actors/river.png", "name": "item0", "height": 123 }, "compId": 47 }, { "type": "Sprite", "props": { "x": 123, "width": 123, "texture": "actors/river.png", "name": "item1", "height": 123 }, "compId": 48 }, { "type": "Sprite", "props": { "x": 246, "width": 123, "texture": "actors/river.png", "name": "item2", "height": 123 }, "compId": 49 }, { "type": "Sprite", "props": { "x": 369, "width": 123, "texture": "actors/river.png", "name": "item3", "height": 123 }, "compId": 50 }, { "type": "Sprite", "props": { "x": 492, "width": 123, "texture": "actors/river.png", "name": "item4", "height": 123 }, "compId": 51 }, { "type": "Sprite", "props": { "y": 266, "width": 123, "texture": "actors/river.png", "name": "item0", "height": 123 }, "compId": 60 }, { "type": "Sprite", "props": { "y": 266, "x": 123, "width": 123, "texture": "actors/river.png", "name": "item1", "height": 123 }, "compId": 61 }, { "type": "Sprite", "props": { "y": 266, "x": 246, "width": 123, "texture": "actors/river.png", "name": "item2", "height": 123 }, "compId": 62 }, { "type": "Sprite", "props": { "y": 266, "x": 369, "width": 123, "texture": "actors/river.png", "name": "item3", "height": 123 }, "compId": 63 }, { "type": "Sprite", "props": { "y": 266, "x": 492, "width": 123, "texture": "actors/river.png", "name": "item4", "height": 123 }, "compId": 64 }] }, { "type": "Sprite", "props": { "y": 164, "x": 10, "width": 58, "var": "cabbage", "texture": "actors/cabbage.png", "height": 58 }, "compId": 72 }, { "type": "Sprite", "props": { "y": 164, "x": 88, "width": 58, "var": "sheep", "texture": "actors/sheep.png", "height": 58 }, "compId": 70 }, { "type": "Sprite", "props": { "y": 164, "x": 163, "width": 58, "var": "wolf", "texture": "actors/wolf.png", "height": 58 }, "compId": 71 }, { "type": "Box", "props": { "y": 120, "x": 282, "var": "boatSprite" }, "compId": 73, "child": [{ "type": "Sprite", "props": { "width": 261, "texture": "actors/boat.png", "height": 190 }, "compId": 67 }, { "type": "Sprite", "props": { "y": 21, "x": 115, "width": 87, "texture": "actors/farmer.png", "height": 87 }, "compId": 69 }] }, { "type": "Sprite", "props": { "y": 36, "x": 516.5, "width": 84, "var": "go", "texture": "actors/go.png", "height": 84 }, "compId": 74 }], "loadList": ["actors/riverbank.png", "actors/river.png", "actors/cabbage.png", "actors/sheep.png", "actors/wolf.png", "actors/boat.png", "actors/farmer.png", "actors/go.png"], "loadList3D": [] };
        return BackGroundUI;
    }(Laya.Scene));
    ui.BackGroundUI = BackGroundUI;
    REG("ui.BackGroundUI", BackGroundUI);
})(ui = exports.ui || (exports.ui = {}));
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2g15ri45oiPL0xheWFBaXJJREVfYmV0YS9yZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQm9hdC50cyIsInNyYy9JdGVtLnRzIiwic3JjL01haW4udHMiLCJzcmMvUml2ZXJCYW5rLnRzIiwic3JjL1NjcmlwdC50cyIsInNyYy9TdGF0aWNEYXRhLnRzIiwic3JjL3VpL2xheWFNYXhVSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNUQSwyQ0FBc0M7QUFFdEM7SUFLRSxjQUFZLEdBQWdCO1FBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxRQUFRO0lBQ0QseUJBQVUsR0FBakIsVUFBa0IsT0FBYTtRQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUV6QixDQUFDO0lBRUQsUUFBUTtJQUNELDRCQUFhLEdBQXBCO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELFdBQVc7SUFDSixvQkFBSyxHQUFaO1FBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNyQyxDQUFDO0lBRUQsY0FBYztJQUNQLHdCQUFTLEdBQWhCO1FBQ0UsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxRQUFRO0lBQ0QseUJBQVUsR0FBakI7UUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELG9CQUFvQjtJQUNiLHVCQUFRLEdBQWYsVUFBZ0IsT0FBdUI7UUFBdkIsd0JBQUEsRUFBQSxjQUF1QjtRQUNyQyxJQUFJLE9BQVcsQ0FBQztRQUNoQixJQUFJLFVBQWMsQ0FBQztRQUNu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U0FBUyxFQUFDLHNCQUFzQixFQUFDLFVBQVUsRUFBQyxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLFNBQVMsRUFBQyxvQkFBb0IsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLFlBQVksRUFBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsU0FBUyxFQUFDLGlCQUFpQixFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsRUFBRSxFQUFDLFNBQVMsRUFBQyxtQkFBbUIsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsZUFBZSxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxVQUFVLEVBQUMsQ0FBQyxzQkFBc0IsRUFBQyxrQkFBa0IsRUFBQyxvQkFBb0IsRUFBQyxrQkFBa0IsRUFBQyxpQkFBaUIsRUFBQyxpQkFBaUIsRUFBQyxtQkFBbUIsRUFBQyxlQUFlLENBQUMsRUFBQyxZQUFZLEVBQUMsRUFBRSxFQUFDLENBQUM7UUFNNWxHLG1CQUFDO0tBWkQsQUFZQyxDQVppQyxJQUFJLENBQUMsS0FBSyxHQVkzQztJQVpZLGVBQVksZUFZeEIsQ0FBQTtJQUNELEdBQUcsQ0FBQyxpQkFBaUIsRUFBQyxZQUFZLENBQUMsQ0FBQztBQUN4QyxDQUFDLEVBZmEsRUFBRSxHQUFGLFVBQUUsS0FBRixVQUFFLFFBZWYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEl0ZW0gZnJvbSAnLi9JdGVtJztcclxuaW1wb3J0IFN0YXRpY0RhdGEgZnJvbSAnLi9TdGF0aWNEYXRhJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvYXQge1xyXG4gIHByaXZhdGUgcGFzc2FnZTogSXRlbTtcclxuXHJcbiAgcHJpdmF0ZSBpbWc6IExheWEuU3ByaXRlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihpbWc6IExheWEuU3ByaXRlKSB7XHJcbiAgICB0aGlzLmltZyA9IGltZztcclxuICB9XHJcblxyXG4gIC8vICDmt7vliqDkuZjlrqJcclxuICBwdWJsaWMgYWRkUGFzc2FnZShwYXNzYWdlOiBJdGVtKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhc3NhZ2UgPSBwYXNzYWdlO1xyXG5cclxuICB9XHJcblxyXG4gIC8vICDnp7vpmaTkuZjlrqJcclxuICBwdWJsaWMgcmVtb3ZlUGFzc2FnZSgpOiB2b2lkIHtcclxuICAgIHRoaXMucGFzc2FnZSA9IG51bGw7XHJcbiAgfVxyXG5cclxuICAvLyAg5Yik5pat6Ii55piv5ZCm5Li656m6XHJcbiAgcHVibGljIGVtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMucGFzc2FnZSA/IGZhbHNlIDogdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8vICDojrflj5ZzcHJpdGXlr7nosaFcclxuICBwdWJsaWMgZ2V0U3ByaXRlKCk6IExheWEuU3ByaXRlIHtcclxuICAgIHJldHVybiB0aGlzLmltZztcclxuICB9XHJcblxyXG4gIC8vICDojrflj5bkuZjlrqJcclxuICBwdWJsaWMgZ2V0UGFzc2FnZSgpOiBJdGVtIHtcclxuICAgIHJldHVybiB0aGlzLnBhc3NhZ2U7XHJcbiAgfVxyXG5cclxuICAvLyAg56e75Yqo77yM5oiQ5Yqf56e75Yqo5YWo56iL77yM5aSx6LSl56e75Yqo5Y2K56iLXHJcbiAgcHVibGljIG1vdmVCb2F0KHN1Y2NlZWQ6IGJvb2xlYW4gPSB0cnVlKTogYW55IHtcclxuICAgIGxldCBib2F0UG9zOiB7fTtcclxuICAgIGxldCBwYXNzYWdlUG9zOiB7fTtcclxuICAgIC8vICDnoa7lrprnp7vliqjnmoTmlrnlkJFcclxuICAgIGlmICh0aGlzLmltZy54ID09PSBTdGF0aWNEYXRhLmJvYXQubGVmdC54KSB7XHJcbiAgICAgIGJvYXRQb3MgPSBTdGF0aWNEYXRhLmJvYXQucmlnaHQ7XHJcbiAgICAgIHBhc3NhZ2VQb3MgPSBTdGF0aWNEYXRhLnJpZ2h0Uml2ZXJCYW5rUG9zO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYm9hdFBvcyA9IFN0YXRpY0RhdGEuYm9hdC5sZWZ0O1xyXG4gICAgICBwYXNzYWdlUG9zID0gU3RhdGljRGF0YS5sZWZ0Uml2ZXJCYW5rUG9zO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICDnoa7lrprnp7vliqjnmoTot53nprtcclxuICAgIGlmICghc3VjY2VlZCkge1xyXG4gICAgICBib2F0UG9zWyd4J10gLT0gMTUwO1xyXG4gICAgICBwYXNzYWdlUG9zWyd4J10gLT0gMTUwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJvYXRQb3MsXHJcbiAgICAgIHBhc3NhZ2VQb3MsXHJcbiAgICB9O1xyXG5cclxuICAgIC8vICDoiLnnp7vliqhcclxuICAgIExheWEuVHdlZW4udG8oXHJcbiAgICAgIHRoaXMuaW1nLFxyXG4gICAgICBib2F0UG9zLFxyXG4gICAgICAyMDAwLFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyAgaXRlbeenu+WKqFxyXG4gICAgTGF5YS5Ud2Vlbi50byhcclxuICAgICAgdGhpcy5wYXNzYWdlLmdldFNwcml0ZSgpLFxyXG4gICAgICBwYXNzYWdlUG9zLFxyXG4gICAgICAyMDAwLFxyXG4gICAgICBudWxsLFxyXG4gICAgKTtcclxuICB9XHJcbn0iLCJpbXBvcnQgU3ByaXRlID0gTGF5YS5TcHJpdGU7XHJcbmltcG9ydCBTdGF0aWNEYXRhIGZyb20gJy4vU3RhdGljRGF0YSc7XHJcbmltcG9ydCBCb2F0IGZyb20gJy4vQm9hdCc7XHJcbmltcG9ydCBSaXZlckJhbmsgZnJvbSAnLi9SaXZlckJhbmsnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbSB7XHJcbiAgcHJpdmF0ZSBpbWc6IFNwcml0ZTtcclxuXHJcbiAgcHJpdmF0ZSB0eXBlU3RyOiBzdHJpbmc7ICAvLyAg55So5LqO5Yy65Yir5piv6LCB6KKr54K55Ye75LqG77yM6LCB6K+l6Lez77yI5Z2Q5qCH5LiN5ZCM77yJXHJcblxyXG4gIHByaXZhdGUgYm9hdDogQm9hdDtcclxuXHJcbiAgcHJpdmF0ZSByaXZlckJhbmtzOiBBcnJheTxSaXZlckJhbms+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihpbWc6IFNwcml0ZSwgdHlwZVN0cjogc3RyaW5nLCBib2F0OiBCb2F0LCByaXZlckJhbmtzOiBBcnJheTxSaXZlckJhbms+KSB7XHJcbiAgICB0aGlzLmltZyA9IGltZztcclxuICAgIHRoaXMuYmluZENsaWNrRXZlbnQoKTtcclxuICAgIHRoaXMudHlwZVN0ciA9IHR5cGVTdHI7XHJcbiAgICB0aGlzLmJvYXQgPSBib2F0O1xyXG4gICAgdGhpcy5yaXZlckJhbmtzID0gcml2ZXJCYW5rcztcclxuICB9XHJcblxyXG4gIC8vICDnu5Hlrprngrnlh7vkuovku7ZcclxuICBiaW5kQ2xpY2tFdmVudCgpOiB2b2lkIHtcclxuICAgIHRoaXMuaW1nLm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTiwgdGhpcywgdGhpcy5qdW1wKTtcclxuICB9XHJcblxyXG4gIC8vICDku47lvoDoiLnkuIrot7NcclxuICBqdW1wKCk6IHZvaWQge1xyXG4gICAgbGV0IHBvc1g6IG51bWJlcjtcclxuICAgIGxldCBwb3NZOiBudW1iZXI7XHJcblxyXG4gICAgbGV0IHJvbGxGbGFnOiBudW1iZXIgPSAxOyAgLy8gIOaOp+WItuaXi+i9rFxyXG5cclxuICAgIGxldCBjYW5KdW1wOiBib29sZWFuID0gdHJ1ZTsgIC8vICDmjqfliLbmmK/lkKbog73ot7NcclxuXHJcbiAgICAvLyAg5YWI5Yik5pat5b6A5ZOq6YeM6LezXHJcbiAgICBpZiAodGhpcy5pbWcueCA8IFN0YXRpY0RhdGEubGVmdFJpdmVyQmFua1Bvcy54KSB7ICAvLyAg5q2k5pe25piv5LuO5bem5bK45ZCR6Ii55LiK6LezXHJcbiAgICAgIHBvc1ggPSBTdGF0aWNEYXRhLmxlZnRSaXZlckJhbmtQb3MueDtcclxuICAgICAgcG9zWSA9IFN0YXRpY0RhdGEubGVmdFJpdmVyQmFua1Bvcy55O1xyXG5cclxuICAgICAgaWYgKCF0aGlzLmJvYXQuZW1wdHkoKSkge1xyXG4gICAgICAgIGNhbkp1bXAgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmJvYXQuYWRkUGFzc2FnZSh0aGlzKTtcclxuICAgICAgICB0aGlzLnJpdmVyQmFua3NbU3RhdGljRGF0YS5pbmRleC5MRUZUX0JBTktdLmdldE91dChTdGF0aWNEYXRhW3RoaXMudHlwZVN0cl0uaW5kZXgpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW1nLnggPT09IFN0YXRpY0RhdGEubGVmdFJpdmVyQmFua1Bvcy54KSB7ICAvLyAg5q2k5pe25piv5LuO6Ii55LiK5ZCR5bem5bK46LezXHJcbiAgICAgIHBvc1ggPSBTdGF0aWNEYXRhW3RoaXMudHlwZVN0cl0ubGVmdC54O1xyXG4gICAgICBwb3NZID0gU3RhdGljRGF0YVt0aGlzLnR5cGVTdHJdLmxlZnQueTtcclxuICAgICAgcm9sbEZsYWcgPSAwO1xyXG4gICAgICB0aGlzLmJvYXQucmVtb3ZlUGFzc2FnZSgpO1xyXG4gICAgICB0aGlzLnJpdmVyQmFua3NbU3RhdGljRGF0YS5pbmRleC5MRUZUX0JBTktdLmdldEluKFN0YXRpY0RhdGFbdGhpcy50eXBlU3RyXS5pbmRleCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW1nLnggPT09IFN0YXRpY0RhdGEucmlnaHRSaXZlckJhbmtQb3MueCkgeyAgLy8gIOatpOaXtuaYr+S7juiIueS4iuWQkeWPs+WyuOi3s1xyXG4gICAgICBwb3NYID0gU3RhdGljRGF0YVt0aGlzLnR5cGVTdHJdLnJpZ2h0Lng7XHJcbiAgICAgIHBvc1kgPSBTdGF0aWNEYXRhW3RoaXMudHlwZVN0cl0ucmlnaHQueTtcclxuICAgICAgcm9sbEZsYWcgPSAwO1xyXG4gICAgICB0aGlzLmJvYXQucmVtb3ZlUGFzc2FnZSgpO1xyXG4gICAgICB0aGlzLnJpdmVyQmFua3NbU3RhdGljRGF0YS5pbmRleC5SSUdIVF9CQU5LXS5nZXRJbihTdGF0aWNEYXRhW3RoaXMudHlwZVN0cl0uaW5kZXgpO1xyXG4gICAgfSBlbHNlIHsgIC8vICDmraTml7bmmK/ku47lj7PlsrjlvoDoiLnkuIrot7NcclxuICAgICAgcG9zWCA9IFN0YXRpY0RhdGEucmlnaHRSaXZlckJhbmtQb3MueDtcclxuICAgICAgcG9zWSA9IFN0YXRpY0RhdGEucmlnaHRSaXZlckJhbmtQb3MueTtcclxuICAgICAgaWYgKCF0aGlzLmJvYXQuZW1wdHkoKSkge1xyXG4gICAgICAgIGNhbkp1bXAgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmJvYXQuYWRkUGFzc2FnZSh0aGlzKTtcclxuICAgICAgICB0aGlzLnJpdmVyQmFua3NbU3RhdGljRGF0YS5pbmRleC5SSUdIVF9CQU5LXS5nZXRPdXQoU3RhdGljRGF0YVt0aGlzLnR5cGVTdHJdLmluZGV4KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICDlvIDlp4vot7NcclxuICAgIGlmIChjYW5KdW1wKSB7XHJcbiAgICAgIExheWEuVHdlZW4udG8oXHJcbiAgICAgICAgdGhpcy5pbWcsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgeDogcG9zWCxcclxuICAgICAgICAgIHk6IHBvc1ksXHJcbiAgICAgICAgICByb3RhdGlvbjogMzYwICogcm9sbEZsYWcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAyMDAwLFxyXG4gICAgICAgIExheWEuRWFzZS5iYWNrSW5PdXQsXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gIOa4uOaIj+WIpOWumuWksei0peWQjueahOWQg+eahOWKqOS9nFxyXG4gIGVhdChmb29kIDogSXRlbSk6IHZvaWQge1xyXG4gICAgLy8gIOWQg+S4nOilv+eahGl0ZW3np7vliqjliLDooqvlkIPnmoRpdGVt5LiKXHJcbiAgICBMYXlhLlR3ZWVuLnRvKFxyXG4gICAgICB0aGlzLmltZyxcclxuICAgICAge1xyXG4gICAgICAgIHg6IGZvb2QuZ2V0U3ByaXRlKCkueCxcclxuICAgICAgICB5OiBmb29kLmdldFNwcml0ZSgpLnksXHJcbiAgICAgIH0sXHJcbiAgICAgIDEwMDAsXHJcbiAgICAgIG51bGwsXHJcbiAgICAgIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG4gICAgICAgIGZvb2QuZ2V0U3ByaXRlKCkudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICB9KSxcclxuICAgICk7XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gIOiiq+WQg1xyXG4gIGdldEVhdGVuKCk6IHZvaWQge1xyXG5cclxuICB9XHJcblxyXG4gIC8vICDojrflj5bnsbvlnovnoIFcclxuICBwdWJsaWMgZ2V0VHlwZVN0cigpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMudHlwZVN0cjtcclxuICB9XHJcblxyXG4gIC8vICDojrflj5blm77niYflr7nosaHvvIjnsr7ngbXvvIlcclxuICBwdWJsaWMgZ2V0U3ByaXRlKCk6IExheWEuU3ByaXRlIHtcclxuICAgIHJldHVybiB0aGlzLmltZztcclxuICB9XHJcblxyXG59IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgU2NyaXB0IGZyb20gXCIuL1NjcmlwdFwiO1xyXG5cclxuY2xhc3MgTWFpbiB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmluaXRVSSgpO1xyXG5cdH1cclxuXHRcclxuXHQvLyAg5Yid5aeL5YyW5ri45oiP55WM6Z2iXHJcblx0aW5pdFVJKCk6IHZvaWQge1xyXG5cdFx0TGF5YS5pbml0KDEzMzYsIDcwMCk7XHJcblx0XHRMYXlhLnN0YWdlLmJnQ29sb3IgPSAnI2ZmZmZmZic7XHJcblx0XHRjb25zdCByZXNBcnJheSA9IFtcclxuXHRcdFx0e3VybDogJ3Jlcy9hdGxhcy9hY3RvcnMuYXRsYXMnLCB0eXBlOiBMYXlhLkxvYWRlci5BVExBU30sXHJcblx0XHRdO1xyXG5cclxuXHRcdC8vICDliqDovb3lm77lg49cclxuXHRcdExheWEubG9hZGVyLmxvYWQocmVzQXJyYXksIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG5cdFx0XHRjb25zdCBzY2VuZTogU2NyaXB0ID0gbmV3IFNjcmlwdCgpO1xyXG5cdFx0XHRMYXlhLnN0YWdlLmFkZENoaWxkKHNjZW5lKTtcclxuXHRcdH0pKTtcclxuXHR9XHJcbn1cclxuLy/mv4DmtLvlkK/liqjnsbtcclxubmV3IE1haW4oKTtcclxuIiwiaW1wb3J0IFN0YXRpY0RhdGEgZnJvbSBcIi4vU3RhdGljRGF0YVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUml2ZXJCYW5rIHtcclxuICBwcml2YXRlIGl0ZW1zIDogQXJyYXk8bnVtYmVyPjsgIC8vICAx6KGo56S65Zyo6L+Z5LiA6L6555qE5bK45LiK77yMMOihqOekuuS4jeWcqFxyXG5cclxuICBjb25zdHJ1Y3RvcihvcmlnaW5TdGF0ZSA6IEFycmF5PG51bWJlcj4pIHtcclxuICAgIHRoaXMuaXRlbXMgPSBvcmlnaW5TdGF0ZTsgIC8vICDorr7nva7liJ3lp4vnirbmgIFcclxuICB9XHJcblxyXG4gIC8vICDmnIlpdGVt5LiK5bK4XHJcbiAgcHVibGljIGdldEluKGluZGV4IDogbnVtYmVyKSA6IHZvaWQge1xyXG4gICAgdGhpcy5pdGVtc1tpbmRleF0gPSAxO1xyXG4gIH1cclxuXHJcbiAgLy8gIOaciWl0ZW3lh7rlsrhcclxuICBwdWJsaWMgZ2V0T3V0KGluZGV4IDogbnVtYmVyKSA6IHZvaWQge1xyXG4gICAgdGhpcy5pdGVtc1tpbmRleF0gPSAwO1xyXG4gIH1cclxuXHJcbiAgLy8gIOWIpOaWreaYr+WQpuacieWQg+eahOS6i+S7tuWPkeeUn++8jOi/lOWbnuWQg+WSjOiiq+WQg+eahOWvueixoVxyXG4gIHB1YmxpYyBFYXRPck5vdCgpIDogQXJyYXk8bnVtYmVyPiB7XHJcbiAgICBpZiAoZXZhbCh0aGlzLml0ZW1zLmpvaW4oXCIrXCIpKSAhPT0gMikgcmV0dXJuIG51bGw7XHJcbiAgICBpZiAodGhpcy5pdGVtc1tTdGF0aWNEYXRhLndvbGZQb3MuaW5kZXhdICsgdGhpcy5pdGVtc1tTdGF0aWNEYXRhLnNoZWVwUG9zLmluZGV4XSA9PT0gMikgcmV0dXJuIFtTdGF0aWNEYXRhLndvbGZQb3MuaW5kZXgsIFN0YXRpY0RhdGEuc2hlZXBQb3MuaW5kZXhdO1xyXG4gICAgaWYgKHRoaXMuaXRlbXNbU3RhdGljRGF0YS5zaGVlcFBvcy5pbmRleF0gKyB0aGlzLml0ZW1zW1N0YXRpY0RhdGEuY2FiYmFnZVBvcy5pbmRleF0gPT09IDIpIHJldHVybiBbU3RhdGljRGF0YS5zaGVlcFBvcy5pbmRleCwgU3RhdGljRGF0YS5jYWJiYWdlUG9zLmluZGV4XTtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufSIsImltcG9ydCB7IHVpIH0gZnJvbSAnLi91aS9sYXlhTWF4VUknO1xyXG5pbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nO1xyXG5pbXBvcnQgQm9hdCBmcm9tICcuL0JvYXQnO1xyXG5pbXBvcnQgU3RhdGljRGF0YSBmcm9tICcuL1N0YXRpY0RhdGEnO1xyXG5pbXBvcnQgUml2ZXJCYW5rIGZyb20gJy4vUml2ZXJCYW5rJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmlwdCBleHRlbmRzIHVpLkJhY2tHcm91bmRVSSB7XHJcbiAgcHJpdmF0ZSBpdGVtczogQXJyYXk8SXRlbT4gPSBuZXcgQXJyYXk8SXRlbT4oKTtcclxuICBwcml2YXRlIGJvYXQ6IEJvYXQgPSBuZXcgQm9hdCh0aGlzLmJvYXRTcHJpdGUpO1xyXG4gIHByaXZhdGUgcml2ZXJCYW5rczogQXJyYXk8Uml2ZXJCYW5rPjtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5pbml0QWN0b3JzKCk7XHJcbiAgICB0aGlzLmJpbmRHb0V2ZW50KCk7XHJcbiAgfVxyXG5cclxuICAvLyAg5Yid5aeL5YyW54u844CB576K5ZKM5Y235b+D6I+c5a6e5L6LXHJcbiAgaW5pdEFjdG9ycygpOiB2b2lkIHtcclxuICAgIHRoaXMucml2ZXJCYW5rcyA9IFtcclxuICAgICAgbmV3IFJpdmVyQmFuayhbMSwgMSwgMV0pLFxyXG4gICAgICBuZXcgUml2ZXJCYW5rKFswLCAwLCAwXSksXHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMuaXRlbXMucHVzaChuZXcgSXRlbSh0aGlzLndvbGYsICd3b2xmUG9zJywgdGhpcy5ib2F0LCB0aGlzLnJpdmVyQmFua3MpKTtcclxuICAgIHRoaXMuaXRlbXMucHVzaChuZXcgSXRlbSh0aGlzLnNoZWVwLCAnc2hlZXBQb3MnLCB0aGlzLmJvYXQsIHRoaXMucml2ZXJCYW5rcykpO1xyXG4gICAgdGhpcy5pdGVtcy5wdXNoKG5ldyBJdGVtKHRoaXMuY2FiYmFnZSwgJ2NhYmJhZ2VQb3MnLCB0aGlzLmJvYXQsIHRoaXMucml2ZXJCYW5rcykpO1xyXG4gIH1cclxuXHJcbiAgLy8gIOe7keWumkdP54K55Ye75LqL5Lu2XHJcbiAgYmluZEdvRXZlbnQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdvLm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTiwgdGhpcywgdGhpcy5nb2dvZ28pO1xyXG4gIH1cclxuXHJcbiAgLy8gIOWHuuWPke+8gVxyXG4gIGdvZ29nbygpOiB2b2lkIHtcclxuICAgIC8vICDpmpDol4/pvKDmoIdcclxuICAgIExheWEuTW91c2UuaGlkZSgpO1xyXG4gICAgLy8g56Gu5a6a6KaB5Yik5pat6YKj6L655bK455qE5oOF5Ya1XHJcbiAgICBjb25zdCBiYW5rSW5kZXg6IG51bWJlciA9IHRoaXMuYm9hdC5nZXRTcHJpdGUoKS54ID09PSBTdGF0aWNEYXRhLmJvYXQubGVmdC54XHJcbiAgICAgID8gU3RhdGljRGF0YS5pbmRleC5MRUZUX0JBTktcclxuICAgICAgOiBTdGF0aWNEYXRhLmluZGV4LlJJR0hUX0JBTktcclxuXHJcbiAgICBjb25zdCBlYXRBcnIgPSB0aGlzLnJpdmVyQmFua3NbYmFua0luZGV4XS5FYXRPck5vdCgpO1xyXG4gICAgaWYgKGVhdEFycikgeyAgLy8gIOWmguaenOWPkeeUn+S6huWQg+S6i+S7tlxyXG4gICAgICBjb25zdCBlYXRvciA9IHRoaXMuaXRlbXNbZWF0QXJyWzBdXTtcclxuICAgICAgY29uc3QgZm9vZCA9IHRoaXMuaXRlbXNbZWF0QXJyWzFdXVxyXG5cclxuICAgICAgLy8gIOWFiOenu+WKqOWGjeWQg+S4nOilv1xyXG4gICAgICAvLyB0aGlzLmJvYXQubW92ZUJvYXQoZmFsc2UpO1xyXG4gICAgICB0aGlzLm1vdmVCb2F0KHRoaXMuYm9hdC5tb3ZlQm9hdChmYWxzZSksIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZWF0KGVhdG9yLCBmb29kKTtcclxuICAgICAgfSkpO1xyXG4gICAgfSBlbHNlIHsgIC8vICDlkKbliJlcclxuICAgICAgLy8gdGhpcy5ib2F0Lm1vdmVCb2F0KCk7XHJcbiAgICAgIHRoaXMubW92ZUJvYXQodGhpcy5ib2F0Lm1vdmVCb2F0KCksIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG4gICAgICAgIExheWEuTW91c2Uuc2hvdygpO1xyXG4gICAgICB9KSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAg6Ii556e75YqoXHJcbiAgbW92ZUJvYXQoeyBib2F0UG9zLCBwYXNzYWdlUG9zIH0sIG5leHQ6IExheWEuSGFuZGxlciA9IG51bGwpOiB2b2lkIHtcclxuICAgIC8vICDoiLnnp7vliqhcclxuICAgIExheWEuVHdlZW4udG8oXHJcbiAgICAgIHRoaXMuYm9hdC5nZXRTcHJpdGUoKSxcclxuICAgICAgYm9hdFBvcyxcclxuICAgICAgMjAwMCxcclxuICAgICk7XHJcblxyXG4gICAgLy8gIGl0ZW3np7vliqhcclxuICAgIGlmICh0aGlzLmJvYXQuZ2V0UGFzc2FnZSgpKSB7XHJcbiAgICAgIExheWEuVHdlZW4udG8oXHJcbiAgICAgICAgdGhpcy5ib2F0LmdldFBhc3NhZ2UoKS5nZXRTcHJpdGUoKSxcclxuICAgICAgICBwYXNzYWdlUG9zLFxyXG4gICAgICAgIDIwMDAsXHJcbiAgICAgICAgbnVsbCxcclxuICAgICAgICBuZXh0LFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8g5ZCD5Lic6KW/55qE5Yqo5L2cXHJcbiAgZWF0KGVhdG9yOiBJdGVtLCBmb29kOiBJdGVtLCBuZXh0OiBGdW5jdGlvbiA9IG51bGwpOiB2b2lkIHtcclxuICAgIExheWEuVHdlZW4udG8oXHJcbiAgICAgIGVhdG9yLmdldFNwcml0ZSgpLFxyXG4gICAgICB7XHJcbiAgICAgICAgeDogZm9vZC5nZXRTcHJpdGUoKS54LFxyXG4gICAgICAgIHk6IGZvb2QuZ2V0U3ByaXRlKCkueSxcclxuICAgICAgfSxcclxuICAgICAgMTAwMCxcclxuICAgICAgbnVsbCxcclxuICAgICAgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XHJcbiAgICAgICAgZm9vZC5nZXRTcHJpdGUoKS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgLy8gbmV4dCgpO1xyXG4gICAgICB9KSxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvLyAg6Lez6LeD55qE5Yqo5L2cXHJcbiAganVtcChqdW1wZXI6IEl0ZW0sIHsgY2FuSnVtcCwgcG9zWCwgcG9zWSwgcm9sbEZsYWcgfSk6IHZvaWQge1xyXG4gICAgaWYgKGNhbkp1bXApIHtcclxuICAgICAgTGF5YS5Ud2Vlbi50byhcclxuICAgICAgICBqdW1wZXIuZ2V0U3ByaXRlKCksXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgeDogcG9zWCxcclxuICAgICAgICAgIHk6IHBvc1ksXHJcbiAgICAgICAgICByb3RhdGlvbjogMzYwICogcm9sbEZsYWcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAyMDAwLFxyXG4gICAgICAgIExheWEuRWFzZS5iYWNrSW5PdXQsXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBjYWJiYWdlUG9zOiB7XHJcbiAgICBsZWZ0OiB7XHJcbiAgICAgIHg6IDEwLFxyXG4gICAgICB5OiAxNjQsXHJcbiAgICB9LFxyXG4gICAgcmlnaHQ6IHtcclxuICAgICAgeDogODc5LFxyXG4gICAgICB5OiAxNjQsXHJcbiAgICB9LFxyXG4gICAgaW5kZXg6IDIsXHJcbiAgfSxcclxuXHJcbiAgc2hlZXBQb3M6IHtcclxuICAgIGxlZnQ6IHtcclxuICAgICAgeDogODgsXHJcbiAgICAgIHk6IDE2NCxcclxuICAgIH0sXHJcbiAgICByaWdodDoge1xyXG4gICAgICB4OiA5NzAsXHJcbiAgICAgIHk6IDE2NCxcclxuICAgIH0sXHJcbiAgICBpbmRleDogMVxyXG4gIH0sXHJcblxyXG4gIHdvbGZQb3M6IHtcclxuICAgIGxlZnQ6IHtcclxuICAgICAgeDogMTYzLFxyXG4gICAgICB5OiAxNjQsXHJcbiAgICB9LFxyXG4gICAgcmlnaHQ6IHtcclxuICAgICAgeDogMTA1NyxcclxuICAgICAgeTogMTY0LFxyXG4gICAgfSxcclxuICAgIGluZGV4OiAwLFxyXG4gIH0sXHJcblxyXG4gIGxlZnRSaXZlckJhbmtQb3M6IHtcclxuICAgIHg6IDQ2NCxcclxuICAgIHk6IDE3MyxcclxuICB9LFxyXG5cclxuICByaWdodFJpdmVyQmFua1Bvczoge1xyXG4gICAgeDogNzcxLFxyXG4gICAgeTogMTczLFxyXG4gIH0sXHJcblxyXG4gIGJvYXQ6IHtcclxuICAgIGxlZnQ6IHtcclxuICAgICAgeDogMjgyLFxyXG4gICAgICB5OiAxMjAsXHJcbiAgICB9LFxyXG4gICAgcmlnaHQ6IHtcclxuICAgICAgeDogNTg5LFxyXG4gICAgICB5OiAxMjAsXHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIGluZGV4OiB7XHJcbiAgICBXT0xGOiAwLFxyXG4gICAgU0hFRVA6IDEsXHJcbiAgICBDQUJCQUdFOiAyLFxyXG4gICAgTEVGVF9CQU5LOiAwLFxyXG4gICAgUklHSFRfQkFOSzogMSxcclxuICB9LFxyXG59XHJcbiIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xuaW1wb3J0IFZpZXc9TGF5YS5WaWV3O1xyXG5pbXBvcnQgRGlhbG9nPUxheWEuRGlhbG9nO1xyXG5pbXBvcnQgU2NlbmU9TGF5YS5TY2VuZTtcbnZhciBSRUc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xuZXhwb3J0IG1vZHVsZSB1aSB7XHJcbiAgICBleHBvcnQgY2xhc3MgQmFja0dyb3VuZFVJIGV4dGVuZHMgTGF5YS5TY2VuZSB7XHJcblx0XHRwdWJsaWMgY2FiYmFnZTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc2hlZXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHdvbGY6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJvYXRTcHJpdGU6TGF5YS5Cb3g7XG5cdFx0cHVibGljIGdvOkxheWEuU3ByaXRlO1xuICAgICAgICBwdWJsaWMgc3RhdGljICB1aVZpZXc6YW55ID17XCJ0eXBlXCI6XCJTY2VuZVwiLFwicHJvcHNcIjp7XCJ3aWR0aFwiOjExMzYsXCJoZWlnaHRcIjo2NDB9LFwiY29tcElkXCI6MixcImNoaWxkXCI6W3tcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MjE1LFwieFwiOjAsXCJ3aWR0aFwiOjI1MSxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlcmJhbmsucG5nXCIsXCJoZWlnaHRcIjo0Mjd9LFwiY29tcElkXCI6NTh9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6NjQwLFwieFwiOjg2NixcIndpZHRoXCI6NDIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyYmFuay5wbmdcIixcInJvdGF0aW9uXCI6LTkwLFwiaGVpZ2h0XCI6MjcxfSxcImNvbXBJZFwiOjY1fSx7XCJ0eXBlXCI6XCJCb3hcIixcInByb3BzXCI6e1wieVwiOjI1MyxcInhcIjoyNTF9LFwiY29tcElkXCI6NjgsXCJjaGlsZFwiOlt7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjEzMyxcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTBcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjozfSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjEzMyxcInhcIjoxMjMsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0xXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NX0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoxMzMsXCJ4XCI6MjQ2LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtMlwiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjZ9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MTMzLFwieFwiOjM2OSxcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTNcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo3fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjEzMyxcInhcIjo0OTIsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW00XCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6OH0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTBcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo0N30se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInhcIjoxMjMsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0xXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NDh9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ4XCI6MjQ2LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtMlwiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjQ5fSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieFwiOjM2OSxcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTNcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo1MH0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInhcIjo0OTIsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW00XCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NTF9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MjY2LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtMFwiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjYwfSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjI2NixcInhcIjoxMjMsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW0xXCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NjF9LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MjY2LFwieFwiOjI0NixcIndpZHRoXCI6MTIzLFwidGV4dHVyZVwiOlwiYWN0b3JzL3JpdmVyLnBuZ1wiLFwibmFtZVwiOlwiaXRlbTJcIixcImhlaWdodFwiOjEyM30sXCJjb21wSWRcIjo2Mn0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoyNjYsXCJ4XCI6MzY5LFwid2lkdGhcIjoxMjMsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvcml2ZXIucG5nXCIsXCJuYW1lXCI6XCJpdGVtM1wiLFwiaGVpZ2h0XCI6MTIzfSxcImNvbXBJZFwiOjYzfSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjI2NixcInhcIjo0OTIsXCJ3aWR0aFwiOjEyMyxcInRleHR1cmVcIjpcImFjdG9ycy9yaXZlci5wbmdcIixcIm5hbWVcIjpcIml0ZW00XCIsXCJoZWlnaHRcIjoxMjN9LFwiY29tcElkXCI6NjR9XX0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoxNjQsXCJ4XCI6MTAsXCJ3aWR0aFwiOjU4LFwidmFyXCI6XCJjYWJiYWdlXCIsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvY2FiYmFnZS5wbmdcIixcImhlaWdodFwiOjU4fSxcImNvbXBJZFwiOjcyfSx7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wieVwiOjE2NCxcInhcIjo4OCxcIndpZHRoXCI6NTgsXCJ2YXJcIjpcInNoZWVwXCIsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvc2hlZXAucG5nXCIsXCJoZWlnaHRcIjo1OH0sXCJjb21wSWRcIjo3MH0se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoxNjQsXCJ4XCI6MTYzLFwid2lkdGhcIjo1OCxcInZhclwiOlwid29sZlwiLFwidGV4dHVyZVwiOlwiYWN0b3JzL3dvbGYucG5nXCIsXCJoZWlnaHRcIjo1OH0sXCJjb21wSWRcIjo3MX0se1widHlwZVwiOlwiQm94XCIsXCJwcm9wc1wiOntcInlcIjoxMjAsXCJ4XCI6MjgyLFwidmFyXCI6XCJib2F0U3ByaXRlXCJ9LFwiY29tcElkXCI6NzMsXCJjaGlsZFwiOlt7XCJ0eXBlXCI6XCJTcHJpdGVcIixcInByb3BzXCI6e1wid2lkdGhcIjoyNjEsXCJ0ZXh0dXJlXCI6XCJhY3RvcnMvYm9hdC5wbmdcIixcImhlaWdodFwiOjE5MH0sXCJjb21wSWRcIjo2N30se1widHlwZVwiOlwiU3ByaXRlXCIsXCJwcm9wc1wiOntcInlcIjoyMSxcInhcIjoxMTUsXCJ3aWR0aFwiOjg3LFwidGV4dHVyZVwiOlwiYWN0b3JzL2Zhcm1lci5wbmdcIixcImhlaWdodFwiOjg3fSxcImNvbXBJZFwiOjY5fV19LHtcInR5cGVcIjpcIlNwcml0ZVwiLFwicHJvcHNcIjp7XCJ5XCI6MzYsXCJ4XCI6NTE2LjUsXCJ3aWR0aFwiOjg0LFwidmFyXCI6XCJnb1wiLFwidGV4dHVyZVwiOlwiYWN0b3JzL2dvLnBuZ1wiLFwiaGVpZ2h0XCI6ODR9LFwiY29tcElkXCI6NzR9XSxcImxvYWRMaXN0XCI6W1wiYWN0b3JzL3JpdmVyYmFuay5wbmdcIixcImFjdG9ycy9yaXZlci5wbmdcIixcImFjdG9ycy9jYWJiYWdlLnBuZ1wiLFwiYWN0b3JzL3NoZWVwLnBuZ1wiLFwiYWN0b3JzL3dvbGYucG5nXCIsXCJhY3RvcnMvYm9hdC5wbmdcIixcImFjdG9ycy9mYXJtZXIucG5nXCIsXCJhY3RvcnMvZ28ucG5nXCJdLFwibG9hZExpc3QzRFwiOltdfTtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVmlldyhCYWNrR3JvdW5kVUkudWlWaWV3KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBSRUcoXCJ1aS5CYWNrR3JvdW5kVUlcIixCYWNrR3JvdW5kVUkpO1xyXG59XHIiXX0=
