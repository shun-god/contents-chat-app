import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom'; // RouterLink をインポート
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Container,
  Grid,
  IconButton, // IconButton をインポート
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // ArrowBackIcon をインポート
import { Work } from '@/types/Work';
import { GoogleGenAI } from "@google/genai";

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log("API Key from .env:", API_KEY); // デバッグ用に追加
if (!API_KEY) {
  console.error("APIキーが設定されていません。 .env ファイルを確認してください。");
  // エラーをスローするか、ユーザーに明確なエラーメッセージを表示する
  throw new Error("APIキーが設定されていません。アプリケーションを続行できません。");
}
const genAI = new GoogleGenAI({ apiKey: API_KEY }); // オブジェクト形式で試す

const ChatPage: React.FC = () => {
  const { workId } = useParams<{ workId: string }>();
  // console.log("ChatPage received workId from URL:", workId); // デバッグ用

  const [work, setWork] = useState<Work | null>(null);
  const [isLoadingWork, setIsLoadingWork] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  // const [chat, setChat] = useState(null); // 以前のchatステートは不要になる可能性があります

  // 作品情報を取得する処理 (変更なし)
  useEffect(() => {
    setIsLoadingWork(true);
    // console.log("ChatPage: useEffect for fetching work triggered with workId:", workId); // デバッグ用

    const fetchWork = async () => {
      try {
        const storedWorks = localStorage.getItem('worksData'); // ★ キーを 'works' から 'worksData' に変更
        // console.log("ChatPage: storedWorks from localStorage:", storedWorks); // デバッグ用

        if (storedWorks) {
          const worksArray: Work[] = JSON.parse(storedWorks);
          // console.log("ChatPage: parsed worksArray:", worksArray); // デバッグ用

          const foundWork = worksArray.find(w => w.id === workId);
          // console.log("ChatPage: foundWork:", foundWork); // デバッグ用

          if (foundWork) {
            setWork(foundWork);
          } else {
            console.error('ChatPage: Work not found in localStorage for id:', workId);
            setWork(null);
          }
        } else {
          console.error('ChatPage: No works found in localStorage with key "worksData"');
          setWork(null);
        }
      } catch (error) {
        console.error('ChatPage: Failed to load work:', error);
        setWork(null);
      } finally {
        setIsLoadingWork(false);
      }
    };

    if (workId) {
      fetchWork();
    } else {
      console.error('ChatPage: workId is undefined, cannot fetch work.');
      setIsLoadingWork(false);
      setWork(null);
    }
  }, [workId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const userMessageText = newMessage;
    const userMessage: ChatMessage = {
      id: Date.now().toString() + "_user",
      sender: "user",
      text: userMessageText,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage("");
    setIsSendingMessage(true);

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-1.5-flash-latest",
        contents: [{ role: "user", parts: [{ text: userMessageText }] }],
      });
      // 正しいテキスト取得方法: プロパティとしてアクセス
      const aiText = result.text; // () を削除

      if (aiText === undefined) {
        throw new Error("AIからの応答テキストがundefinedです。");
      }

      const aiMessage: ChatMessage = {
        id: Date.now().toString() + "_ai",
        sender: "ai",
        text: aiText,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Gemini APIへの送信中にエラーが発生しました:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + "_error",
        sender: "ai",
        text: "AIとの通信中にエラーが発生しました。しばらくしてからもう一度お試しください。",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleEndConversation = async () => {
    if (messages.length === 0) return;
    console.log("Conversation ended. Requesting summary...");
    setIsSendingMessage(true);

    const promptForSummary = `以下の作品についての感想の会話です。この会話全体を要約してください。\n\n作品名: ${
      work?.title || "不明な作品"
    }\n著者: ${work?.author || "不明な著者"}\n\n会話履歴:\n${messages
      .map((msg) => `${msg.sender === "user" ? "あなた" : "AI"}: ${msg.text}`)
      .join("\n")}\n\n要約:`;

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-1.5-flash-latest",
        contents: [{ role: "user", parts: [{ text: promptForSummary }] }],
      });
      // 正しいテキスト取得方法: プロパティとしてアクセス
      const summaryText = result.text; // () を削除

      if (summaryText === undefined) {
        throw new Error("AIからのまとめテキストがundefinedです。");
      }

      setSummary(summaryText);
    } catch (error) {
      console.error("Gemini APIでのまとめ生成中にエラーが発生しました:", error);
      setSummary("感想のまとめの生成中にエラーが発生しました。");
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (isLoadingWork) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>作品情報を読み込み中...</Typography>
      </Container>
    );
  }

  if (!work) {
    return (
      <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <Typography variant="h5" color="error" gutterBottom>
          作品情報が見つかりませんでした。
        </Typography>
        <Button component={RouterLink} to="/works" variant="outlined"> {/* 作品リストへ戻るボタン */}
          作品リストに戻る
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, position: 'relative' }}> {/* position: 'relative' を追加 */}
        {/* 戻るボタンを左上に配置 */}
        <IconButton
          component={RouterLink}
          to="/works"
          sx={{ position: 'absolute', top: 8, left: 8 }}
          aria-label="作品リストに戻る"
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ textAlign: 'center', mb: 2, mt: { xs: 4, sm: 0 } }}> {/* 中央寄せとマージン調整 */}
          <Typography variant="h4" component="h1" gutterBottom>
            {work.title} - 感想チャット
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            著者: {work.author || '未登録'}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            height: '400px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            p: 2,
            mb: 2,
            borderRadius: 1,
          }}
        >
          {messages.length === 0 && (
            <Typography color="textSecondary" textAlign="center">
              AIに感想を伝えてみましょう。
            </Typography>
          )}
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                mb: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.200',
                color:
                  msg.sender === 'user'
                    ? 'primary.contrastText'
                    : 'text.primary',
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                ml: msg.sender === 'user' ? 'auto' : undefined,
                mr: msg.sender === 'ai' ? 'auto' : undefined,
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
              <Typography
                variant="caption"
                display="block"
                sx={{ fontSize: '0.7rem', mt: 0.5, opacity: 0.7 }}
              >
                {msg.timestamp.toLocaleTimeString()}
              </Typography>
            </Box>
          ))}
          {isSendingMessage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>

        <Grid container spacing={2} alignItems="flex-end">
          <Grid size="grow">
            <TextField
              fullWidth
              variant="outlined"
              label="メッセージを入力..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              multiline
              maxRows={4}
              disabled={isSendingMessage}
            />
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={isSendingMessage || newMessage.trim() === ''}
            >
              送信
            </Button>
          </Grid>
        </Grid>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleEndConversation}
          sx={{ mt: 2 }}
          disabled={messages.length === 0 || isSendingMessage}
        >
          会話を終了してまとめる
        </Button>

        {summary && (
          <Paper elevation={1} sx={{ mt: 3, p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="h6">感想のまとめ</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {summary}
            </Typography>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default ChatPage;