import React, { useState, useEffect } from "react";
import WorkForm from "@/components/WorkForm";
import WorkList from "@/components/WorkList";
import { Work } from "@/types/Work";
import { Box, Typography } from "@mui/material";

const LOCAL_STORAGE_KEY = "worksData";

const WorksPage: React.FC = () => {
  const [works, setWorks] = useState<Work[]>(() => {
    try {
      const storedWorks = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedWorks ? JSON.parse(storedWorks) : [];
    } catch (error) {
      console.error("Failed to parse works data from localStorage during initialization:", error);
      return [];
    }
  });
  const [editingWork, setEditingWork] = useState<Work | null>(null); // 現在編集中の作品

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(works));
  }, [works]);

  const handleAddWork = (newWork: Work) => {
    setWorks((prevWorks) => [...prevWorks, newWork]);
  };

  const handleEditWork = (updatedWork: Work) => {
    setWorks((prevWorks) =>
      prevWorks.map((work) => (work.id === updatedWork.id ? updatedWork : work))
    );
    setEditingWork(null); // 編集モードを解除
  };

  const handleDeleteWork = (workId: string) => {
    setWorks((prevWorks) => prevWorks.filter((work) => work.id !== workId));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        作品管理ページ
      </Typography>
      <WorkForm
        onAddWork={handleAddWork}
        editingWork={editingWork}
        onEditWork={handleEditWork}
      />
      <WorkList
        works={works}
        onEdit={(work) => setEditingWork(work)}
        onDelete={handleDeleteWork}
      />
    </Box>
  );
};

export default WorksPage;