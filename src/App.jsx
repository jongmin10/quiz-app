import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import LoadingScreen from './components/LoadingScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import { generateQuiz } from './api/claudeApi';

const SCREENS = {
  HOME: 'home',
  LOADING: 'loading',
  QUIZ: 'quiz',
  RESULT: 'result',
  LEADERBOARD: 'leaderboard',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loadingError, setLoadingError] = useState('');

  /* ── 퀴즈 시작 ── */
  const handleStart = async (selectedCategory) => {
    setCategory(selectedCategory);
    setLoadingError('');
    setScreen(SCREENS.LOADING);
    try {
      const qs = await generateQuiz({ category: selectedCategory });
      if (!qs || qs.length === 0) throw new Error('문제를 불러오지 못했습니다.');
      setQuestions(qs);
      setScreen(SCREENS.QUIZ);
    } catch (err) {
      // 로딩 화면에서 에러 표시 (홈으로 돌아가지 않음)
      setLoadingError(err.message ?? '문제 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleRetryLoad = () => handleStart(category);

  const handleFinish = ({ score, answers, category: cat }) => {
    setResult({ score, answers, category: cat });
    setScreen(SCREENS.RESULT);
  };

  const handleRetry   = () => handleStart(category);
  const handleHome    = () => setScreen(SCREENS.HOME);
  const handleLeaderboard = () => setScreen(SCREENS.LEADERBOARD);

  /* ── 렌더 ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {screen === SCREENS.HOME && (
        <HomeScreen onStart={handleStart} onLeaderboard={handleLeaderboard} />
      )}

      {screen === SCREENS.LOADING && (
        <LoadingScreen
          category={category}
          error={loadingError}
          onRetry={handleRetryLoad}
          onHome={handleHome}
        />
      )}

      {screen === SCREENS.QUIZ && (
        <QuizScreen
          questions={questions}
          category={category}
          onFinish={handleFinish}
          onQuit={handleHome}
        />
      )}

      {screen === SCREENS.RESULT && result && (
        <ResultScreen
          result={result}
          onRetry={handleRetry}
          onHome={handleHome}
          onLeaderboard={handleLeaderboard}
        />
      )}

      {screen === SCREENS.LEADERBOARD && (
        <LeaderboardScreen onBack={handleHome} />
      )}
    </div>
  );
}
