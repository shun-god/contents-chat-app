import React, { useState, useEffect } from "react";
import WorkForm from "@/components/WorkForm";
import WorkList from "@/components/WorkList";
import { Work } from "@/types/Work";
import { Box, Typography, Grid, Button, Collapse, IconButton, useTheme, useMediaQuery } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChatIcon from '@mui/icons-material/Chat';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';

const LOCAL_STORAGE_KEY = "worksData";

const WorksPage: React.FC = () => {
  const [works, setWorks] = useState<Work[]>(() => {
    try {
      const storedWorks = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedWorks ? JSON.parse(storedWorks) : [];
    } catch (error) {
      console.error(
        "Failed to parse works data from localStorage during initialization:",
        error
      );
      return [];
    }
  });
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [isAddingNewWork, setIsAddingNewWork] = useState<boolean>(true);
  const [isWorkListOpenOnMobile, setIsWorkListOpenOnMobile] = useState<boolean>(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // ★ 横長画面かの判定用

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(works));
  }, [works]);

  useEffect(() => {
    if (works.length > 0 && !selectedWorkId && !editingWork && !isAddingNewWork) {
      // setIsAddingNewWork(true);
    } else if (works.length === 0) {
      setIsAddingNewWork(true);
    }
    if (isMobile && selectedWorkId) {
        // setIsWorkListOpenOnMobile(false);
    }
  }, [works, selectedWorkId, editingWork, isAddingNewWork, isMobile]);

  const handleAddWork = (newWork: Work) => {
    setWorks((prevWorks) => [...prevWorks, newWork]);
    setSelectedWorkId(newWork.id);
    setEditingWork(null);
    setIsAddingNewWork(false);
    if (isMobile) setIsWorkListOpenOnMobile(false);
  };

  const handleEditWork = (updatedWork: Work) => {
    setWorks((prevWorks) =>
      prevWorks.map((work) => (work.id === updatedWork.id ? updatedWork : work))
    );
    setEditingWork(null);
    setSelectedWorkId(updatedWork.id);
    setIsAddingNewWork(false);
  };

  const handleDeleteWork = (workId: string) => {
    setWorks((prevWorks) => prevWorks.filter((work) => work.id !== workId));
    if (selectedWorkId === workId) {
      setSelectedWorkId(null);
      setIsAddingNewWork(true);
    }
    if (editingWork?.id === workId) {
      setEditingWork(null);
      setIsAddingNewWork(true);
    }
  };

  const handleStartEdit = (work: Work) => {
    setEditingWork(work);
    setSelectedWorkId(work.id);
    setIsAddingNewWork(false);
    if (isMobile) setIsWorkListOpenOnMobile(false);
  };

  const handleSelectWorkFromList = (id: string) => {
    setSelectedWorkId(id);
    setEditingWork(null);
    setIsAddingNewWork(false);
    if (isMobile) setIsWorkListOpenOnMobile(false);
  };

  const handleAddNewWorkClick = () => {
    setSelectedWorkId(null);
    setEditingWork(null);
    setIsAddingNewWork(true);
    if (isMobile) setIsWorkListOpenOnMobile(false);
  };

  const toggleWorkListOnMobile = () => {
    setIsWorkListOpenOnMobile(!isWorkListOpenOnMobile);
  };

  const displayedWork = works.find((work) => work.id === selectedWorkId) || null;

  let rightColumnContent;
  if (isAddingNewWork) {
    rightColumnContent = (
      <>
        <Typography variant="h6" gutterBottom>
          作品を新規追加
        </Typography>
        <WorkForm
          onAddWork={handleAddWork}
          editingWork={null}
          onEditWork={handleEditWork}
        />
      </>
    );
  } else if (editingWork) {
    rightColumnContent = (
      <>
        <Typography variant="h6" gutterBottom>
          作品を編集
        </Typography>
        <WorkForm
          onAddWork={handleAddWork}
          editingWork={editingWork}
          onEditWork={handleEditWork}
          onCancelEdit={() => {
            setEditingWork(null);
            if (selectedWorkId) setIsAddingNewWork(false);
            else setIsAddingNewWork(true);
          }}
        />
      </>
    );
  } else if (displayedWork) {
    rightColumnContent = (
      <>
        <Typography variant="h6" gutterBottom>
          作品詳細
        </Typography>
        <WorkForm
          editingWork={displayedWork}
          readOnlyMode={true}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => handleStartEdit(displayedWork)}
          >
            この作品を編集する
          </Button>
          <Button
            variant="outlined"
            component={RouterLink}
            to={`/chat/${displayedWork.id}`}
            startIcon={<ChatIcon />}
          >
            作品について語る
          </Button>
        </Box>
      </>
    );
  } else {
    rightColumnContent = (
      <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
        作品を選択するか、新規登録してください。
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        // ★ 横長画面の時に高さをビューポートに合わせるための設定
        display: 'flex',
        flexDirection: 'column',
        height: isDesktop ? `calc(100vh - ${theme.spacing(3 * 2)})` : 'auto', // md時のpadding上下分を引く
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
        <Typography variant="h4" component="h1">
          作品管理ページ
        </Typography>
        {isMobile && (
          <IconButton onClick={toggleWorkListOnMobile} color="primary" sx={{ ml: 'auto', mr: 1 }}>
            {isWorkListOpenOnMobile ? <ExpandLessIcon /> : <MenuIcon />}
          </IconButton>
        )}
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddNewWorkClick}
        >
          新規登録
        </Button>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1, // ★ 残りの高さを埋める
          overflow: 'hidden', // ★ Grid container 自体はスクロールさせない
          minHeight: 0, // ★ flexアイテムが縮小しすぎるのを防ぐ (重要)
        }}
      >
        {/* 左カラム: 作品リスト */}
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            ...(isDesktop && { // ★ 横長画面の時のみ適用
              display: 'flex',
              flexDirection: 'column',
              height: '100%', // 親のGrid containerの高さに合わせる
              // overflowY: 'auto', // ここではなく、中のBoxでスクロール
            }),
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: isMobile ? 'none' : 'block',
              flexShrink: 0, // ★ Typographyは縮まないように
            }}
          >
            作品リスト
          </Typography>
          {isMobile ? (
            <Collapse in={isWorkListOpenOnMobile} timeout="auto" unmountOnExit>
              <WorkList
                works={works}
                onEdit={handleStartEdit}
                onDelete={handleDeleteWork}
                selectedWorkId={selectedWorkId}
                onSelectWork={handleSelectWorkFromList}
              />
            </Collapse>
          ) : (
            // ★ PC表示時、WorkListをBoxで囲みスクロール可能にする
            <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 0 }}>
              <WorkList
                works={works}
                onEdit={handleStartEdit}
                onDelete={handleDeleteWork}
                selectedWorkId={selectedWorkId}
                onSelectWork={handleSelectWorkFromList}
              />
            </Box>
          )}
        </Grid>

        {/* 右カラム: 作品フォーム または 作品詳細 */}
        <Grid
          size={{ xs: 12, md: 8 }}
          sx={{
            display: isMobile && isWorkListOpenOnMobile && works.length > 0 ? 'none' : 'block',
            ...(isDesktop && { // ★ 横長画面の時のみ適用
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              // overflowY: 'auto', // ここではなく、中のBoxでスクロール
            }),
          }}
        >
          {/* ★ 右カラムの内容もBoxで囲みスクロール可能にする */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {rightColumnContent}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorksPage;
