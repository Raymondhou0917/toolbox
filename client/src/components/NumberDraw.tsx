import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Play, History } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NumberDraw() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<number[][]>([]);
  const [animationNumbers, setAnimationNumbers] = useState<number[]>([]);

  // Initialize animation numbers
  useEffect(() => {
    if (animationNumbers.length !== count) {
      setAnimationNumbers(Array(count).fill(min));
    }
  }, [count, min]);

  const draw = () => {
    if (isDrawing) return;
    
    // Validation
    if (min >= max) {
      alert("最小值必須小於最大值");
      return;
    }
    
    const rangeSize = max - min + 1;
    if (!allowRepeat && count > rangeSize) {
      alert(`在不重複的情況下，無法從 ${rangeSize} 個數字中抽出 ${count} 個數字`);
      return;
    }

    setIsDrawing(true);
    setCurrentNumbers([]);

    // Generate final numbers
    let results: number[] = [];
    if (allowRepeat) {
      for (let i = 0; i < count; i++) {
        results.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
    } else {
      const pool = Array.from({ length: rangeSize }, (_, i) => i + min);
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        results.push(pool[randomIndex]);
        pool.splice(randomIndex, 1);
      }
    }

    // Animation
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Generate random numbers for animation effect
      const tempNumbers = Array(count).fill(0).map(() => 
        Math.floor(Math.random() * (max - min + 1)) + min
      );
      setAnimationNumbers(tempNumbers);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsDrawing(false);
        setCurrentNumbers(results);
        setAnimationNumbers(results);
        setHistory(prev => [results, ...prev]);
        triggerConfetti();
      }
    };

    requestAnimationFrame(animate);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#21A4B1", "#E77E47"]
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#21A4B1", "#E77E47"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentNumbers([]);
    setAnimationNumbers(Array(count).fill(min));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Settings Panel */}
      <Card className="lg:col-span-4 border-none shadow-md h-full">
        <CardHeader>
          <CardTitle>抽獎設定</CardTitle>
          <CardDescription>設定數字範圍與規則</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min">最小值</Label>
              <Input 
                id="min" 
                type="number" 
                value={min} 
                onChange={(e) => setMin(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">最大值</Label>
              <Input 
                id="max" 
                type="number" 
                value={max} 
                onChange={(e) => setMax(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>抽出數量: {count}</Label>
            </div>
            <Slider 
              value={[count]} 
              min={1} 
              max={10} 
              step={1} 
              onValueChange={(vals) => setCount(vals[0])}
              className="py-2"
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="allow-repeat" className="flex flex-col gap-1">
              <span>允許重複</span>
              <span className="font-normal text-xs text-muted-foreground">是否允許抽出相同的數字</span>
            </Label>
            <Switch 
              id="allow-repeat" 
              checked={allowRepeat} 
              onCheckedChange={setAllowRepeat} 
            />
          </div>

          <Button 
            size="lg" 
            onClick={draw} 
            disabled={isDrawing}
            className="w-full text-lg font-bold shadow-md hover:shadow-lg transition-all"
          >
            {isDrawing ? (
              <span className="flex items-center gap-2">
                <RotateCcw className="animate-spin w-4 h-4" /> 抽獎中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4" /> 開始抽獎
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Display Panel */}
      <div className="lg:col-span-8 space-y-6">
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm min-h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
          
          <CardContent className="p-12 w-full flex flex-col items-center justify-center z-10">
            {currentNumbers.length > 0 || isDrawing ? (
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {animationNumbers.map((num, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-4xl md:text-6xl font-black shadow-xl transition-all duration-100 border-2",
                      isDrawing 
                        ? "bg-white text-muted-foreground border-muted scale-95" 
                        : "bg-primary text-white border-primary scale-100 animate-in zoom-in-50 duration-300"
                    )}
                    style={{ 
                      animationDelay: `${idx * 100}ms` 
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎰</span>
                </div>
                <h3 className="text-2xl font-bold text-muted-foreground">準備好開始了嗎？</h3>
                <p className="text-muted-foreground">設定範圍與數量，點擊左側按鈕開始抽獎</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History Panel */}
        {history.length > 0 && (
          <Card className="border-none shadow-sm bg-muted/30">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-base">抽獎紀錄</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={clearHistory} className="h-8 text-xs text-muted-foreground hover:text-destructive">
                清除紀錄
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {history.map((nums, idx) => (
                  <div key={idx} className="bg-white px-3 py-1.5 rounded-md shadow-sm border text-sm font-medium flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">#{history.length - idx}</span>
                    <span className="text-primary">{nums.join(", ")}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
