import { useState, useEffect, useRef } from 'react';
import { DIFFICULTY_SCORES } from '../constants/quiz';

const TIMER_SECONDS = 20;
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const DIFFICULTY_META = {
  하: { label: '쉬움',   cls: 'bg-emerald-100 text-emerald-700' },
  중: { label: '보통',   cls: 'bg-amber-100 text-amber-700' },
  상: { label: '어려움', cls: 'bg-rose-100 text-rose-700' },
};

export default function QuizScreen({ questions, category, onFinish, onQuit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft]         = useState(TIMER_SECONDS);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // null | 0-3 | -1(timeout)
  const [isAnswered, setIsAnswered]     = useState(false);
  const [score, setScore]               = useState(0);

  /* refs — interval 클로저 / 키보드 핸들러에서 항상 최신 값 사용 */
  const isAnsweredRef   = useRef(false);
  const scoreRef        = useRef(0);
  const answersRef      = useRef([]);
  const handleSelectRef = useRef(null);
  const handleNextRef   = useRef(null);

  const current  = questions[currentIndex];
  const diffMeta = DIFFICULTY_META[current?.difficulty] ?? DIFFICULTY_META['하'];

  /* ── 선택 처리 ── */
  const handleSelect = (optionIndex) => {
    if (isAnsweredRef.current) return;
    isAnsweredRef.current = true;

    const q         = questions[currentIndex];
    const isCorrect = optionIndex === q.answer;
    const points    = isCorrect ? (DIFFICULTY_SCORES[q.difficulty] ?? 0) : 0;

    scoreRef.current += points;
    answersRef.current.push({
      question:    q.question,
      options:     q.options,
      selected:    optionIndex,
      correct:     q.answer,
      isCorrect,
      explanation: q.explanation,
      difficulty:  q.difficulty,
    });

    setScore(scoreRef.current);
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
  };

  /* ── 다음 문제 / 결과 이동 ── */
  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      onFinish({ score: scoreRef.current, answers: [...answersRef.current], category });
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  /* ref 최신 유지 */
  handleSelectRef.current = handleSelect;
  handleNextRef.current   = handleNext;

  /* ── 타이머 — 문제 바뀔 때마다 초기화 ── */
  useEffect(() => {
    isAnsweredRef.current = false;
    let remaining = TIMER_SECONDS;
    setTimeLeft(TIMER_SECONDS);

    const id = setInterval(() => {
      if (isAnsweredRef.current) { clearInterval(id); return; }
      remaining -= 1;
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(id);
        isAnsweredRef.current = true;
        const q = questions[currentIndex];
        answersRef.current.push({
          question: q.question, options: q.options,
          selected: -1, correct: q.answer,
          isCorrect: false, explanation: q.explanation, difficulty: q.difficulty,
        });
        setSelectedAnswer(-1);
        setIsAnswered(true);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 키보드 바인딩 (1~4 선택, Enter 다음) — 한 번만 등록 ── */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        handleSelectRef.current(parseInt(e.key, 10) - 1);
      }
      if (e.key === 'Enter' && isAnsweredRef.current) {
        handleNextRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  /* ── 스타일 헬퍼 ── */
  const getOptionCls = (index) => {
    if (!isAnswered)
      return 'border-gray-200 bg-white text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400';
    if (index === current.answer)
      return 'border-green-500 bg-green-50 text-green-800 cursor-default';
    if (index === selectedAnswer && index !== current.answer)
      return 'border-red-400 bg-red-50 text-red-700 cursor-default';
    return 'border-gray-200 bg-gray-50 text-gray-400 opacity-50 cursor-default';
  };

  const getLabelCls = (index) => {
    if (!isAnswered) return 'bg-gray-100 text-gray-500';
    if (index === current.answer) return 'bg-green-500 text-white';
    if (index === selectedAnswer && index !== current.answer) return 'bg-red-400 text-white';
    return 'bg-gray-100 text-gray-400';
  };

  const getOptionIcon = (index) => {
    if (!isAnswered) return null;
    if (index === current.answer) return <span aria-hidden="true">✅</span>;
    if (index === selectedAnswer && index !== current.answer) return <span aria-hidden="true">❌</span>;
    return null;
  };

  const isCorrectAnswer  = isAnswered && selectedAnswer === current.answer;
  const isTimeWarning    = timeLeft <= 5 && !isAnswered;
  const progress         = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ── 헤더 ── */}
      <div className="bg-white shadow-sm px-4 pt-4 pb-3">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onQuit}
              aria-label="퀴즈 종료하고 홈으로 돌아가기"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕ 종료
            </button>
            <span className="text-sm font-medium text-gray-600">{category}</span>
            <span className="text-sm font-bold text-indigo-600" aria-label={`현재 점수 ${score}점`}>
              {score}점
            </span>
          </div>

          {/* 진행 바 */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span aria-label={`${questions.length}문제 중 ${currentIndex + 1}번째`}>
              {currentIndex + 1} / {questions.length}
            </span>
            <div
              className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={currentIndex + 1}
              aria-valuemin={1}
              aria-valuemax={questions.length}
            >
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* ── 본문 ── */}
      <div className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-xl">

          {/* 타이머 */}
          <div className="flex flex-col items-center my-4">
            <div
              className={`text-4xl font-bold tabular-nums transition-colors ${
                isAnswered
                  ? 'text-gray-300'
                  : isTimeWarning
                  ? 'text-red-500 animate-pulse'
                  : 'text-indigo-600'
              }`}
              aria-label={isAnswered ? '답변 완료' : `남은 시간 ${timeLeft}초`}
              aria-live="polite"
            >
              {isAnswered ? '✓' : timeLeft}
            </div>
            <div
              className="w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2"
              role="timer"
              aria-hidden="true"
            >
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isAnswered ? 'bg-gray-200' : isTimeWarning ? 'bg-red-400' : 'bg-indigo-400'
                }`}
                style={{ width: isAnswered ? '0%' : `${(timeLeft / TIMER_SECONDS) * 100}%` }}
              />
            </div>
          </div>

          {/* 난이도 뱃지 */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diffMeta.cls}`}>
              {diffMeta.label}
            </span>
            <span className="text-xs text-gray-400">
              정답 시 +{DIFFICULTY_SCORES[current?.difficulty] ?? 0}점
            </span>
          </div>

          {/* 문제 */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <p className="text-base sm:text-lg font-medium text-gray-800 leading-relaxed">
              {current?.question}
            </p>
          </div>

          {/* 보기 */}
          <div className="space-y-2.5 mb-4" role="group" aria-label="보기 선택">
            {current?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={isAnswered}
                aria-label={`보기 ${OPTION_LABELS[index]}: ${option}${
                  isAnswered && index === current.answer ? ' (정답)' : ''
                }${isAnswered && index === selectedAnswer && index !== current.answer ? ' (선택한 오답)' : ''}`}
                aria-pressed={isAnswered ? index === selectedAnswer : undefined}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-150 ${getOptionCls(index)}`}
              >
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${getLabelCls(index)}`}
                  aria-hidden="true"
                >
                  {OPTION_LABELS[index]}
                </span>
                <span className="text-sm leading-snug flex-1">{option}</span>
                <span className="ml-auto text-base">{getOptionIcon(index)}</span>
              </button>
            ))}
          </div>

          {/* 키보드 힌트 (미응답 상태) */}
          {!isAnswered && (
            <p className="text-center text-xs text-gray-300 mb-3" aria-hidden="true">
              키보드 <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-400">1</kbd>~
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-400">4</kbd>로 선택
            </p>
          )}

          {/* 피드백 */}
          {isAnswered && (
            <div
              className={`rounded-xl p-4 mb-4 border ${
                isCorrectAnswer ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
              role="alert"
              aria-live="assertive"
            >
              <p className={`font-bold mb-1 ${isCorrectAnswer ? 'text-green-700' : 'text-red-600'}`}>
                {selectedAnswer === -1
                  ? '⏰ 시간 초과!'
                  : isCorrectAnswer
                  ? '✅ 정답입니다!'
                  : '❌ 오답입니다'}
              </p>
              <p className="text-sm text-gray-600">{current?.explanation}</p>
            </div>
          )}

          {/* 다음 버튼 */}
          {isAnswered && (
            <button
              onClick={handleNext}
              aria-label={
                currentIndex + 1 >= questions.length ? '결과 화면으로 이동' : '다음 문제로 이동'
              }
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl transition-colors text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              {currentIndex + 1 >= questions.length ? '결과 보기 🏁' : '다음 문제 →'}
            </button>
          )}

          {/* Enter 힌트 (응답 후) */}
          {isAnswered && (
            <p className="text-center text-xs text-gray-300 mt-2" aria-hidden="true">
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-400">Enter</kbd> 키로도 이동 가능
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
