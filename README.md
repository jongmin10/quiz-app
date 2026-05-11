# 🧠 상식 퀴즈 앱

React + Vite 기반의 한국어 상식 퀴즈 웹 애플리케이션입니다.  
한국사 · 과학 · 지리 · 예술과 문화 4개 카테고리에서 난이도 혼합 문제 10개를 풀고  
리더보드에 기록을 남길 수 있습니다.

---

## 🚀 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정 (Claude API 사용 시)
cp .env.example .env
# .env 파일에 실제 API 키 입력
# VITE_ANTHROPIC_API_KEY=sk-ant-...

# 3. 개발 서버 실행
npm run dev
# → http://localhost:5173

# 4. 프로덕션 빌드
npm run build
```

> **로컬 문제 은행 모드**: `src/data/questions.js`에 72개 문제가 내장되어 있어  
> API 키 없이도 즉시 실행됩니다.

---

## 🛠 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | React 19 + Vite 8 |
| 스타일링 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| 상태 관리 | React Hooks (useState · useEffect · useRef) |
| 데이터 저장 | localStorage (리더보드) |
| 언어 | JavaScript (ES Modules) |

---

## 📱 화면 구성

```
홈 (HomeScreen)
  ↓ 카테고리 선택 후 시작
로딩 (LoadingScreen)
  ↓ 문제 준비 완료 (에러 시 → 재시도 버튼)
퀴즈 (QuizScreen)
  ↓ 10문제 완료
결과 (ResultScreen)
  ↓ 닉네임 입력 → 저장
리더보드 (LeaderboardScreen)
```

### 주요 기능

- **퀴즈 진행**: 문제당 20초 타이머, 5초 이하 빨간 경고, 시간 초과 자동 처리
- **즉시 피드백**: 선택 즉시 정답(✅ 초록) / 오답(❌ 빨강) 표시 + 해설
- **점수 시스템**: 하 10점 · 중 20점 · 상 30점 (최대 180점)
- **등급 판정**: 90%↑ 천재 / 70%↑ 우수 / 50%↑ 보통 / 50%↓ 더 공부해요
- **오답 노트**: 틀린 문제 + 정답 + 해설 표시
- **리더보드**: 점수 내림차순 20위, 카테고리별 필터, 🥇🥈🥉 메달
- **접근성**: 키보드 1~4 보기 선택 · Enter 다음 문제 · aria-label 전체 적용
- **예외 처리**: 문제 생성 실패 시 에러 메시지 + 재시도 버튼

---

## 📂 폴더 구조

```
src/
├── api/
│   └── claudeApi.js          # Claude API 호출 (또는 로컬 문제 반환)
├── components/
│   ├── HomeScreen.jsx         # 카테고리 선택
│   ├── LoadingScreen.jsx      # 로딩 애니메이션 / 에러 화면
│   ├── QuizScreen.jsx         # 퀴즈 진행 (타이머 · 피드백 · 키보드)
│   ├── ResultScreen.jsx       # 결과 · 오답 노트 · 리더보드 저장
│   └── LeaderboardScreen.jsx  # 순위 목록 · 카테고리 필터
├── constants/
│   └── quiz.js                # 카테고리 · 난이도 점수 상수
├── data/
│   └── questions.js           # 로컬 문제 은행 (72문제)
├── hooks/
│   └── useLeaderboard.js      # localStorage CRUD 훅
├── App.jsx                    # 화면 전환 (screen state)
└── main.jsx                   # 엔트리포인트
```

---

## ⌨️ 키보드 단축키

| 키 | 동작 |
|----|------|
| `1` ~ `4` | 보기 A~D 선택 |
| `Enter` | 다음 문제 이동 |
| `Tab` | 버튼 포커스 이동 |

---

## 📊 점수 체계

| 난이도 | 문제 수 | 정답 점수 |
|--------|---------|----------|
| 하 (쉬움) | 4문제 | 10점 |
| 중 (보통) | 4문제 | 20점 |
| 상 (어려움) | 2문제 | 30점 |
| **합계** | **10문제** | **최대 180점** |

---

## 🔒 보안

- API 키는 `.env` 파일에만 저장 (`.gitignore` 적용)
- `.env.example`로 키 형식만 공유
- `dangerouslyAllowBrowser: true` — 개발/학습용 설정  
  (운영 환경에서는 서버사이드 프록시 권장)
