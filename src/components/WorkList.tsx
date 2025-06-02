import React from "react";
import { Work } from "@/types/Work";
import { List, ListItem, ListItemText, Button, Box, Typography, IconButton } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat'; // 感想を話すボタン用のアイコン例

interface WorkListProps {
  works: Work[];
  onEdit: (work: Work) => void;
  onDelete: (workId: string) => void;
  selectedWorkId?: string | null; // ★ 追加: 選択されている作品のID (オプショナルにしておくことも可能)
  onSelectWork?: (workId: string) => void; // ★ 追加: 作品が選択されたときのコールバック (オプショナル)
}

const WorkList: React.FC<WorkListProps> = ({ works, onEdit, onDelete, selectedWorkId, onSelectWork }) => {
  if (works.length === 0) {
    return <Typography sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>登録されている作品はありません。</Typography>;
  }

  return (
    <List>
      {works.map((work) => (
        <ListItem
          key={work.id}
          // divider // 作品間に区切り線を入れる場合
          onClick={() => onSelectWork && onSelectWork(work.id)} // ★ 作品クリックで onSelectWork を呼び出す
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // 狭い画面では縦並び、広い画面では横並び
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' }, // 縦並びの時は左寄せ
            mb: 1, // 各アイテム間のマージン
            p: 1.5, // パディングを少し増やす
            border: '1px solid', // 枠線
            borderColor: work.id === selectedWorkId ? 'primary.main' : 'grey.300', // ★ 選択されたアイテムの枠線色を変更
            borderRadius: 1, // 角丸
            backgroundColor: work.id === selectedWorkId ? 'action.hover' : 'transparent', // ★ 選択されたアイテムの背景色を変更
            cursor: onSelectWork ? 'pointer' : 'default', // onSelectWork があればカーソルをポインターに
            '&:hover': onSelectWork ? { // ホバーエフェクト (onSelectWorkがある場合のみ)
              borderColor: 'primary.light',
              backgroundColor: 'action.selected',
            } : {},
          }}
        >
          <ListItemText
            primary={work.title}
            secondary={`カテゴリ: ${work.category || '未分類'} / 読了日: ${work.readDate || '未設定'}`}
            sx={{ mb: { xs: 1, sm: 0 }, flexGrow: 1 }} // 狭い画面では下にマージン、テキストがスペースを埋めるように
          />
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexShrink: 0 }}> {/* ボタンが縮まないように */}
            <IconButton
              aria-label="edit"
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // ListItem の onClick が発火しないようにする
                onEdit(work);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(work.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <Button
              component={RouterLink}
              to={`/chat/${work.id}`}
              variant="outlined"
              size="small"
              startIcon={<ChatIcon />} // アイコンを追加
              onClick={(e) => e.stopPropagation()} // ListItem の onClick が発火しないようにする
              sx={{ ml: 1 }} // 他のアイコンボタンとの間隔
            >
              感想
            </Button>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default WorkList;