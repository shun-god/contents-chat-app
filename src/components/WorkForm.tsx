import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  MenuItem,
} from "@mui/material";
// workCategories と WorkCategory 型を Work.ts からインポート
import { Work, WorkCategory, workCategories } from "@/types/Work";
import { v4 as uuidv4 } from "uuid";

interface WorkFormProps {
  onAddWork?: (work: Work) => void;
  editingWork: Work | null;
  onEditWork?: (work: Work) => void; // ★ onEditWork をオプショナルに変更
  onCancelEdit?: () => void;
  readOnlyMode?: boolean;
}

const WorkForm: React.FC<WorkFormProps> = ({
  onAddWork,
  editingWork,
  onEditWork, // onEditWork が undefined の可能性を考慮
  onCancelEdit,
  readOnlyMode,
}) => {
  const [title, setTitle] = useState("");
  // 初期値を workCategories[0] に変更 (存在する場合)
  const [category, setCategory] = useState<WorkCategory | "">(
    workCategories.length > 0 ? workCategories[0] : ""
  );
  const [readDate, setReadDate] = useState("");
  const [author, setAuthor] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (editingWork) {
      setTitle(editingWork.title);
      // editingWork.category が null の場合や workCategories に存在しない場合も考慮
      setCategory(
        editingWork.category && workCategories.includes(editingWork.category)
          ? editingWork.category
          : workCategories.length > 0
          ? workCategories[0]
          : ""
      );
      setReadDate(editingWork.readDate || "");
      setAuthor(editingWork.author || "");
      // thoughts は Work 型に存在しないため、memo を使うか Work 型を修正
      // setThoughts(editingWork.thoughts || ""); // ← thoughts は Work 型にない
      setThoughts(editingWork.memo || ""); // Work 型の memo を使う場合
    } else {
      setTitle("");
      setCategory(workCategories.length > 0 ? workCategories[0] : "");
      setReadDate("");
      setAuthor("");
      setThoughts("");
    }
    setErrors({});
  }, [editingWork]);

  const validate = (): boolean => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = "タイトルは必須です。";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (readOnlyMode) return;

    if (!validate()) {
      return;
    }

    const workData: Work = {
      id: editingWork ? editingWork.id : uuidv4(),
      title,
      category: category || null,
      readDate: readDate || undefined,
      author: author || undefined,
      memo: thoughts || undefined,
    };

    if (editingWork && onEditWork) { // ★ onEditWork が存在する場合のみ呼び出す
      onEditWork(workData);
    } else if (!editingWork && onAddWork) { // 新規追加の場合
      onAddWork(workData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        {readOnlyMode ? "作品情報" : editingWork ? "作品を編集" : "新しい作品を登録"}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            error={!!errors.title}
            helperText={errors.title}
            InputProps={{
              readOnly: readOnlyMode,
            }}
            variant={readOnlyMode ? "filled" : "outlined"}
            sx={
              readOnlyMode
                ? { "& .MuiInputBase-input": { cursor: "default" } }
                : {}
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="著者/制作者"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            fullWidth
            InputProps={{
              readOnly: readOnlyMode,
            }}
            variant={readOnlyMode ? "filled" : "outlined"}
            sx={
              readOnlyMode
                ? { "& .MuiInputBase-input": { cursor: "default" } }
                : {}
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="カテゴリ"
            value={category}
            onChange={(e) => setCategory(e.target.value as WorkCategory | "")}
            fullWidth
            InputProps={{
              readOnly: readOnlyMode,
            }}
            variant={readOnlyMode ? "filled" : "outlined"}
            sx={
              readOnlyMode
                ? {
                    "& .MuiInputBase-input": { cursor: "default" },
                    "& .MuiSelect-icon": {
                      display: readOnlyMode ? "none" : "block",
                    },
                  }
                : {}
            }
          >
            {workCategories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="読了日/視聴日"
            type="date"
            value={readDate}
            onChange={(e) => setReadDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: readOnlyMode,
            }}
            variant={readOnlyMode ? "filled" : "outlined"}
            sx={
              readOnlyMode
                ? { "& .MuiInputBase-input": { cursor: "default" } }
                : {}
            }
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="メモ"
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            fullWidth
            multiline
            rows={readOnlyMode ? 6 : 3}
            InputProps={{
              readOnly: readOnlyMode,
            }}
            variant={readOnlyMode ? "filled" : "outlined"}
            sx={
              readOnlyMode
                ? { "& .MuiInputBase-input": { cursor: "default" } }
                : {}
            }
          />
        </Grid>
      </Grid>
      {!readOnlyMode && (
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button type="submit" variant="contained" color="primary">
            {editingWork ? "更新" : "登録"}
          </Button>
          {editingWork && onCancelEdit && (
            <Button variant="outlined" onClick={onCancelEdit}>
              キャンセル
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default WorkForm;
