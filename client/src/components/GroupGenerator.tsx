import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, Plus, Shuffle, Users, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Group {
  id: number;
  name: string;
  members: string[];
}

export default function GroupGenerator() {
  const [names, setNames] = useState<string[]>(() => {
    const saved = localStorage.getItem("group-names");
    return saved ? JSON.parse(saved) : [
      "雷蒙", "柚子", "Notion", "Lifehacker", "工具人", "生產力", 
      "設計師", "工程師", "產品經理", "行銷", "業務", "客服"
    ];
  });

  useEffect(() => {
    localStorage.setItem("group-names", JSON.stringify(names));
  }, [names]);
  const [newName, setNewName] = useState("");
  const [groupSize, setGroupSize] = useState(3);
  const [groupCount, setGroupCount] = useState(4);
  const [mode, setMode] = useState<"by-size" | "by-count">("by-size");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultGroups, setResultGroups] = useState<Group[]>([]);

  const addName = () => {
    if (newName.trim()) {
      setNames([...names, newName.trim()]);
      setNewName("");
    }
  };

  const removeName = (index: number) => {
    const newNames = [...names];
    newNames.splice(index, 1);
    setNames(newNames);
  };

  const handleBulkInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const newNames = text.split(/[\n,]+/).map(s => s.trim()).filter(s => s);
    if (newNames.length > 0) {
      setNames(newNames);
    }
  };

  const generateGroups = () => {
    if (names.length < 2) {
      alert("請至少輸入兩個名字");
      return;
    }

    setIsGenerating(true);
    setResultGroups([]);

    // Shuffle names
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const groups: Group[] = [];

    if (mode === "by-size") {
      const numGroups = Math.ceil(shuffled.length / groupSize);
      for (let i = 0; i < numGroups; i++) {
        groups.push({
          id: i + 1,
          name: `第 ${i + 1} 組`,
          members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
        });
      }
    } else {
      // by-count
      const size = Math.floor(shuffled.length / groupCount);
      const remainder = shuffled.length % groupCount;
      let startIndex = 0;

      for (let i = 0; i < groupCount; i++) {
        // Distribute remainder one by one to the first few groups
        const currentSize = size + (i < remainder ? 1 : 0);
        if (currentSize > 0) {
          groups.push({
            id: i + 1,
            name: `第 ${i + 1} 組`,
            members: shuffled.slice(startIndex, startIndex + currentSize)
          });
          startIndex += currentSize;
        }
      }
    }

    // Animation simulation
    setTimeout(() => {
      setIsGenerating(false);
      setResultGroups(groups);
      triggerConfetti();
    }, 1500);
  };

  const triggerConfetti = () => {
    const duration = 2000; // 縮短為 2 秒
    const end = Date.now() + duration;
    const confettiColors = ["#21A4B1", "#E77E47", "#F1C40F", "#9B59B6", "#E74C3C", "#1ABC9C", "#3498DB", "#2ECC71"]; // 多彩色

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: confettiColors
      });
      confetti({
        particleCount: 3,
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Settings Panel */}
      <Card className="lg:col-span-4 border-none shadow-md h-full">
        <CardHeader>
          <CardTitle>分組設定</CardTitle>
          <CardDescription>輸入名單並選擇分組方式</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>分組模式</Label>
            <RadioGroup defaultValue="by-size" value={mode} onValueChange={(v) => setMode(v as any)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="by-size" id="by-size" />
                <Label htmlFor="by-size">每組幾人</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="by-count" id="by-count" />
                <Label htmlFor="by-count">分成幾組</Label>
              </div>
            </RadioGroup>

            {mode === "by-size" ? (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label>每組人數</Label>
                <Input 
                  type="number" 
                  min={1} 
                  value={groupSize} 
                  onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))} 
                />
                <p className="text-xs text-muted-foreground">
                  預計分成 {Math.ceil(names.length / groupSize)} 組
                </p>
              </div>
            ) : (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label>組數</Label>
                <Input 
                  type="number" 
                  min={1} 
                  value={groupCount} 
                  onChange={(e) => setGroupCount(Math.max(1, parseInt(e.target.value) || 1))} 
                />
                <p className="text-xs text-muted-foreground">
                  平均每組約 {Math.floor(names.length / groupCount)} 人
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <Label>名單列表 ({names.length} 人)</Label>
              <Button variant="ghost" size="sm" onClick={() => setNames([])} className="h-6 text-xs text-destructive hover:text-destructive">
                清空
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addName()}
                placeholder="輸入名字..."
                className="flex-1"
              />
              <Button onClick={addName} size="icon" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">批次輸入（換行分隔）</Label>
              <Textarea 
                placeholder="貼上名單..."
                className="h-20 text-sm"
                onChange={handleBulkInput}
              />
            </div>

            <div className="max-h-[200px] overflow-y-auto space-y-1 pr-2">
              {names.map((name, index) => (
                <div key={index} className="flex items-center justify-between px-3 py-1.5 bg-muted/50 rounded text-sm group">
                  <span className="truncate">{name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => removeName(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={generateGroups} 
            disabled={isGenerating || names.length < 2}
            className="w-full text-lg font-bold shadow-md hover:shadow-lg transition-all"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Shuffle className="animate-spin w-4 h-4" /> 分組中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" /> 開始分組
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result Panel */}
      <div className="lg:col-span-8">
        {resultGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {resultGroups.map((group, idx) => (
              <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary opacity-80" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {group.name}
                    <span className="text-xs font-normal px-2 py-1 bg-muted rounded-full text-muted-foreground">
                      {group.members.length} 人
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {group.members.map((member, mIdx) => (
                      <li key={mIdx} className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {member.charAt(0)}
                        </div>
                        {member}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm min-h-[400px] flex flex-col justify-center items-center">
            <CardContent className="p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-muted-foreground">
                {isGenerating ? "正在隨機分配..." : "準備好分組了嗎？"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {isGenerating 
                  ? "系統正在計算最佳組合，請稍候..." 
                  : "在左側輸入名單並設定分組規則，點擊按鈕即可快速產生隨機分組結果。"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
