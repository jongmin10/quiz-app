import { useState } from 'react';
import { CATEGORIES } from '../constants/quiz';

const CATEGORY_META = {
  '한국사':    { icon: '📜', desc: '조선시대부터 근현대사까지' },
  '과학':      { icon: '🔬', desc: '물리·화학·생물·지구과학' },
  '지리':      { icon: '🌍', desc: '세계 지리와 자연환경' },
  '예술과 문화': { icon: '🎨', desc: '음악·미술·문학·전통문화' },
};

export default function HomeScreen({ onStart, onLeaderboard }) {
  const [selected, setSelected] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selected) onStart(selected);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 타이틀 */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4" aria-hidden="true">🧠</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">상식 퀴즈</h1>
          <p className="text-gray-500">카테고리를 선택하고 실력을 확인해보세요!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset>
              <legend className="text-sm font-semibold text-gray-600 mb-3">카테고리 선택</legend>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelected(cat)}
                      aria-label={`${cat} 카테고리 선택 — ${meta.desc}`}
                      aria-pressed={selected === cat}
                      className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 font-medium transition-all duration-150 ${
                        selected === cat
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/30'
                      }`}
                    >
                      <span className="text-2xl" aria-hidden="true">{meta.icon}</span>
                      <span className="text-sm">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="bg-indigo-50 rounded-xl p-3 text-center" aria-label="퀴즈 안내">
              <p className="text-sm text-indigo-700 font-medium">문제 10개 · 문제당 20초</p>
              <p className="text-xs text-indigo-500 mt-0.5">하(4) · 중(4) · 상(2) 난이도 혼합</p>
            </div>

            <button
              type="submit"
              disabled={!selected}
              aria-label={selected ? `${selected} 카테고리 퀴즈 시작` : '카테고리를 먼저 선택해주세요'}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold text-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              퀴즈 시작 🚀
            </button>
          </form>

          <button
            type="button"
            onClick={onLeaderboard}
            aria-label="리더보드 화면으로 이동"
            className="mt-3 w-full py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            🏆 리더보드 보기
          </button>
        </div>

        <p className="text-center text-xs text-gray-300 mt-4" aria-hidden="true">
          키보드로도 이용 가능 · <kbd className="px-1 bg-gray-100 rounded">Tab</kbd> 으로 이동
        </p>
      </div>
    </div>
  );
}
