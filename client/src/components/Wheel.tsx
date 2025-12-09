import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash2, Shuffle, Save, Plus, Check, X, Pencil, History, RotateCcw } from "lucide-react";
import { toast } from "sonner";

// 預設名單組
const DEFAULT_LIST_GROUPS = [
  {
    id: "raymond30",
    name: "雷蒙三十",
    items: ["柚子", "雷蒙", "Lifehacker", "黑客島民", "超級個體", "一人公司"],
  },
  {
    id: "fitness",
    name: "健身鍛鍊",
    items: ["練胸", "練腿", "練背", "核心訓練", "有氧"],
  },
  {
    id: "destiny",
    name: "命運之輪",
    items: [
      "分享一個秘密",
      "模仿一個人",
      "唱一首歌",
      "說一個笑話",
      "打電話給朋友",
      "做10個伏地挺身",
      "學動物叫",
      "說出最尷尬的事",
      "比手畫腳",
      "真心話時間",
    ],
  },
];

const COLORS = [
  "#21A4B1", // Brand Primary
  "#E77E47", // Brand Secondary
  "#2C3E50", // Dark Blue
  "#E74C3C", // Red
  "#F1C40F", // Yellow
  "#9B59B6", // Purple
  "#1ABC9C", // Teal
  "#34495E", // Dark Grey
];

interface ListGroup {
  id: string | number;
  name: string;
  items: string[];
  isCloud?: boolean;
}

export default function Wheel() {
  const { user, isAuthenticated } = useAuth();
  
  // 從 localStorage 載入名單組
  const [listGroups, setListGroups] = useState<ListGroup[]>(() => {
    const saved = localStorage.getItem("wheel-list-groups");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_LIST_GROUPS;
      }
    }
    return DEFAULT_LIST_GROUPS;
  });

  const [activeGroupId, setActiveGroupId] = useState<string | number>(() => {
    const saved = localStorage.getItem("wheel-active-group");
    return saved || "raymond30";
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [removeWinnerAfterSpin, setRemoveWinnerAfterSpin] = useState(() => {
    const saved = localStorage.getItem("wheel-remove-winner");
    return saved === "true";
  });

  // 抽獎歷史紀錄
  const [spinHistory, setSpinHistory] = useState<{name: string; time: Date}[]>(() => {
    const saved = localStorage.getItem("wheel-spin-history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((h: {name: string; time: string}) => ({...h, time: new Date(h.time)}));
      } catch {
        return [];
      }
    }
    return [];
  });

  // 雲端同步
  const { data: cloudLists, refetch: refetchCloudLists } = trpc.lists.getByType.useQuery(
    { listType: "wheel" },
    { enabled: isAuthenticated }
  );

  const createListMutation = trpc.lists.create.useMutation({
    onSuccess: () => {
      refetchCloudLists();
      toast.success("名單已儲存到雲端");
    },
    onError: () => {
      toast.error("儲存失敗，請稍後再試");
    },
  });

  const updateListMutation = trpc.lists.update.useMutation({
    onSuccess: () => {
      refetchCloudLists();
      toast.success("名單已更新");
    },
  });

  const deleteListMutation = trpc.lists.delete.useMutation({
    onSuccess: () => {
      refetchCloudLists();
      toast.success("名單已刪除");
    },
  });

  // 儲存到 localStorage
  useEffect(() => {
    localStorage.setItem("wheel-list-groups", JSON.stringify(listGroups));
  }, [listGroups]);

  useEffect(() => {
    localStorage.setItem("wheel-remove-winner", String(removeWinnerAfterSpin));
  }, [removeWinnerAfterSpin]);

  useEffect(() => {
    localStorage.setItem("wheel-spin-history", JSON.stringify(spinHistory));
  }, [spinHistory]);

  useEffect(() => {
    localStorage.setItem("wheel-active-group", String(activeGroupId));
  }, [activeGroupId]);

  // 取得當前選中的名單組
  const activeGroup = listGroups.find(g => g.id === activeGroupId) || listGroups[0];
  const items = activeGroup?.items || [];

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const sliceAngle = items.length > 0 ? (2 * Math.PI) / items.length : 2 * Math.PI;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer glow/shadow
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();

    if (items.length === 0) {
      ctx.fillStyle = "#ccc";
      ctx.font = "bold 32px 'Noto Sans TC'";
      ctx.textAlign = "center";
      ctx.fillText("請新增項目", centerX, centerY);
      return;
    }

    items.forEach((item, index) => {
      const startAngle = index * sliceAngle + rotation;
      const endAngle = (index + 1) * sliceAngle + rotation;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      const baseColor = COLORS[index % COLORS.length];
      ctx.fillStyle = baseColor;
      ctx.fill();
      
      ctx.strokeStyle = "white";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px 'Noto Sans TC'";
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 4;
      ctx.fillText(item.length > 8 ? item.slice(0, 8) + "..." : item, radius - 40, 10);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pointer
    const pointerSize = 40;
    ctx.save();
    ctx.translate(centerX + radius + 10, centerY);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-pointerSize, -pointerSize/2);
    ctx.lineTo(-pointerSize, pointerSize/2);
    ctx.closePath();
    ctx.fillStyle = "#333";
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    drawWheel();
  }, [items, rotation]);

  const spin = () => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    const spinDuration = 3000;
    const spinRevolutions = 5;
    const targetIndex = Math.floor(Math.random() * items.length);
    const sliceAngle = (2 * Math.PI) / items.length;
    const targetRotation = spinRevolutions * 2 * Math.PI - (targetIndex * sliceAngle) - (sliceAngle / 2);
    const randomOffset = (Math.random() - 0.5) * (sliceAngle * 0.8);
    const finalRotation = targetRotation + randomOffset;

    const startTime = performance.now();
    const startRotation = rotation % (2 * Math.PI);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + finalRotation * ease;
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const winnerName = items[targetIndex];
        setWinner(winnerName);
        triggerConfetti();
        
        // 新增到歷史紀錄
        setSpinHistory(prev => {
          const newHistory = [{name: winnerName, time: new Date()}, ...prev].slice(0, 10);
          return newHistory;
        });
        
        // 如果啟用了移除獲獎者功能
        if (removeWinnerAfterSpin) {
          setTimeout(() => {
            const newItems = items.filter((_, i) => i !== targetIndex);
            updateItems(newItems);
            toast.info(`已將「${winnerName}」從名單中移除`);
          }, 1500);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const triggerConfetti = () => {
    const duration = 2000; // 縮短為 2 秒
    const end = Date.now() + duration;
    const confettiColors = ["#21A4B1", "#E77E47", "#F1C40F", "#9B59B6", "#E74C3C", "#1ABC9C", "#3498DB", "#2ECC71"]; // 多彩色

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: confettiColors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: confettiColors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const updateItems = (newItems: string[]) => {
    setListGroups(prev => prev.map(g => 
      g.id === activeGroupId ? { ...g, items: newItems } : g
    ));
  };

  const shuffleItems = () => {
    updateItems([...items].sort(() => Math.random() - 0.5));
  };

  const handleBulkInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const newItems = text.split(/[\n,]+/).map(s => s.trim()).filter(s => s);
    if (newItems.length > 0) {
      updateItems(newItems);
    }
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    updateItems(newItems);
  };

  const saveToCloud = async () => {
    if (!isAuthenticated) {
      toast.error("請先登入以儲存名單到雲端");
      return;
    }

    const existingCloudList = cloudLists?.find(l => l.name === activeGroup.name);
    
    if (existingCloudList) {
      updateListMutation.mutate({
        id: existingCloudList.id,
        items: items,
      });
    } else {
      createListMutation.mutate({
        listType: "wheel",
        name: activeGroup.name,
        items: items,
      });
    }
  };

  const addNewGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroup: ListGroup = {
      id: `custom-${Date.now()}`,
      name: newGroupName.trim(),
      items: [],
    };
    
    setListGroups(prev => [...prev, newGroup]);
    setActiveGroupId(newGroup.id);
    setNewGroupName("");
    setIsAddingNew(false);
    toast.success("已新增名單組");
  };

  const deleteGroup = (groupId: string | number) => {
    if (listGroups.length <= 1) {
      toast.error("至少需要保留一個名單組");
      return;
    }
    
    setListGroups(prev => prev.filter(g => g.id !== groupId));
    if (activeGroupId === groupId) {
      setActiveGroupId(listGroups[0].id);
    }
    toast.success("已刪除名單組");
  };

  const startEditingName = () => {
    setEditingName(activeGroup.name);
    setIsEditing(true);
  };

  const saveEditingName = () => {
    if (!editingName.trim()) return;
    
    setListGroups(prev => prev.map(g => 
      g.id === activeGroupId ? { ...g, name: editingName.trim() } : g
    ));
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">幸運輪盤</CardTitle>
          <CardDescription>選擇名單組，點擊開始抽獎！</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={800}
              className="max-w-full h-auto w-[400px] drop-shadow-2xl"
            />
          </div>
          
          <div className="mt-8 text-center h-16">
            {winner ? (
              <div className="animate-in zoom-in duration-500">
                <p className="text-sm text-muted-foreground mb-1">恭喜獲得</p>
                <p className="text-3xl font-black text-secondary">{winner}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-lg">{isSpinning ? "抽獎中..." : "準備好運氣了嗎？"}</p>
            )}
          </div>

          <Button 
            size="lg" 
            onClick={spin} 
            disabled={isSpinning || items.length < 2}
            className="mt-4 w-full max-w-xs text-lg font-bold shadow-md hover:shadow-lg transition-all"
          >
            {isSpinning ? "轉動中..." : "開始抽獎"}
          </Button>

          {/* 中獎後移除獲獎者勾選框 */}
          <div className="flex items-center gap-2 mt-4">
            <button
              id="remove-winner"
              onClick={() => setRemoveWinnerAfterSpin(!removeWinnerAfterSpin)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                removeWinnerAfterSpin 
                  ? "bg-primary border-primary text-white" 
                  : "border-muted-foreground/30 hover:border-primary"
              }`}
            >
              {removeWinnerAfterSpin && <Check className="w-3 h-3" />}
            </button>
            <label htmlFor="remove-winner" className="text-sm text-muted-foreground cursor-pointer">
              中獎後自動移除獲獎者
            </label>
          </div>

          {/* 抽獎歷史紀錄 */}
          {spinHistory.length > 0 && (
            <div className="mt-6 w-full max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <History className="w-4 h-4" />
                  抽獎歷史
                </div>
                <button
                  onClick={() => setSpinHistory([])}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  清除
                </button>
              </div>
              <div className="space-y-1 max-h-[150px] overflow-y-auto">
                {spinHistory.map((record, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-2 rounded-md text-sm ${
                      index === 0 ? "bg-secondary/10 border border-secondary/20" : "bg-muted/50"
                    }`}
                  >
                    <span className={`font-medium ${index === 0 ? "text-secondary" : "text-foreground"}`}>
                      {record.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {record.time.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>名單組</CardTitle>
              <CardDescription>選擇或建立常用名單</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 名單組選擇器 */}
          <div className="flex flex-wrap gap-2">
            {listGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeGroupId === group.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {group.name}
              </button>
            ))}
            {isAddingNew ? (
              <div className="flex items-center gap-1">
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNewGroup()}
                  placeholder="名稱..."
                  className="h-8 w-24 text-sm"
                  autoFocus
                />
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={addNewGroup}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsAddingNew(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingNew(true)}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-muted/50 hover:bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30 transition-all"
              >
                <Plus className="h-4 w-4 inline mr-1" />
                新增
              </button>
            )}
          </div>

          {/* 當前名單組標題 */}
          <div className="flex items-center justify-between border-b pb-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEditingName()}
                  className="h-8 w-40"
                  autoFocus
                />
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={saveEditingName}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{activeGroup?.name}</span>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={startEditingName}>
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
            <span className="text-sm text-muted-foreground">{items.length} 個項目</span>
          </div>

          {/* 批次輸入 */}
          <div className="space-y-2">
            <Label>編輯名單（用換行或逗號分隔）</Label>
            <Textarea 
              value={items.join("\n")}
              placeholder="例如：
雷蒙
柚子
Notion"
              className="h-32 font-mono text-sm"
              onChange={handleBulkInput}
            />
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shuffleItems} className="flex-1">
              <Shuffle className="mr-2 h-3 w-3" /> 打亂順序
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => deleteGroup(activeGroupId)} 
              className="flex-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-3 w-3" /> 刪除名單組
            </Button>
          </div>

          {/* 雲端儲存按鈕 */}
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={saveToCloud}
            disabled={!isAuthenticated || createListMutation.isPending || updateListMutation.isPending}
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            {isAuthenticated ? "儲存到雲端" : "登入後可儲存到雲端"}
          </Button>

          {/* 名單項目預覽 */}
          <div className="max-h-[200px] overflow-y-auto space-y-1 pr-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md group text-sm">
                <span className="font-medium truncate">{item}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                名單是空的，請在上方輸入項目
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
