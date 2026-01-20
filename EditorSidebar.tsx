
import React, { useRef } from 'react';
import { QuotationState, QuotationBlock, QuotationSubItem } from '../types';

const TERMS_TEMPLATES = {
  basic: `## 基礎規範
- 專案成片將存放於Google雲端或客戶提供之硬碟。
- 客戶最晚應於正式開拍前一天繳付報價單總金額50%款項至指定帳戶，已於開拍前協調者除外。
- 完稿交件後，客戶應在最晚一個月內將尾款匯款至指定帳戶。
- 項目執行階段，客戶若認為有修正之必要，將依備註條件執行修改。
- 我方得保存作品以備參考或未來教學、展示之用 ; 客戶方同意我方可將客戶列入我方客戶名單。`,
  video: `## 拍攝配置
- 單機作業：1 位攝影師
- 雙機作業：2 位攝影師 + 助理
## 後製剪輯流程
- 初剪：順剪、配樂、簡易標題
- 精剪：調光、混音、動態字卡
## 版本與修改次數
- 免費修改至第 2 版，超出每版酌收費用`,
  photo: `## 修圖與交件流程
- 拍攝後提供小圖預覽挑選精修。
- 確認精修清單後 3-5 日內交件。`,
  post: `## 後製規範
- 後製費用已包含 Acopy、Bcopy 製作及音樂版權費用。
- Acopy：初步順剪，含基本配樂與簡易標題配置。
- Bcopy：細部影像編修、調光、混音、動態字卡與字幕製作。

## 修改規則說明
- Acopy 提供至 D 版之內之修改（除我方製作疏漏外），D 版後如仍需調整，每版酌收新台幣 2,000 元。
- Bcopy 提供至 D 版之內之修改（除我方製作疏漏外），D 版後如仍需調整，每版酌收新台幣 1,000 元，且不得要求大幅度內容調整；若有實質性改動或大幅調整，費用將另行估算。
- Acopy 未經客戶確認定稿前，不進入 Bcopy 工作階段。`
};

const SERVICE_OPTIONS = [
  "動態拍攝", "動態拍攝_shorts", "平面攝影", "後期製作", "後期剪輯", 
  "訪談", "活動紀錄", "其他執行費用", "攝影助理", "多機拍攝", 
  "燈光與場務", "錄音 / 收音工程", "航拍 / 特攝", "剪接修改次數費用", 
  "調色與音效設計", "字幕翻譯 / 字卡設計", "封面與縮圖製作", 
  "企劃與腳本撰寫", "導演費", "場地租借 / 交通住宿", "行政與專案管理費"
];

interface Props {
  state: QuotationState;
  onUpdate: (key: keyof QuotationState, value: any) => void;
  onExport: () => void;
}

const EditorSidebar: React.FC<Props> = ({ state, onUpdate, onExport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addBlock = (type: 'items' | 'text') => {
    const newBlock: QuotationBlock = {
      id: `block-${Date.now()}`,
      title: type === 'items' ? '服務報價內容' : '補充說明與條款',
      type,
      items: type === 'items' ? [] : undefined,
      content: type === 'text' ? '## 新增規範\n- 這裡輸入條款內容' : undefined
    };
    onUpdate('blocks', [...state.blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<QuotationBlock>) => {
    onUpdate('blocks', state.blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    onUpdate('blocks', state.blocks.filter(b => b.id !== id));
  };

  const addSubItem = (blockId: string) => {
    const newItem: QuotationSubItem = {
      id: `item-${Date.now()}`,
      name: '',
      price: 0,
      qty: 1,
      unit: '式'
    };
    onUpdate('blocks', state.blocks.map(b => b.id === blockId ? { ...b, items: [...(b.items || []), newItem] } : b));
  };

  const applyTemplate = (blockId: string, templateKey: keyof typeof TERMS_TEMPLATES) => {
    updateBlock(blockId, { content: TERMS_TEMPLATES[templateKey] });
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate('company', { ...state.company, stampUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-[450px] h-full bg-zinc-900 flex flex-col border-r border-zinc-800 text-zinc-300 shadow-2xl z-20 overflow-hidden">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
        <h1 className="text-xl font-black text-white tracking-tighter">品熊報價引擎</h1>
        <input type="color" value={state.themeColor} onChange={(e) => onUpdate('themeColor', e.target.value)} className="w-8 h-8 rounded-full cursor-pointer border-2 border-white/20" title="自訂品牌色" />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 sidebar-scroll">
        <section className="space-y-4">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">公司資訊 Provider Details</label>
          <div className="space-y-3">
             <input 
              placeholder="公司名稱" 
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={state.company.name}
              onChange={(e) => onUpdate('company', { ...state.company, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="統編" className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm outline-none" value={state.company.taxId} onChange={(e) => onUpdate('company', { ...state.company, taxId: e.target.value })} />
              <input placeholder="電話" className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm outline-none" value={state.company.phone} onChange={(e) => onUpdate('company', { ...state.company, phone: e.target.value })} />
            </div>
            <input placeholder="匯款帳號資訊" className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm outline-none" value={state.company.remittance} onChange={(e) => onUpdate('company', { ...state.company, remittance: e.target.value })} />
            
            <div className="pt-2">
              <label className="text-[9px] text-zinc-500 block mb-2 uppercase font-bold">發票章 / 印章上傳 Seal Upload</label>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 py-2 rounded text-xs transition-colors"
                >
                  {state.company.stampUrl ? '更換印章圖片' : '上傳印章 (PNG/JPG)'}
                </button>
                {state.company.stampUrl && (
                  <button onClick={() => onUpdate('company', { ...state.company, stampUrl: '' })} className="text-xs text-red-500 hover:underline">移除</button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleStampUpload} />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">客戶資訊 Client Details</label>
          <div className="grid grid-cols-2 gap-3">
            <input 
              placeholder="客戶公司名稱" 
              className="col-span-2 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={state.client.name}
              onChange={(e) => onUpdate('client', { ...state.client, name: e.target.value })}
            />
            <input 
              placeholder="統一編號" 
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={state.client.taxId}
              onChange={(e) => onUpdate('client', { ...state.client, taxId: e.target.value })}
            />
            <input 
              placeholder="聯絡人" 
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={state.client.contact}
              onChange={(e) => onUpdate('client', { ...state.client, contact: e.target.value })}
            />
            <input 
              placeholder="Email" 
              className="col-span-2 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={state.client.email}
              onChange={(e) => onUpdate('client', { ...state.client, email: e.target.value })}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">編輯區塊 Blocks</label>
            <div className="flex gap-2">
              <button onClick={() => addBlock('items')} className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 hover:bg-blue-600/40">+ 報價項目</button>
              <button onClick={() => addBlock('text')} className="text-[10px] bg-zinc-700 text-zinc-300 px-2 py-1 rounded border border-zinc-600 hover:bg-zinc-600 transition-colors">+ 補充條款</button>
            </div>
          </div>

          {state.blocks.map((block) => (
            <div key={block.id} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 space-y-4 relative group">
              <button onClick={() => removeBlock(block.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">刪除</button>
              
              <input 
                className="w-full bg-transparent text-white font-bold text-sm border-b border-zinc-700 pb-1 outline-none focus:border-blue-500 transition-all"
                value={block.title}
                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                placeholder="輸入區塊標題"
              />

              {block.type === 'items' ? (
                <div className="space-y-3">
                  {block.items?.map((item, idx) => (
                    <div key={item.id} className="space-y-2 p-2 bg-zinc-900/50 rounded border border-zinc-700/30">
                      <div className="flex gap-2">
                        <select 
                          className="bg-zinc-800 border border-zinc-700 rounded px-1 py-1 text-[10px] text-blue-400 outline-none w-24"
                          onChange={(e) => {
                            if (e.target.value === "custom") return;
                            const newItems = [...(block.items || [])];
                            newItems[idx].name = e.target.value;
                            updateBlock(block.id, { items: newItems });
                          }}
                          value={SERVICE_OPTIONS.includes(item.name) ? item.name : "custom"}
                        >
                          <option value="custom">自訂...</option>
                          {SERVICE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <input className="flex-1 bg-transparent text-xs outline-none text-zinc-200 border-b border-transparent focus:border-zinc-600" placeholder="項目名稱" value={item.name} onChange={(e) => {
                          const newItems = [...(block.items || [])];
                          newItems[idx].name = e.target.value;
                          updateBlock(block.id, { items: newItems });
                        }} />
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1 relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] text-zinc-600">$</span>
                          <input type="number" className="w-full bg-zinc-800 text-[10px] rounded pl-5 pr-2 py-1 outline-none border border-transparent focus:border-zinc-600" value={item.price} onChange={(e) => {
                            const newItems = [...(block.items || [])];
                            newItems[idx].price = parseFloat(e.target.value) || 0;
                            updateBlock(block.id, { items: newItems });
                          }} />
                        </div>
                        <span className="text-[10px] text-zinc-600">×</span>
                        <input type="number" className="w-12 bg-zinc-800 text-[10px] rounded px-2 py-1 outline-none border border-transparent focus:border-zinc-600" value={item.qty} onChange={(e) => {
                          const newItems = [...(block.items || [])];
                          newItems[idx].qty = parseFloat(e.target.value) || 1;
                          updateBlock(block.id, { items: newItems });
                        }} />
                        <input className="w-12 bg-zinc-800 text-[10px] rounded px-1 text-center border border-transparent focus:border-zinc-600" value={item.unit} onChange={(e) => {
                          const newItems = [...(block.items || [])];
                          newItems[idx].unit = e.target.value;
                          updateBlock(block.id, { items: newItems });
                        }} />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addSubItem(block.id)} className="w-full py-2 border border-dashed border-zinc-700 rounded text-[10px] text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-all">+ 新增細項</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <select 
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] text-blue-400 outline-none"
                    onChange={(e) => applyTemplate(block.id, e.target.value as any)}
                    defaultValue=""
                  >
                    <option value="" disabled>快速帶入條款範本</option>
                    <option value="basic">基礎規範範本</option>
                    <option value="video">動態拍攝範本</option>
                    <option value="photo">平面拍攝範本</option>
                    <option value="post">後製規範範本</option>
                  </select>
                  <textarea 
                    className="w-full h-48 bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-zinc-400 outline-none focus:border-blue-500 font-mono sidebar-scroll"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  />
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">稅務與收款 Finance</label>
          <div className="grid grid-cols-2 gap-3">
            <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-2 text-xs outline-none" value={state.taxRate} onChange={(e) => onUpdate('taxRate', parseFloat(e.target.value))}>
              <option value={0}>免稅 0%</option>
              <option value={0.05}>營業稅 5%</option>
              <option value={0.1}>勞務 10%</option>
            </select>
            <input type="number" className="bg-zinc-800 border border-zinc-700 rounded px-2 py-2 text-xs outline-none focus:border-blue-500" placeholder="折扣" value={state.discount} onChange={(e) => onUpdate('discount', parseFloat(e.target.value) || 0)} />
          </div>
        </section>
      </div>

      <div className="p-6 bg-zinc-950/80 border-t border-zinc-800 space-y-3">
        <button 
          onClick={onExport}
          style={{ backgroundColor: state.themeColor }}
          className="w-full text-white font-black py-4 rounded-xl shadow-2xl hover:brightness-110 active:scale-95 transition-all"
        >
          GENERATE PDF 輸出報價單
        </button>
      </div>
    </aside>
  );
};

export default EditorSidebar;
