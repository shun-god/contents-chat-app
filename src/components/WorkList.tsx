import React from "react";
import { Work } from "@/types/Work";
import { List, ListItem, ListItemText, Button, Box } from "@mui/material";

interface WorkListProps {
  works: Work[];
  onEdit: (work: Work) => void;
  onDelete: (workId: string) => void;
}

const WorkList: React.FC<WorkListProps> = ({ works, onEdit, onDelete }) => {
  return (
    <List>
      {works.map((work) => (
        <ListItem key={work.id} sx={{ display: "flex", justifyContent: "space-between" }}>
          <ListItemText primary={work.title} secondary={work.category} />
          <Box>
            <Button variant="outlined" color="primary" onClick={() => onEdit(work)}>
              編集
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => onDelete(work.id)}>
              削除
            </Button>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default WorkList;