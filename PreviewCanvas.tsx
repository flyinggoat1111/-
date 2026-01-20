
import React from 'react';
import { QuotationState } from '../types';

interface Props {
  state: QuotationState;
}

const PreviewCanvas: React.FC<Props> = ({ state }) => {
  const itemBlocks = state.blocks.filter(b => b.type === 'items');
  const textBlocks = state.blocks.filter(b => b.type === 'text');

  let subtotal = 0;
  itemBlocks.forEach(block => {
    block.items?.forEach(item => {
      subtotal += item.price * item.qty;
    });
  });
  
  const taxable = Math.max(0, subtotal - state.discount);
  const taxAmount = Math.round(taxable * state.taxRate);
  const grandTotal = taxable + taxAmount;

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed === '') return <div key={i} className="h-1.5" />;
      
      let content;
      if (line.startsWith('# ')) {
        content = <h3 className="text-[15px] font-bold mt-10 mb-5 text-zinc-900 border-b-2 border-zinc-200 pb-3 uppercase tracking-tight">{line.replace('# ', '')}</h3>;
      } else if (line.startsWith('## ')) {
        content = <h4 className="text-[12.5px] font-bold mt-7 mb-3 text-zinc-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: state.themeColor }}></span>
          {line.replace('## ', '')}
        </h4>;
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const textOnly = line.substring(2);
        content = <li className="ml-5 list-disc text-[10.5px] text-zinc-700 leading-[1.8] mb-2 pl-1">{textOnly}</li>;
      } else if (/^\d+\./.test(line)) {
        const textOnly = line.replace(/^\d+\.\s*/, '');
        content = <li className="ml-5 list-disc text-[10.5px] text-zinc-700 leading-[1.8] mb-2 pl-1">{textOnly}</li>;
      } else {
        content = <p className="text-[10.5px] text-zinc-700 leading-[1.8] mb-2">{line}</p>;
      }

      return <div key={i} className="avoid-break">{content}</div>;
    });
  };

  return (
    <div className="a4-container">
      {/* 報價單主頁 */}
      <div className="a4-page-content">
        <header className="flex justify-between items-start mb-12 pb-8 border-b-2 border-zinc-200 avoid-break">
          <div className="-ml-1"> {/* 向左偏移約 4px 以對齊下方的 Q */}
            <div className="flex items-baseline mb-1.5">
              <h1 
                className="text-3xl font-bold tracking-tight" 
                style={{ 
                  color: state.themeColor,
                  letterSpacing: '0.05em' // 增加字距
                }}
              >
                {state.company.name}報價單
              </h1>
            </div>
            <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-600 uppercase pl-1">QUOTATION SHEET</p>
          </div>
          <div className="text-right">
            <div className="space-y-1 mt-1">
              <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest flex justify-end gap-2">
                <span>No.</span>
                <span className="text-zinc-900 font-bold">{state.quoteNo}</span>
              </p>
              <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest flex justify-end gap-2">
                <span>Date.</span>
                <span className="text-zinc-900 font-bold">{state.date.replace(/-/g, '/')}</span>
              </p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-16 mb-12 avoid-break">
          <div className="space-y-4">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 border-b border-zinc-200 pb-1.5">Provider / 我方資訊</h4>
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-zinc-800">{state.company.name}</p>
              <div className="space-y-1 text-[10px] text-zinc-700 font-medium">
                <p className="flex gap-2"><span>統編</span> <span className="text-zinc-900 font-mono">{state.company.taxId}</span></p>
                <p className="flex gap-2"><span>電話</span> <span className="text-zinc-900 font-mono">{state.company.phone}</span></p>
                <p className="flex gap-2"><span>帳戶</span> <span className="text-zinc-900 font-mono leading-relaxed">{state.company.remittance}</span></p>
              </div>
            </div>
          </div>
          <div className="space-y-4 text-right">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 border-b border-zinc-200 pb-1.5">Client / 客戶資訊</h4>
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-zinc-900">{state.client.name || '客戶對象名稱'}</p>
              <div className="space-y-1 text-[10px] text-zinc-700 font-medium">
                {state.client.taxId && <p className="flex justify-end gap-2"><span>統編</span> <span className="text-zinc-900 font-mono">{state.client.taxId}</span></p>}
                {state.client.contact && <p className="flex justify-end gap-2"><span>聯絡人</span> <span className="text-zinc-900">{state.client.contact}</span></p>}
                {state.client.email && <p className="flex justify-end gap-2"><span>Email</span> <span className="text-zinc-900 font-mono">{state.client.email}</span></p>}
              </div>
            </div>
          </div>
        </section>

        <section className="flex-1">
          {itemBlocks.map((block) => (
            <div key={block.id} className="mb-10 avoid-break">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] bg-zinc-50 px-5 py-2.5 mb-4 border-l-4 text-zinc-700 flex justify-between items-center" style={{ borderColor: state.themeColor }}>
                <span>{block.title}</span>
                <span className="text-[8px] opacity-70 font-mono tracking-normal">Service Details</span>
              </h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-300">
                    <th className="text-left py-4 px-2 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">項目 Description</th>
                    <th className="text-center py-4 px-2 text-[9px] font-bold text-zinc-600 uppercase tracking-widest w-32">單價 Rate</th>
                    <th className="text-center py-4 px-2 text-[9px] font-bold text-zinc-600 uppercase tracking-widest w-24">數量 Qty</th>
                    <th className="text-right py-4 px-2 text-[9px] font-bold text-zinc-600 uppercase tracking-widest w-28">合計 Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {block.items?.map((item) => (
                    <tr key={item.id} className="avoid-break group hover:bg-zinc-50/50 transition-colors">
                      <td className="py-5 px-2">
                        <p className="text-[12px] font-bold text-zinc-800 leading-snug">{item.name}</p>
                        {item.description && <p className="text-[9px] text-zinc-600 mt-1">{item.description}</p>}
                      </td>
                      <td className="py-5 px-2 text-center text-[11px] text-zinc-700 font-mono whitespace-nowrap">${item.price.toLocaleString()}</td>
                      <td className="py-5 px-2 text-center text-[11px] text-zinc-700 whitespace-nowrap">{item.qty} {item.unit}</td>
                      <td className="py-5 px-2 text-right text-[12px] font-bold text-zinc-900 font-mono">${(item.price * item.qty).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>

        <section className="pt-10 border-t border-zinc-200 mt-auto avoid-break">
          <div className="flex justify-between items-end gap-12">
            <div className="flex-1 flex gap-12">
               <div className="text-center group">
                  <div className="w-36 h-20 border-b border-zinc-200 mb-3 relative flex items-center justify-center bg-zinc-50/50">
                    {state.company.stampUrl && (
                      <img 
                        src={state.company.stampUrl} 
                        className="absolute h-24 w-auto object-contain opacity-95 mix-blend-multiply" 
                        style={{ transform: 'none' }}
                      />
                    )}
                  </div>
                  <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em]">AUTHORIZED SIGNATURE</p>
               </div>
               <div className="text-center">
                  <div className="w-36 h-20 border-b border-zinc-200 mb-3 bg-zinc-50/50"></div>
                  <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em]">CLIENT SIGNATURE</p>
               </div>
            </div>

            <div className="w-72 space-y-3">
              <div className="flex justify-between items-center text-[10px] text-zinc-700 font-bold px-1">
                <span className="uppercase tracking-widest text-zinc-600">Subtotal</span>
                <span className="font-mono text-zinc-800">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-zinc-700 font-bold px-1 border-b border-zinc-200 pb-2">
                <span className="uppercase tracking-widest text-zinc-600">Tax ({ (state.taxRate * 100).toFixed(0) }%)</span>
                <span className="font-mono text-zinc-800">${taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 px-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-600">Total</span>
                <span className="text-3xl font-bold font-mono leading-none" style={{ color: state.themeColor }}>
                  ${grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 條款附錄頁 */}
      {textBlocks.map((block, bIndex) => (
        <React.Fragment key={block.id}>
          <div className="a4-page-content">
            <header className="flex justify-between items-center mb-8 pb-5 border-b border-zinc-200 avoid-break">
              <h2 className="text-[10px] font-bold text-zinc-600 tracking-[0.3em] uppercase">
                條款與細則 / Terms & Conditions
              </h2>
              <span className="text-[9px] text-zinc-600 font-mono font-bold">PAGE {bIndex + 2}</span>
            </header>
            
            <div className="flex-1">
              <div className="avoid-break mb-4">
                <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-3">
                  <span className="w-2 h-6" style={{ backgroundColor: state.themeColor }}></span>
                  {block.title}
                </h3>
              </div>
              
              <div className="space-y-1">
                {renderMarkdown(block.content || '')}
              </div>
            </div>

            <footer className="mt-auto pt-8 border-t border-zinc-100 text-center avoid-break">
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em]">End of Document</p>
            </footer>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PreviewCanvas;
