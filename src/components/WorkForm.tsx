import React, { useState, useEffect } from "react";
import { Work, workCategories } from "@/types/Work"; // workCategories をインポート
import { TextField, Button, Box, MenuItem } from "@mui/material";

// Work.ts からインポートした workCategories を使用
const categoryOptions = workCategories;

interface WorkFormProps {
  onAddWork: (work: Work) => void;
  onEditWork: (work: Work) => void;
  editingWork: Work | null;
}

const WorkForm: React.FC<WorkFormProps> = ({
  onAddWork,
  onEditWork,
  editingWork,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Work["category"] | null>(null);
  const [readDate, setReadDate] = useState("");
  const [author, setAuthor] = useState("");
  const [urlOrIsbn, setUrlOrIsbn] = useState("");
  const [genre, setGenre] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (editingWork) {
      setTitle(editingWork.title);
      setCategory(editingWork.category);
      setReadDate(editingWork.readDate || "");
      setAuthor(editingWork.author || "");
      setUrlOrIsbn(editingWork.urlOrIsbn || "");
      setGenre(editingWork.genre || "");
      setMemo(editingWork.memo || "");
    }
  }, [editingWork]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrUpdatedWork: Work = {
      id: editingWork?.id || crypto.randomUUID(),
      title,
      category,
      readDate,
      author,
      urlOrIsbn,
      genre,
      memo,
    };

    if (editingWork) {
      onEditWork(newOrUpdatedWork);
    } else {
      onAddWork(newOrUpdatedWork);
    }

    // フォームをリセット
    setTitle("");
    setCategory("書籍");
    setReadDate("");
    setAuthor("");
    setUrlOrIsbn("");
    setGenre("");
    setMemo("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="作品名"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        select
        label="カテゴリ"
        value={category || ""} // null の場合は空文字列を設定
        onChange={(e) =>
          setCategory(e.target.value === "" ? null : (e.target.value as Work["category"]))
        }
        required
      >
        <MenuItem value="" disabled>
          未選択
        </MenuItem>
        {categoryOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="著者名"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <TextField
        label="読み終わった日"
        type="date"
        value={readDate}
        onChange={(e) => setReadDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="URLまたはISBN"
        value={urlOrIsbn}
        onChange={(e) => setUrlOrIsbn(e.target.value)}
      />
      <TextField
        label="ジャンル"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <TextField
        label="メモ"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        multiline
        rows={3}
      />
      <Button type="submit" variant="contained" color="primary">
        {editingWork ? "更新" : "追加"}
      </Button>
    </Box>
  );
};

export default WorkForm;
