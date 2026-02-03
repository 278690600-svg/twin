
import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Compass, 
  MoveDown, 
  ArrowUpRight, 
  Ship, 
  Activity, 
  Settings, 
  Home, 
  LayoutDashboard,
  BarChart3,
  Map as MapIcon,
  Layers,
  Search,
  Maximize2,
  Camera,
  Box
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// --- Configuration: 可以在这里轻松更换中间的图片或场景 ---
const VIEWS = [
  { 
    id: 'bridge-main', 
    name: '主桥全景', 
    url: 'https://img0.baidu.com/it/u=4210279222,2517888681&fm=253&app=138&f=JPEG?w=1423&h=800',
    type: 'image' 
  },
  { 
    id: 'bridge-side', 
    name: '引桥监控', 
    url: 'https://images.unsplash.com/photo-1513200833630-9759714346c4?auto=format&fit=crop&q=80&w=1920',
    type: 'image' 
  },
  { 
    id: 'bridge-detail', 
    name: '索塔细部', 
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920',
    type: 'image' 
  }
];

// --- Types ---
interface EnvStat {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
}

interface StructuralStat {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
}

// --- Mock Data ---
const TRAFFIC_TREND_DATA = [
  { time: '01-17', flow: 79 },
  { time: '01-18', flow: 56 },
  { time: '01-19', flow: 57 },
  { time: '01-20', flow: 50 },
  { time: '01-21', flow: 44 },
  { time: '01-22', flow: 42 },
  { time: '01-23', flow: 55 },
];

const VESSEL_DATA = [
  { name: '货运', value: 104, color: '#0ea5e9' },
  { name: '客运', value: 24, color: '#f59e0b' },
  { name: '其他', value: 32, color: '#94a3b8' },
];

const ENV_STATS: EnvStat[] = [
  { label: '温度', value: '22.6', unit: '°C', icon: <Thermometer size={16} /> },
  { label: '湿度', value: '65.2', unit: '%', icon: <Droplets size={16} /> },
  { label: '水平风向', value: '东南', unit: '', icon: <Compass size={16} /> },
  { label: '水平风速', value: '12.4', unit: 'km/h', icon: <Wind size={16} /> },
  { label: '风攻击角', value: '2.1', unit: '°', icon: <ArrowUpRight size={16} /> },
];

const STRUCTURAL_STATS: StructuralStat[] = [
  { label: '结构温度', value: 22.6, unit: '°C', icon: <Thermometer size={14} /> },
  { label: '结构应变', value: 154, unit: 'με', icon: <Activity size={14} /> },
  { label: '结构沉降', value: 12.1, unit: 'mm', icon: <Layers size={14} /> },
  { label: '管节张合量', value: 0.45, unit: 'mm', icon: <Maximize2 size={14} /> },
  { label: '塔顶震动', value: 4.2, unit: 'mg', icon: <Activity size={14} /> },
  { label: '桥架位移', value: 8.3, unit: 'mm', icon: <Layers size={14} /> },
];

// --- Sub-Components ---

const StatPanel: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`glass-panel rounded-lg p-4 mb-4 border-t-2 border-t-sky-500/50 ${className}`}>
    <div className="flex items-center justify-between mb-3 border-b border-sky-500/10 pb-2">
      <h3 className="text-sky-400 font-bold text-sm tracking-wider flex items-center gap-2">
        <div className="w-1 h-3 bg-sky-500 rounded-full" />
        {title}
      </h3>
      <div className="flex gap-1 opacity-50">
        <div className="w-1 h-1 bg-sky-500 rounded-full" />
        <div className="w-1 h-1 bg-sky-500 rounded-full" />
      </div>
    </div>
    {children}
  </div>
);

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [activeView, setActiveView] = useState(VIEWS[0]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex font-sans">
      
      {/* 1. 核心视图背景 (中间的画面的底层显示) */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url('${activeView.url}')`,
            filter: 'brightness(0.6) contrast(1.1) saturate(0.8)'
          }}
        />
        {/* 覆盖一层科技感扫描线或光栅 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)] opacity-80" />
      </div>

      {/* 2. 左侧主导航栏 */}
      <div className="relative z-10 w-20 h-full flex flex-col items-center py-6 glass-panel border-r border-sky-500/20">
        <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center mb-10 blue-glow cursor-pointer hover:bg-sky-500 transition-all shadow-[0_0_20px_rgba(14,165,233,0.5)]">
          <Home className="text-white" size={24} />
        </div>
        <div className="flex flex-col gap-8 flex-grow">
          {[
            { icon: <LayoutDashboard />, label: '综合态势', active: true },
            { icon: <MapIcon />, label: '电子地图' },
            { icon: <BarChart3 />, label: '数据报表' },
            { icon: <Layers />, label: '专题监测' }
          ].map((item, i) => (
            <div key={i} className={`group flex flex-col items-center cursor-pointer ${item.active ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
              <div className={`p-3 rounded-xl transition-all ${item.active ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 group-hover:bg-sky-500/10'}`}>
                {/* Fixed the 'size' property error by casting to React.ReactElement<any> */}
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24 })}
              </div>
              <span className="text-[10px] mt-1 font-bold tracking-tighter whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <Settings className="text-sky-800 hover:text-sky-400 transition-colors cursor-pointer" size={24} />
        </div>
      </div>

      {/* 3. 右侧及顶部信息层 */}
      <div className="relative z-10 flex-grow flex flex-col p-4 overflow-hidden">
        
        {/* 顶部标题及环境数据面板 */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
             <div className="glass-panel px-6 py-2 rounded-lg flex items-center gap-4 border-l-4 border-l-sky-500">
               <span className="text-sky-400 font-bold tracking-widest text-xl tech-font text-glow uppercase">
                 Bridge Digital Twin Dashboard
               </span>
               <div className="h-4 w-px bg-sky-500/30 mx-2" />
               <span className="text-sky-100/60 text-sm font-medium">路海大桥监测中心</span>
             </div>
          </div>
          
          <div className="flex gap-2">
            {ENV_STATS.map((stat, idx) => (
              <div key={idx} className="glass-panel px-3 py-2 rounded-lg flex items-center gap-3 border-b border-sky-500/10 min-w-[110px]">
                <div className="text-sky-500 bg-sky-500/10 p-1.5 rounded-lg">{stat.icon}</div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{stat.label}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-sky-100 tech-font">{stat.value}</span>
                    <span className="text-[9px] text-sky-400/40">{stat.unit}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="glass-panel px-4 py-2 rounded-lg tech-font text-sky-300 text-sm flex items-center justify-center min-w-[100px] border-b border-sky-500/40">
              {time.toLocaleTimeString([], { hour12: false })}
            </div>
          </div>
        </div>

        {/* 内容网格 */}
        <div className="flex-grow grid grid-cols-12 gap-6 overflow-hidden">
          
          {/* 中间主要操作区 (可以在这里放额外的叠加图层) */}
          <div className="col-span-8 relative flex flex-col">
             
             {/* 视角切换器: 方便直接切换中间的画面 */}
             <div className="mt-auto mb-6 flex gap-3 p-1.5 rounded-2xl glass-panel self-center border border-sky-500/20 backdrop-blur-xl">
                {VIEWS.map((view) => (
                  <button 
                    key={view.id}
                    onClick={() => setActiveView(view)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeView.id === view.id ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]' : 'text-sky-400/60 hover:text-sky-400 hover:bg-sky-500/10'}`}
                  >
                    {view.id.includes('detail') ? <Camera size={14} /> : <Box size={14} />}
                    {view.name}
                  </button>
                ))}
             </div>

             {/* 中间底部辅助控制栏 */}
             <div className="mx-auto mb-4 flex gap-1 glass-panel p-1 rounded-full border border-sky-500/30">
                {[Search, Compass, Layers, Activity, Maximize2].map((Icon, idx) => (
                  <button key={idx} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-sky-500/30 transition-colors text-sky-300">
                    <Icon size={18} />
                  </button>
                ))}
             </div>
          </div>

          {/* 右侧数据侧边栏 */}
          <div className="col-span-4 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
            
            {/* 今日流量统计 */}
            <StatPanel title="今日通行流量">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel bg-sky-950/20 p-4 rounded-xl border-sky-400/5">
                  <div className="flex items-center gap-2 mb-2 text-emerald-400">
                    <ArrowUpRight size={16} />
                    <span className="text-[11px] font-bold text-slate-400 uppercase">上行流量</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold tech-font text-sky-100">4,821</span>
                    <span className="text-[10px] text-slate-500">PCU</span>
                  </div>
                </div>
                <div className="glass-panel bg-sky-950/20 p-4 rounded-xl border-sky-400/5">
                  <div className="flex items-center gap-2 mb-2 text-amber-400">
                    <MoveDown size={16} />
                    <span className="text-[11px] font-bold text-slate-400 uppercase">下行流量</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold tech-font text-sky-100">3,954</span>
                    <span className="text-[10px] text-slate-500">PCU</span>
                  </div>
                </div>
              </div>
            </StatPanel>

            {/* 流量趋势图 */}
            <StatPanel title="实时车流趋势 (24h)">
              <div className="h-44 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={TRAFFIC_TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(56, 189, 248, 0.05)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', borderColor: '#0ea5e9', border: '1px solid #0ea5e944' }} />
                    <Line type="monotone" dataKey="flow" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </StatPanel>

            {/* 结构参数指标 */}
            <StatPanel title="结构关键指标" className="flex-grow">
              <div className="grid grid-cols-2 gap-2">
                {STRUCTURAL_STATS.map((stat, idx) => (
                  <div key={idx} className="glass-panel bg-slate-900/30 p-2.5 rounded-lg flex flex-col border-sky-500/5 hover:border-sky-500/20 transition-all cursor-default group">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sky-500 group-hover:scale-110 transition-transform">{stat.icon}</span>
                      <span className="text-[10px] text-slate-400 font-medium truncate uppercase">{stat.label}</span>
                    </div>
                    <div className="flex items-baseline justify-between mt-auto">
                      <span className="text-sm font-bold tech-font text-sky-500">{stat.value}</span>
                      <span className="text-[9px] text-slate-600 font-bold">{stat.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </StatPanel>

            {/* 船舶统计环形图 */}
            <StatPanel title="海域航行监管" className="mb-0">
              <div className="flex items-center h-32">
                <div className="w-2/5 h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={VESSEL_DATA} cx="50%" cy="50%" innerRadius={28} outerRadius={42} paddingAngle={5} dataKey="value">
                        {VESSEL_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[9px] text-slate-500">VESSELS</span>
                    <span className="text-sm font-bold tech-font text-sky-100">160</span>
                  </div>
                </div>
                <div className="w-3/5 grid grid-cols-1 gap-1 pl-4">
                  {VESSEL_DATA.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-sky-100 font-bold tech-font">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </StatPanel>

          </div>
        </div>
      </div>
      
      {/* 装饰性元素 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
         <div className="text-[10px] text-sky-900/50 font-mono tracking-widest uppercase">
           Secure Connection Established // Protocol: Digital-Twin-v2.0
         </div>
      </div>
    </div>
  );
};

export default App;
