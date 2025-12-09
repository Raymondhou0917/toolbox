import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Shuffle, Plus, Check, X, Pencil, RotateCcw } from "lucide-react";
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
  "#E91E63", // Pink
  "#00BCD4", // Cyan
];

interface ListGroup {
  id: string | number;
  name: string;
  items: string[];
}

export default function Wheel() {
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
  
  // 新增：中獎後移除獲獎者選項
  const [removeWinnerAfterSpin, setRemoveWinnerAfterSpin] = useState(() => {
    const saved = localStorage.getItem("wheel-remove-winner");
    return saved === "true";
  });

  // 儲存到 localStorage
  useEffect(() => {
    localStorage.setItem("wheel-list-groups", JSON.stringify(listGroups));
  }, [listGroups]);

  useEffect(() => {
    localStorage.setItem("wheel-active-group", String(activeGroupId));
  }, [activeGroupId]);

  useEffect(() => {
    localStorage.setItem("wheel-remove-winner", String(removeWinnerAfterSpin));
  }, [removeWinnerAfterSpin]);

  // 取得當前選中的名單組
  const activeGroup = listGroups.find(g => g.id === activeGroupId) || listGroups[0];
  const items = activeGroup?.items || [];

  // 取得預設名單（用於重置功能）
  const getDefaultItems = () => {
    const defaultGroup = DEFAULT_LIST_GROUPS.find(g => g.id === activeGroupId);
    return defaultGroup?.items || [];
  };

  // 檢查當前名單是否與預設不同（用於顯示重置按鈕）
  const hasChanges = () => {
    const defaultItems = getDefaultItems();
    if (defaultItems.length === 0) return false; // 自訂名單組不顯示重置
    if (items.length !== defaultItems.length) return true;
    return items.some((item, index) => item !== defaultItems[index]);
  };

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

    // 繪製扇形
    // 指針在右側（0度位置）
    // 扇形從 rotation 開始繪製，第 i 個扇形的範圍是 [rotation + i*sliceAngle, rotation + (i+1)*sliceAngle]
    // 指針指向 0 度，所以要找出哪個扇形包含 0 度
    
    items.forEach((item, index) => {
      const startAngle = rotation + index * sliceAngle;
      const endAngle = rotation + (index + 1) * sliceAngle;

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

      // Draw text - 根據選項數量調整字體大小
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#FFFFFF";
      
      // 動態調整字體大小
      const fontSize = items.length > 8 ? 24 : items.length > 6 ? 28 : 32;
      ctx.font = `bold ${fontSize}px 'Noto Sans TC'`;
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 4;
      
      // 動態調整文字截斷長度
      const maxLength = items.length > 8 ? 5 : items.length > 6 ? 6 : 8;
      const displayText = item.length > maxLength ? item.slice(0, maxLength) + "..." : item;
      ctx.fillText(displayText, radius - 30, 8);
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

    // Draw pointer (在右側) - 改用更明顯的指針
    const pointerSize = 35;
    ctx.save();
    ctx.translate(centerX + radius + 5, centerY);
    
    // 指針外框
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(-pointerSize, -pointerSize/2 - 3);
    ctx.lineTo(-pointerSize, pointerSize/2 + 3);
    ctx.closePath();
    ctx.fillStyle = "#1a1a1a";
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.fill();
    
    // 指針內部
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-pointerSize + 5, -pointerSize/2 + 2);
    ctx.lineTo(-pointerSize + 5, pointerSize/2 - 2);
    ctx.closePath();
    ctx.fillStyle = "#E74C3C";
    ctx.shadowBlur = 0;
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

    const spinDuration = 4000; // 增加到 4 秒讓動畫更流暢
    const spinRevolutions = 6; // 轉 6 圈
    const targetIndex = Math.floor(Math.random() * items.length);
    const sliceAngle = (2 * Math.PI) / items.length;
    
    // 計算目標旋轉角度
    // 扇形 i 的範圍是 [rotation + i*sliceAngle, rotation + (i+1)*sliceAngle]
    // 指針在 0 度位置
    // 要讓扇形 i 的中心對準 0 度，需要：
    // rotation + i*sliceAngle + sliceAngle/2 = 0 (mod 2π)
    // rotation = -i*sliceAngle - sliceAngle/2
    // 
    // 最終旋轉角度 = 起始角度 + 轉動量
    // 轉動量 = spinRevolutions * 2π + (目標角度 - 當前角度)
    
    const currentNormalizedRotation = rotation % (2 * Math.PI);
    const targetAngle = -targetIndex * sliceAngle - sliceAngle / 2;
    
    // 確保順時針旋轉（正向）
    let angleDiff = targetAngle - currentNormalizedRotation;
    // 標準化到 [-π, π]
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    // 確保是正向旋轉（加上完整圈數）
    if (angleDiff > 0) angleDiff -= 2 * Math.PI;
    
    // 加入小範圍隨機偏移（在扇形中心附近）
    const randomOffset = (Math.random() - 0.5) * sliceAngle * 0.5;
    const totalRotation = spinRevolutions * 2 * Math.PI + Math.abs(angleDiff) + randomOffset;

    const startTime = performance.now();
    const startRotation = rotation;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // 使用更平滑的 ease-out 曲線
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentRotation = startRotation - totalRotation * ease;
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setWinner(items[targetIndex]);
        triggerConfetti();
        
        // 如果啟用了移除獲獎者選項，則移除該項目
        if (removeWinnerAfterSpin) {
          setTimeout(() => {
            removeWinnerFromList(targetIndex);
          }, 1500);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const removeWinnerFromList = (index: number) => {
    const newItems = [...items];
    const removedItem = newItems.splice(index, 1)[0];
    updateItems(newItems);
    toast.info(`已將「${removedItem}」從名單中移除`);
  };

  // 重置名單功能
  const resetToDefault = () => {
    const defaultItems = getDefaultItems();
    if (defaultItems.length > 0) {
      updateItems([...defaultItems]);
      toast.success("已重置為預設名單");
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [COLORS[0], COLORS[1]]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: [COLORS[0], COLORS[1]]
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
          
          {/* 中獎後移除獲獎者選項 */}
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="remove-winner" 
              checked={removeWinnerAfterSpin}
              onCheckedChange={(checked) => setRemoveWinnerAfterSpin(checked === true)}
            />
            <label 
              htmlFor="remove-winner" 
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              中獎後自動移除獲獎者
            </label>
          </div>
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
            {hasChanges() && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetToDefault}
                className="flex-1 text-primary hover:text-primary"
              >
                <RotateCcw className="mr-2 h-3 w-3" /> 重置名單
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => deleteGroup(activeGroupId)} 
              className="flex-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-3 w-3" /> 刪除名單組
            </Button>
          </div>

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
