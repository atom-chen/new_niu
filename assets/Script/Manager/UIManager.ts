import { DataManager } from "./DataManager";
import { EM_UIType, EM_UI_Area } from "../Data/UIData";
import UIWarning from "../Base/UIWarning";

type OpenCallBack = (node: cc.Node) => void;
const ZORDER_Toast: number = 0xffff;
export const ZORDER_top: number = 9000;
export class UIManager {
    private constructor() { };
    private static s_inst: UIManager = null;
    private m_ndCanvas: cc.Node = null;
    private m_nOrder: number = 0;
    private m_szWindowLoading: EM_UIType[] = [];
    private m_uiNodes: { [id: number]: cc.Node } = {};           //存储已经显示过的UI
    public static instance(): UIManager {
        if (UIManager.s_inst == null) {
            UIManager.s_inst = new UIManager();
        }
        return UIManager.s_inst;
    }


    public destory() {
        this.closeAllWindow();
        UIManager.s_inst = null;
    }
    private clear() {
        this.m_nOrder = 0;
        this.m_szWindowLoading = [];
        this.m_uiNodes = {};
    }

    public initRootCanvas() {
        this.clear();
        this.m_ndCanvas = cc.director.getScene().getChildByName("Canvas");
    }
    public openWindow(eType: EM_UIType, openCallBack?: OpenCallBack, Order?: number): void {
        let nIndex: number = this.m_szWindowLoading.indexOf(eType);
        if (nIndex != -1) {
            return;
        }

        let node: cc.Node = this.getWindow(eType);
        if (node != null) {
            node.active = true;
            if (openCallBack != null) {
                openCallBack(node);
            }
            return;
        }

        let strName: string = DataManager.instance().ui.getUIInfo(eType);
        console.log(strName);
        let self = this;
        let order: number = -1;
        if (Order == null) {
            order = this.m_nOrder++;
        }
        else {
            order = Order;
        }
        this.m_szWindowLoading.push(eType);

        let area = DataManager.instance().ui.getUIArea(eType);
        let parentNode = this.m_ndCanvas;

        if (EM_UI_Area.eUA_BgFull == area) {
            parentNode = this.m_ndCanvas.getChildByName("BgFull");
        }
        else if (EM_UI_Area.eUA_FrontFull == area) {
            parentNode = this.m_ndCanvas.getChildByName("FrontFull");
        }
        else if (EM_UI_Area.eUA_SafeArea == area) {
            parentNode = this.m_ndCanvas.getChildByName("SafeArea");
        }

        cc.loader.loadRes("Prefab/" + strName, function (err, prefab) {
            if (null == parentNode || !parentNode.isValid) {
                return;
            }
            if (err) {
                console.error(`openWindow ${err} ----- ${strName}`);
            }
            let newNode: cc.Node = cc.instantiate(prefab);
            parentNode.addChild(newNode, order);
            let nIndex: number = self.m_szWindowLoading.indexOf(eType);
            self.m_szWindowLoading.splice(nIndex, 1);
            self.m_uiNodes[eType] = newNode;
            if (openCallBack != null) {
                openCallBack(newNode);
            }
        });
    }

    // public closeWindow(eType: EM_UIType): void
    // {
    //     let node: cc.Node = this.getWindow(eType);
    //     if (node != null)
    //     {
    //         node.active = false;
    //     }
    // }

    public closeWindow(id: number, isDestroy: boolean = false): void {
        let idex: number = this.m_szWindowLoading.indexOf(id);
        if (idex != -1) {
            this.m_szWindowLoading.splice(idex, 1);
        }

        let node: cc.Node = this.getWindow(id);
        if (node != null) {
            node.active = false;
        }

        if (node && isDestroy) {
            delete this.m_uiNodes[id];
            node && node.destroy();
        }
    }
    public getWindowScript<T extends cc.Component>(eType: EM_UIType, type: { prototype: T }): T {
        let node: cc.Node = this.getWindow(eType);
        if (node != null) {
            let t: T = node.getComponent(type);
            return t;
        }
        return null;
    }

    // public getWindow(eType: EM_UIType): cc.Node
    // {
    //     if (null == this.m_ndCanvas)
    //     {
    //         return;
    //     }
    //
    //     let strName: string = DataManager.instance().ui.getUIInfo(eType);
    //     let area = DataManager.instance().ui.getUIArea(eType);
    //     let parentNode = this.m_ndCanvas;
    //
    //     if (EM_UI_Area.eUA_FrontFull == area)
    //     {
    //         parentNode = this.m_ndCanvas.getChildByName("FrontFull");
    //     }
    //     else if (EM_UI_Area.eUA_SafeArea == area)
    //     {
    //         parentNode = this.m_ndCanvas.getChildByName("SafeArea");
    //     }
    //     else if (EM_UI_Area.eUA_BgFull == area)
    //     {
    //         parentNode = this.m_ndCanvas.getChildByName("BgFull");
    //     }
    //
    //     if (null == parentNode)
    //     {
    //         return;
    //     }
    //
    //     return parentNode.getChildByName(strName);
    // }
    public getWindow(id: number): cc.Node {
        let node = this.m_uiNodes[id];
        if (node && !node.isValid) {
            node = null;
            delete this.m_uiNodes[id];
        }

        return node;
    }
    // public closeAllWindow(): void
    // {
    //     let parentNode = this.m_ndCanvas.getChildByName("FrontFull");
    //     if (parentNode) {
    //         parentNode.removeAllChildren(true);
    //     }
    //
    //     parentNode = this.m_ndCanvas.getChildByName("SafeArea");
    //     if (parentNode) {
    //         parentNode.removeAllChildren(true);
    //     }
    // }

    public closeAllWindow(): void {
        this.m_nOrder = 0;
        this.m_szWindowLoading = [];

        for (const key in this.m_uiNodes) {
            if (this.m_uiNodes.hasOwnProperty(key)) {
                this.m_uiNodes[key].destroy();
            }
        }

        this.m_uiNodes = {};
    }

    public buildToast(text: string): void {
        if (null == this.m_ndCanvas) {
            console.error(`Toast with No Canvas: ${text}`);
            return;
        }

        this.openWindow(EM_UIType.eUT_Warning, (node: cc.Node) => {
            let uiWarning: UIWarning = node.getComponent(UIWarning);
            uiWarning.showWarning(text);
        }, ZORDER_Toast);
    }
}
