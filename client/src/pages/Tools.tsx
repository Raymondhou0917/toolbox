import { Link } from "wouter";
import { Timer, Disc, ArrowRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  isExternal?: boolean;
}

function ToolCard({ title, description, icon, href, color, isExternal }: ToolCardProps) {
  const CardContent = (
    <div 
      className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col"
    >
      {/* 背景裝飾 */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        style={{ background: color }}
      />
      
      {/* Icon */}
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${color}15` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Arrow */}
      <div className="mt-6 flex items-center gap-2 text-primary font-medium">
        <span>開始使用</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} className="block">
        {CardContent}
      </a>
    );
  }

  return (
    <Link href={href} className="block">
      {CardContent}
    </Link>
  );
}

export default function Tools() {
  const tools = [
    {
      title: "抽獎工具集",
      description: "包含幸運輪盤、數字抽獎、配對分組三種功能，支援自訂名單、雲端同步，讓抽獎過程充滿樂趣與期待。",
      icon: <Disc className="w-8 h-8" />,
      href: "/lottery",
      color: "#21A4B1",
    },
    {
      title: "倒數計時器",
      description: "簡潔優雅的課程倒數計時器，支援休息、開場、練習三種模式，可嵌入 Notion 或 OBS 使用。",
      icon: <Timer className="w-8 h-8" />,
      href: "/timer/index.html",
      color: "#E77E47",
      isExternal: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 flex flex-col font-sans">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="https://image.lifehacker.tw/lifehacker-pic/logo-raymond-30.png" 
                alt="雷蒙三十 Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">雷蒙三十工具集</h1>
              <p className="text-xs text-muted-foreground font-medium">聰明工作，好好生活</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="https://raymondhouch.com/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">關於我們</a>
            <a href="https://lifehacker.tw" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">更多資源、課程</a>
            <a href="https://portaly.cc/notionhacker" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">社群媒體</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-16 md:py-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              免費使用
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
              超級個體的<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">實用小工具</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              精心設計的數位工具，幫助你在工作與生活中更有效率。<br className="hidden md:block" />
              簡單、美觀、好用。
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              更多工具持續開發中...
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm py-8 mt-auto relative z-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <img 
                src="https://image.lifehacker.tw/lifehacker-pic/power by lifehacker.png" 
                alt="Power by Lifehacker" 
                className="h-6 opacity-80 hover:opacity-100 transition-opacity"
              />
              <span>© 2025 雷蒙三十</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://portaly.cc/notionhacker" target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 group">
              <span>作者：侯智薰（雷蒙）</span>
              <span className="block w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://raymondhouch.com/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house"><path d="M15 21v-8a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
