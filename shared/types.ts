/**
 * 簡化版：純前端專案，不需要資料庫類型
 */

// 名單組類型
export interface ListGroup {
  id: string | number;
  name: string;
  items: string[];
}

// 分組結果類型
export interface Group {
  id: number;
  name: string;
  members: string[];
}
