import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BookIcon from '@mui/icons-material/Book';

const IndexPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, md: 8 }, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          ようこそ！
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
          このアプリケーションでは、読んだ本や観た映画などの作品を記録し、
          それらについて他の人と語り合うことができます。
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/works"
            startIcon={<BookIcon />}
            sx={{ py: 1.5 }}
          >
            作品を管理する
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          まずは作品を登録してみましょう！
        </Typography>
      </Paper>
    </Container>
  );
};

export default IndexPage;
