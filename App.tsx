
import React, { useState, useCallback } from 'react';
import { QuotationState } from './types';
import EditorSidebar from './components/EditorSidebar';
import PreviewCanvas from './components/PreviewCanvas';

const generateQuoteNo = () => {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `${dateStr}A`;
};

const App: React.FC = () => {
  const [state, setState] = useState<QuotationState>({
    blocks: [
      {
        id: 'block-1',
        title: '服務報價內容',
        type: 'items',
        items: [
          { id: 'item-1', name: '專案主視覺動態攝影', description: '', price: 18000, qty: 1, unit: '場' },
          { id: 'item-2', name: '後期非線性剪輯', description: '', price: 12000, qty: 1, unit: '式' }
        ]
      },
      {
        id: 'block-terms',
        title: '補充說明與條款',
        type: 'text',
        content: `## 基礎規範
- 專案成片將存放於Google雲端或客戶提供之硬碟。
- 客戶最晚應於正式開拍前一天繳付報價單總金額50%款項至指定帳戶，已於開拍前協調者除外。
- 完稿交件後，客戶應在最晚一個月內將尾款匯款至指定帳戶。
- 項目執行階段，客戶若認為有修正之必要，將依備註條件執行修改。
- 我方得保存作品以備參考或未來教學、展示之用 ; 客戶方同意我方可將客戶列入我方客戶名單。`
      }
    ],
    company: {
      name: '品熊影像有限公司',
      taxId: '60542481',
      phone: '0963-657-517',
      remittance: '(807) 190-018-0004384-9'
    },
    client: { 
      name: '', 
      taxId: '', 
      contact: '', 
      email: '' 
    },
    taxRate: 0.05,
    discount: 0,
    themeColor: 'rgb(235, 149, 0)',
    quoteNo: generateQuoteNo(),
    date: new Date().toISOString().split('T')[0]
  });

  const handleUpdate = useCallback((key: keyof QuotationState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleExportPDF = async () => {
    const element = document.getElementById('print-content');
    if (!element) return;
    
    element.classList.add('pdf-export-mode');

    // @ts-ignore
    const opt = {
      margin: 0,
      filename: `品熊影像有限公司報價單_${state.quoteNo}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 3, 
        useCORS: true, 
        letterRendering: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc: Document) => {
          const clonedEl = clonedDoc.getElementById('print-content');
          if (clonedEl) {
            clonedEl.style.margin = '0';
            clonedEl.style.padding = '0';
            clonedEl.style.width = '794px';
            clonedEl.style.display = 'block';
            clonedDoc.body.style.margin = '0';
            clonedDoc.body.style.padding = '0';
          }
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: ['css', 'legacy'] }
    };
    
    try {
      // @ts-ignore
      await html2pdf().from(element).set(opt).save();
    } finally {
      element.classList.remove('pdf-export-mode');
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 font-['Noto_Sans_TC']">
      <EditorSidebar 
        state={state} 
        onUpdate={handleUpdate} 
        onExport={handleExportPDF}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 to-zinc-950">
        <div id="print-content" className="w-full max-w-[210mm]">
          <PreviewCanvas state={state} />
        </div>
      </main>
    </div>
  );
};

export default App;
