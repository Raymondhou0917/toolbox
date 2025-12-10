import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Wheel from "@/components/Wheel";
import NumberDraw from "@/components/NumberDraw";
import GroupGenerator from "@/components/GroupGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Disc, Hash, Users, LogIn, LogOut, User, Timer, LayoutGrid } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("wheel");

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden font-sans">
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
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="https://image.lifehacker.tw/lifehacker-pic/logo-raymond-30.png" 
                  alt="雷蒙三十 Logo" 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-disc text-primary"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>';
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">抽獎工具集</h1>
                <p className="text-xs text-muted-foreground font-medium">雷蒙三十｜聰明工作，好好生活</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-4 text-sm font-medium text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4" />
                所有工具
              </Link>
              <a href="/timer/index.html" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Timer className="w-4 h-4" />
                倒數計時器
              </a>
              <a href="https://raymondhouch.com/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">關於我們</a>
            </nav>
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden md:block font-medium text-foreground">{user?.name || '使用者'}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => logout()}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline ml-1">登出</span>
                </Button>
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-primary hover:bg-primary/90"
              >
                <LogIn className="w-4 h-4 mr-1" />
                登入
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8 md:py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              讓運氣決定你的<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">下一步</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              用好看的小工具，解決你在抽獎、互動式活動上的問題！
            </p>
          </div>

          <Tabs defaultValue="wheel" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center sticky top-[73px] z-40 py-4">
              <TabsList className="grid w-full max-w-md grid-cols-3 p-1 bg-white/80 backdrop-blur-md shadow-lg rounded-full border border-white/20 h-auto">
                <TabsTrigger 
                  value="wheel" 
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-bold py-3 px-4 flex items-center justify-center gap-2"
                >
                  <Disc className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">輪盤</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="number" 
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-bold py-3 px-4 flex items-center justify-center gap-2"
                >
                  <Hash className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">數字</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="group" 
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-bold py-3 px-4 flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">分組</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="min-h-[500px]">
              <TabsContent value="wheel" className="animate-in fade-in zoom-in-95 duration-500 mt-0">
                <Wheel />
              </TabsContent>

              <TabsContent value="number" className="animate-in fade-in zoom-in-95 duration-500 mt-0">
                <NumberDraw />
              </TabsContent>

              <TabsContent value="group" className="animate-in fade-in zoom-in-95 duration-500 mt-0">
                <GroupGenerator />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm py-8 mt-auto relative z-10">
        <div className="container">
          {/* 工具切換連結 */}
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
            <span className="text-muted-foreground">其他工具：</span>
            <a 
              href="/timer/index.html" 
              className="text-primary hover:text-secondary transition-colors font-medium flex items-center gap-1.5"
            >
              <Timer className="w-4 h-4" />
              倒數計時器
            </a>
            <Link 
              href="/" 
              className="text-primary hover:text-secondary transition-colors font-medium flex items-center gap-1.5"
            >
              <LayoutGrid className="w-4 h-4" />
              所有工具
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
              <a href="https://raymondhouch.com/" target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 group">
                <span>侯智薰（雷蒙）</span>
                <span className="block w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="https://portaly.cc/notionhacker" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house"><path d="M15 21v-8a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
