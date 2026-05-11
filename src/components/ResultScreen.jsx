import { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';

const GRADES = [
  { min: 90, emoji: '🧠', label: '천재!',      cls: 'text-purple-700 bg-purple-50 border-purple-200' },
  { min: 70, emoji: '🌟', label: '우수',        cls: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  { min: 50, emoji: '📚', label: '보통',        cls: 'text-blue-700 bg-blue-50 border-blue-200' },
  { min: 0,  emoji: '💪', label: '더 공부해요', cls: 'text-gray-700 bg-gray-50 border-gray-200' },
];

function getGrade(accuracy) {
  return GRADES.find((g) => accuracy >= g.min) ?? GRADES[GRADES.length - 1];
}

export default function ResultScreen({ result, onRetry, onHome, onLeaderboard }) {
  const { score, answers, category } = result;
  const { saveEntry } = useLeaderboard();

  const [nick, setNick]   = useState('');
  const [saved, setSaved] = useState(false);

  const correct      = answers.filter((a) => a.isCorrect).length;
  const total        = answers.length;
  const accuracy     = Math.round((correct / total) * 100);
  const grade        = getGrade(accuracy);
  const wrongAnswers = answers.filter((a) => !a.isCorrect);

  const handleSave = () => {
    const trimmed = nick.trim();
    if (!trimmed) return;
    saveEntry({ nick: trimmed, score, correct, total, category });
    setSaved(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 py-8 bg-gray-50">
      <main className="w-full max-w-xl space-y-4" aria-label="퀴즈 결과">

        {/* ── 점수 카드 ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="text-6xl mb-3" aria-hidden="true">{grade.emoji}</div>
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${grade.cls} mb-4`}
            aria-label={`등급: ${grade.label}`}>
            {grade.label}
          </span>
          <div
            className="text-5xl font-extrabold text-indigo-600 mb-1"
            aria-label={`최종 점수 ${score}점`}
          >
            {score}<span className="text-xl font-normal text-gray-400"> 점</span>
          </div>
          <div className="text-gray-600 text-lg font-medium" aria-label={`${total}문제 중 ${correct}개 정답`}>
            {correct} / {total} 정답
          </div>
          <div className="text-3xl font-bold text-gray-700 mt-1" aria-label={`정답률 ${accuracy}퍼센트`}>
            {accuracy}%
          </div>
          <div className="text-sm text-gray-400 mt-2">{category}</div>
        </div>

        {/* ── 리더보드 등록 ── */}
        {!saved ? (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">🏆 리더보드에 등록하기</p>
            <div className="flex gap-2">
              <label htmlFor="nick-input" className="sr-only">닉네임 입력</label>
              <input
                id="nick-input"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="닉네임 입력 (최대 10자)"
                maxLength={10}
                aria-label="리더보드 등록용 닉네임"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
              <button
                onClick={handleSave}
                disabled={!nick.trim()}
                aria-label="리더보드에 점수 저장하기"
                className="px-5 py-2.5 bg-indigo-600 disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <div
            className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center"
            role="status"
            aria-live="polite"
          >
            <p className="text-green-700 font-semibold">✅ 리더보드에 저장되었습니다!</p>
          </div>
        )}

        {/* ── 오답 노트 ── */}
        {wrongAnswers.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm p-5" aria-label="오답 노트">
            <h2 className="font-bold text-gray-800 mb-4">
              📖 오답 노트{' '}
              <span className="text-sm font-normal text-gray-400">({wrongAnswers.length}개)</span>
            </h2>
            <ul className="space-y-3">
              {wrongAnswers.map((a, i) => (
                <li key={i} className="border border-red-100 rounded-xl p-3 bg-red-50/60">
                  <p className="text-sm font-medium text-gray-800 mb-2 leading-snug">{a.question}</p>
                  <p className="text-xs font-semibold text-green-700">
                    ✅ 정답: {a.options[a.correct]}
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">
                    ❌{' '}{a.selected === -1 ? '시간 초과' : `내 답: ${a.options[a.selected]}`}
                  </p>
                  {a.explanation && (
                    <p className="text-xs text-gray-500 mt-1.5 leading-snug">{a.explanation}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {wrongAnswers.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center text-green-700" role="status">
            🎉 모든 문제를 맞혔습니다!
          </div>
        )}

        {/* ── 버튼 ── */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onRetry}
            aria-label="같은 카테고리로 퀴즈 다시 시작"
            className="py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            🔄 다시하기
          </button>
          <button
            onClick={onHome}
            aria-label="홈 화면으로 돌아가기"
            className="py-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            🏠 홈으로
          </button>
        </div>
        <button
          onClick={onLeaderboard}
          aria-label="리더보드 화면으로 이동"
          className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-900 font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        >
          🏆 리더보드 보기
        </button>
      </main>
    </div>
  );
}
