import { EM_PoolType } from "../Data/PoolData";
import BaseAction from "../Base/BaseAction";
export default class PoolManager
{
    private  constructor(){};
    private static s_inst: PoolManager = null;
    private m_mapPool: {[nType: number]: cc.NodePool} = null;
    private _prefabCache: {[nType: number]: cc.Prefab} = null;

    public static instance() : PoolManager
    {
        if (PoolManager.s_inst == null)
        {
            PoolManager.s_inst = new PoolManager();
        }
        return PoolManager.s_inst;
    }

    public init()
    {
        this.m_mapPool = {};
        this._prefabCache = {};
    }

    public destory()
    {
        for (const key in this.m_mapPool) {
            this.m_mapPool[key].clear();
        }
        this.m_mapPool = null;
        this._prefabCache = null;
        PoolManager.s_inst = null;
    }

    public createNode(eType: EM_PoolType): cc.Node
    {
        let pool: cc.NodePool = this.m_mapPool[eType];
        if (!pool)
        {
            pool = new cc.NodePool();
            this.m_mapPool[eType] = pool;
        }

        if (pool.size() > 0)
        {
            return pool.get();
        }
        else
        {
            return cc.instantiate(this._prefabCache[eType]);
        }
    }

    public destroyNode(eType: EM_PoolType, node: cc.Node): void
    {
        let tempAction = node.getComponent(BaseAction);
        if(tempAction){
            tempAction.hide();
        }

        this.m_mapPool[eType].put(node);
    }
    //预加载资源
    public PushPrefabCache(type: number,num:number, prefab: cc.Prefab)
    {
        this._prefabCache[type] = prefab;

        let nodes: cc.Node[] = [];
        for (let index = 0; index < num; index++) {
            nodes.push(this.createNode(type));
        }
        let len = nodes.length;
        while (len--){
            this.destroyNode(type, nodes[len]);
        }
    }
}
