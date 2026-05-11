const CATEGORY_ICONS = {
  '한국사': '📜',
  '과학': '🔬',
  '지리': '🌍',
  '예술과 문화': '🎨',
};

/* 도트 애니메이션 컴포넌트 */
function LoadingDots() {
  return (
    <div className="flex justify-center gap-2 mt-6" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce"
          style={{ animationDelay: `${i * 0.18}s`, animationDuration: '0.9s' }}
        />
      ))}
    </div>
  );
}

/**
 * @param {{ category: string, error: string, onRetry: () => void, onHome: () => void }} props
 */
export default function LoadingScreen({ category, error, onRetry, onHome }) {
  /* ── 에러 상태 ── */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">문제 생성 실패</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onRetry}
              aria-label="퀴즈 문제 다시 생성하기"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl transition-colors"
            >
              🔄 다시 시도
            </button>
            <button
              onClick={onHome}
              aria-label="홈 화면으로 돌아가기"
              className="w-full py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-medium rounded-xl transition-colors"
            >
              🏠 홈으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 로딩 상태 ── */
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      role="status"
      aria-label={`${category} 퀴즈 문제를 생성하고 있습니다`}
      aria-live="polite"
    >
      <div className="text-center">
        {/* 회전 링 */}
        <div className="relative w-28 h-28 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-4xl" aria-hidden="true">
            {CATEGORY_ICONS[category] ?? '🤔'}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">문제 생성 중</h2>
        <p className="text-gray-500 mb-0.5">
          <strong className="text-indigo-600">{category}</strong> 퀴즈를 준비하고 있어요
        </p>
        <p className="text-sm text-gray-400">잠시만 기다려주세요 ✨</p>

        {/* 도트 애니메이션 */}
        <LoadingDots />
      </div>
    </div>
  );
}
