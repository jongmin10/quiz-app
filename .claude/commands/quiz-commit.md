---
description: 변경된 파일을 분석해 커밋 메시지를 작성하고 git add·commit·push까지 실행합니다.
---

아래 순서대로 실행해줘.

## 1. 변경사항 파악
`git status`와 `git diff`를 실행해서 변경된 파일과 내용을 확인해줘.

## 2. 커밋 메시지 작성
변경 내용을 분석해서 아래 형식으로 커밋 메시지를 작성해줘.

**형식:**
```
<type>: <한국어 요약 (50자 이내)>

- 변경 사항 1
- 변경 사항 2
```

**type 규칙:**
- `feat` — 새 기능
- `fix` — 버그·오류 수정
- `refactor` — 기능 변경 없는 코드 개선
- `style` — UI·스타일 변경
- `docs` — 문서 변경
- `chore` — 설정·빌드·패키지 변경

## 3. 실행
1. 스테이징할 파일 목록을 보여주고 확인받은 뒤
2. `git add` → `git commit` → `git push` 순서로 실행해줘.
3. `.env` 파일은 절대 스테이징하지 마.
4. 커밋 메시지 끝에 항상 아래를 추가해줘:
   ```
   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   ```
