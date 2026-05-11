import { useState } from 'react';
import { CATEGORIES } from '../constants/quiz';
import { useLeaderboard } from '../hooks/useLeaderboard';

const MEDALS = ['🥇', '🥈', '🥉'];
const TABS   = ['전체', ...CATEGORIES];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export default function LeaderboardScreen({ onBack }) {
  const { board, clearBoard } = useLeaderboard();
  const [activeTab, setActiveTab] = useState('전체');

  const filtered =
    activeTab === '전체' ? board : board.filter((e) => e.category === activeTab);

  const handleClear = () => {
    if (window.confirm('리더보드를 초기화하시겠습니까?')) clearBoard();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            aria-label="홈 화면으로 돌아가기"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
          >
            ← 뒤로
          </button>
          <h1 className="text-lg font-bold text-gray-800">🏆 리더보드</h1>
          <button
            onClick={handleClear}
            aria-label="리더보드 기록 전체 초기화"
            className="text-xs text-red-400 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
          >
            초기화
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-xl">

          {/* 필터 탭 */}
          <div
            className="flex gap-2 overflow-x-auto pb-1 mb-4"
            role="tablist"
            aria-label="카테고리 필터"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                aria-label={`${tab} 카테고리 기록 보기`}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 랭킹 목록 */}
          <div
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
            role="tabpanel"
            aria-label={`${activeTab} 리더보드`}
          >
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-5xl mb-3" aria-hidden="true">📭</p>
                <p className="text-gray-400 text-sm">아직 기록이 없습니다.</p>
                <p className="text-gray-300 text-xs mt-1">퀴즈를 풀고 기록을 남겨보세요!</p>
              </div>
            ) : (
              <>
                {/* 테이블 헤더 */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <div className="w-8 text-center">#</div>
                  <div className="flex-1">닉네임</div>
                  <div className="text-right w-16">정답</div>
                  <div className="text-right w-16">점수</div>
                </div>

                {/* 엔트리 */}
                <ol aria-label="순위 목록">
                  {filtered.map((entry, index) => {
                    const isTop3 = index < 3;
                    const medal  = isTop3 ? MEDALS[index] : null;
                    return (
                      <li
                        key={index}
                        className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${
                          isTop3
                            ? 'bg-gradient-to-r from-amber-50/60 to-white hover:from-amber-50'
                            : 'hover:bg-gray-50/60'
                        }`}
                        aria-label={`${index + 1}위 ${entry.nick} ${entry.category} ${entry.correct}/${entry.total} 정답 ${entry.score}점`}
                      >
                        <div className="w-8 text-center flex-shrink-0" aria-hidden="true">
                          {medal
                            ? <span className="text-xl">{medal}</span>
                            : <span className="text-sm font-bold text-gray-400">{index + 1}</span>
                          }
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`font-bold truncate ${isTop3 ? 'text-gray-800' : 'text-gray-700'}`}>
                            {entry.nick}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {entry.category} · {formatDate(entry.date)}
                          </p>
                        </div>

                        <div className="text-right w-16 flex-shrink-0">
                          <span className="text-sm text-gray-600 font-medium">
                            {entry.correct}/{entry.total}
                          </span>
                          <p className="text-xs text-gray-400">
                            {Math.round((entry.correct / entry.total) * 100)}%
                          </p>
                        </div>

                        <div className="text-right w-16 flex-shrink-0">
                          <span className={`text-sm font-extrabold ${isTop3 ? 'text-indigo-600' : 'text-gray-700'}`}>
                            {entry.score}
                          </span>
                          <p className="text-xs text-gray-400">점</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}
          </div>

          {filtered.length > 0 && (
            <p className="text-center text-xs text-gray-300 mt-3" aria-hidden="true">
              상위 {Math.min(filtered.length, 20)}개 기록 표시
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
