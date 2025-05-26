export const workCategories = ['書籍', 'Web小説', '漫画', '映画', 'その他'] as const;

// workCategories 配列の要素の型を生成 (例: '書籍' | 'Web小説' | ...)
export type WorkCategory = typeof workCategories[number];

export interface Work {
  id: string; // 一意なID (例えばUUID)
  title: string; // 作品名
  category: WorkCategory | null; // カテゴリ (workCategories の要素または null を許容)
  readDate?: string; // 読了日 (任意)
  author?: string; // 著者名 (任意)
  urlOrIsbn?: string; // URL/ISBN (任意)
  genre?: string; // ジャンル (任意)
  memo?: string; // メモ (任意)
}