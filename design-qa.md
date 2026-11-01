# 경제 그래프 실험실 · 선택한 1안 구현 검수

Date: 2026-11-01 (Asia/Seoul)

final result: passed

## 비교 대상과 상태

- Source visual truth: `/Users/a/.codex/generated_images/01a19571-8629-7740-9182-2286bd250e6a/exec-5e14ab60-0c2b-4144-b40c-f9c223b247a7.png` (채팅에 첫 번째로 표시된 목업).
- Implementation: `http://127.0.0.1:8000/`.
- Screenshot: `/Users/a/.codex/visualizations/2026/11/01/01a19571-8629-7740-9182-2286bd250e6a/market-graph-mockups/implementation-desktop.jpg`.
- State: 3차시 → 수요 새로 그리기 → 선호도 상승 → 새 수량 표 공개 → 첫 행 선택 → 24개·1,000원의 후보 점 선택. 확정한 점 0개, 선과 이전 곡선은 미공개.
- Source and implementation pixels: both 1487 × 1058. CSS viewport 1487 × 1058; screenshot pixel/CSS ratio 1:1. No resizing in the comparison artifacts.
- Full-view side-by-side evidence: `.../market-graph-mockups/comparison-final.jpg` (위 screenshot과 같은 디렉터리).
- Focused side-by-side evidence: `comparison-table.jpg`, `comparison-action.jpg`. 표의 선택 표시·숫자 가독성 및 주 버튼·현재 좌표를 별도로 확대 비교했다.

## 비교 이력

1. First pass: blocked (P2).
   - Evidence: `implementation-first.jpg`, `comparison-first.jpg`.
   - 제목과 확정 버튼이 원본보다 작아 위계가 약했다. 표가 남는 높이를 모두 차지하여 행 간격이 지나치게 벌어졌다. 그래프 아래 별도 좌표 선택 버튼이 그래프의 공간을 줄였다. 후보 점도 목업의 파란 빈 원과 달랐다.
2. Fixes and second pass: passed.
   - 제목을 viewport에 맞춰 최대 58px로, 확정 버튼을 26px·최소 너비 330px로 조정했다. 표의 행 높이를 명시하고 전체 높이 채우기를 제거했다. 좌표 선택 보조 버튼을 표 아래로 옮기고, 후보 점을 수요/공급 색상의 빈 원으로 변경했다.
   - Post-fix evidence: `implementation-desktop.jpg`, `comparison-final.jpg`, `comparison-table.jpg`, `comparison-action.jpg`.
   - 선택한 방향의 상단 차시·장면, 수평 진행 표시, 좌측 표·우측 그래프, 하단 단일 주 행동 구성이 유지된다. 발견된 P0/P1/P2 항목이 남아 있지 않다.

## 필수 시각 표면

- Fonts/typography: 기존 한국어 시스템 sans-serif를 유지했다. 큰 질문, 표·그래프 지시, 데이터, 주 행동 순으로 크기와 굵기를 나눴다. 비교 상태의 제목과 버튼이 잘리지 않고 한 줄로 보인다. 시스템 글꼴의 자형은 생성 목업과 미세하게 다르다(P3).
- Spacing/layout: 표/그래프 비율 약 39:61, 12px 사이 간격, 16px 패널 모서리, 일관된 내부 여백. 참고 목업과 같은 핵심 영역이 한 화면에 들어간다. 그래프는 기존 SVG의 수학적 좌표계와 비율을 유지하므로 목업보다 좌우 안쪽 여백이 조금 넓다(허용한 기존 동작 유지).
- Colors/tokens: 기존 배경 #F3EFF9, 패널 #FFFCFF, 보라 #6B4C93, 본문 #30243C, 수요 #216BA5, 공급 #A43D70을 유지했다. 선택은 보라 배경·왼쪽 선·선택 기호로 함께 구분한다. 확정한 행만 체크를 표시한다.
- Image quality/assets: 별도의 사진·삽화가 없는 화면이다. 기존 브랜드 마크와 데이터 기반 SVG 그래프를 유지했다. 목업을 배경 이미지로 넣거나 그래프를 이미지로 대체하지 않았다. 목업의 장면 버튼 장식 아이콘은 필수 정보가 아니어서 추가하지 않았다.
- Copy/content: 표를 유일한 가격 선택기로 사용한다. 주 버튼은 현재 단계에 맞는 실제 행동명으로 바뀐다. 다음 장면 이동은 목적지를 표시한다. 후보 선택과 확정, 선 연결, 이전 곡선 공개를 각각 분리했다. 오류 안내와 키보드용 좌표 선택은 보존했다.

## 브라우저에서 확인한 동작

- 그래프 클릭으로 잘못된 후보 점(16개·3,000원)을 고르고 확정했을 때 오류 안내가 나타나며 점이 기록되지 않았다.
- 표 좌표 선택 및 다섯 점의 개별 확정, 다음 가격 선택.
- 5개 점을 모두 확정해도 선이 자동 공개되지 않음. 「점 연결하기」 후에도 이전 곡선은 숨김. 「이전 곡선과 비교하기」를 눌러야 이전 곡선 공개.
- 완료 후 목적지가 적힌 버튼으로 공급 활동 이동.
- 공급 상황 선택, 상황 변경 dialog 열기, 다른 상황 선택 후 해당 그래프만 초기화.
- 되돌리기: 비교 → 선 → 확정한 점 순으로 되돌림.
- 표의 ArrowDown 이동 후 선택 행과 키보드 포커스가 함께 유지됨. 표 좌표 선택 후 확정 버튼으로 포커스 이동.
- 콘솔 error 로그: 0개(브라우저 개발 로그 확인).

## 화면 크기와 자동 검증

- 1366 × 768: 네 차시의 13개 장면 모두 올바른 활성 장면을 확인했다. 가로/세로 문서 크기가 viewport를 넘지 않았고 주 버튼 하단은 743px이었다. 상세 기록: `layout-checks.json`.
- 390 × 844: 가로 overflow 없음, 표/그래프가 세로로 배치되고 주 행동 영역이 화면 아래 유지된다. 작은 화면에서는 세로 스크롤을 사용한다. Evidence: `implementation-mobile.jpg` (390 × 1551 full-page screenshot; sticky footer는 캡처 당시 viewport 하단에 표시됨).
- 자동 검증: `node tests/workflow.test.cjs` 통과. 13개 장면 렌더링, 네 변화 상황, 잘못된 좌표 거부, 후보 선택/확정 분리, 선/이전 곡선 공개 분리, 되돌리기, 비단조·동일 수량의 실제 응답 유지, 네 새 균형 계산을 확인한다.
- `git diff --check` 통과.

## 남은 범위

- 실제 교실 프로젝터, 다른 브라우저 엔진, 보조공학의 종합 검사는 수행하지 않았다.
- 기회비용 실험실과 공개 배포본은 변경하지 않았다.
- 외부 라이브러리·빌드 단계·새 서버는 추가하지 않았다.

## 후속 오류 수정 · 현재 앱 창 크기 검수

이전 검수는 현재 앱의 853 × 827 크기를 놓쳤다. 사용자 오류 신고 후 다음 문제를 실제 화면에서 재현하여 수정했다.

- **확정 버튼이 화면 밖으로 밀림:** 853 × 827에서 문서 높이 1088px, 주 버튼 하단 약 1061px이었다. 중간 폭에서 고정 화면 높이와 간결한 표·진행 표시를 적용하고 하단 행동 영역을 유지했다. 수정 후 문서 853 × 827, 주 버튼 하단 804px. Evidence: `bugfix-current.jpg`.
- **확정한 행이 계속 그래프 입력을 받음:** 확정 뒤에도 후보 좌표를 선택할 수 있었으나 주 버튼은 다음 가격 선택 동작을 수행했다. 확정한 행과 미기록 행은 그래프를 읽기 전용으로 표시하고, 확정한 행에는 다음 가격 선택 안내를 표시한다. 네 변화 상황의 각 점 확정 후 입력 그래프가 없는지를 자동 회귀 검증에 추가했다. 브라우저에서도 실제 확정 후 점 1개·읽기 전용·다음 가격 버튼을 확인하고 되돌렸다.
- **비교표의 아래 행이 가려짐:** 설명과 표가 좁은 영역에 세로로 누적되어 표 하단 800px이 footer 시작 741px과 겹쳤다. 설명을 왼쪽 조작부로 옮겨 표 하단 551px로 수정했다. 네 상황 버튼도 높이 48px로 복구했다. Evidence: `bugfix-summary.jpg`.
- **모바일 주 버튼 글자 넘침:** 390px 폭의 비교표 장면에서 주 버튼이 78px로 줄고 문서가 432px까지 넘쳤다. 해당 화면의 주 버튼을 별도 전체 너비 행에 배치했다. 수정 후 버튼 340px, 문서 너비 390px. Evidence: `bugfix-mobile-summary.jpg`.

검증 결과:

- 현재 853 × 827에서 13개 장면의 주 버튼 표시를 확인했다. 비교표에서만 발견된 추가 overflow도 수정 후 재확인했다.
- 761 × 827, 1100 × 768, 700 × 827, 390 × 844, 1366 × 768에서 공급 점 찍기·비교표를 검사했다. 좁은 화면은 세로 스크롤을 사용하며 주 버튼은 화면 안에 유지된다. 모바일 비교표에서 발견된 글자 넘침은 위와 같이 추가 수정·재검증했다.
- `node tests/workflow.test.cjs`, `git diff --check` 통과. 브라우저 error 로그 0개.
- 수업 전체 초기화나 저장 기록 삭제는 수행하지 않았다. 검증용으로 확정한 점은 되돌리고 기존 공급 점 찍기 활동으로 복귀했다. 현재 선택한 후보 점은 아직 확정하지 않았다.
- 외부 배포 및 다른 브라우저 엔진 검증은 수행하지 않았다.

final result: passed

## 부가 문구 정리 · 사용자 요청 반영

사용자가 각 장면에서 집중을 흐트리는 부가 문구를 삭제하도록 요청하여, 목업의 문구보다 이번 요청을 우선했다.

- 13개 장면의 반복 부제, 학생 응답을 독려하는 진행 멘트, 표·그래프의 내용을 다시 읽는 설명, 중복 기록 수·차시 위치·상태 라벨을 제거했다.
- 점 찍기의 지시는 「가격 선택」「점 위치 선택」으로 줄였다. 조건 변화 설명과 결과를 미리 알려 주던 상황 선택 버튼의 부연 문장도 제거했다.
- 설명 패널, 빈 피드백 바, 비교표의 해설 문단을 기본 화면에서 제거했다. 핵심 결과는 해당 공개 단계를 실행할 때만 짧게 표시하며 자세한 개념은 「설명 보기」「수업 안내」에서 확인한다.
- 실제 응답/예시/가상 자료의 구분, 수업 모형의 필수 조건, 미기록 안내, 잘못된 점의 오류, 입력 접근성 레이블 및 음성 안내는 보존했다.
- 브라우저에서 13개 장면을 확인했다. 일반 상태의 하단 피드백은 모두 비어 있고 숨겨져 있다. 주 버튼은 모든 장면에서 화면 안에 표시된다. 비교표 결과 공개와 되돌리기도 확인했다. error 로그 0개.
- Evidence: `copy-cleanup-survey.jpg`, `copy-cleanup-plot.jpg`, `copy-cleanup-summary.jpg`, `copy-cleanup-review.json` (기존 검수 이미지와 같은 디렉터리).
- `node tests/workflow.test.cjs`, `git diff --check` 통과. 로컬 서버를 다시 실행하고 정리한 첫 화면을 새 브라우저 탭에 열어 두었다.

final result: passed

## 구매 의향 조사 모달

- 구매 의향 화면의 왼쪽 입력 사이드바를 제거하고 응답 표를 전체 폭으로 표시한다. 학급 인원과 구매 의향 인원은 조사 모달 안에서만 입력한다.
- 「구매 의향 조사」 → 1,000원부터 5,000원까지 가격별 기록 → 마지막 기록 후 표 복귀. 기록한 값은 저장하며, 중간에 닫으면 첫 미기록 가격부터 이어간다. 표의 가격을 누르면 해당 응답을 수정한다.
- 입력 검증은 0명부터 학급 인원까지의 정수, 학급 인원은 5~60명이며 기존 응답 이상이다. 값이 바뀔 때만 연결된 수요 그래프를 초기화한다. 예시 모드에서 실제 조사를 시작하면 이전 실제 응답으로 돌아간다.
- 브라우저 검증은 별도 origin인 `http://127.0.0.1:8002/`에서 수행해 실제 수업 기록에 시험값이 섞이지 않게 했다. 25명 입력 거부(학급 24명), 0명 입력, Enter 기록, 2,000→3,000→4,000→5,000원 이동, 마지막 기록 후 모달 닫기, 표에서 응답 수정 창 열기, 이전 가격 이동, 저장 후 새로고침, Escape 닫기 및 주 버튼 포커스 복귀를 확인했다.
- 조사 완료 후 시험 응답 0/20/12/8/4가 그대로 유지되는 것을 확인했다. 사이드바 너비는 0이며 화면에 표시되지 않는다.
- 853×827, 390×844, 1366×768에서 모달의 입력칸과 주 버튼이 화면 안에 있고 가로 넘침이 없었다. 낮은 화면에서 표의 마지막 행도 footer 앞에 표시되도록 행 높이를 조정했다.
- Evidence: `survey-modal-main.jpg`, `survey-page-main.jpg`, `survey-modal-390.jpg`, `survey-modal-checks.json` (이전 검수 이미지와 같은 디렉터리).
- `node tests/workflow.test.cjs`의 기존 검증과 새 조사 모달 검증이 통과했다. 범위 밖/소수/빈 입력, 0명, 조사 순서·완료, 개별 수정, 실제/예시 분리를 포함한다. 브라우저 error 로그 0개.
- 사용 중인 8000번 화면에는 1,000원 조사 모달을 열어 두었으며 실제 응답은 새로 입력하지 않았다. 외부 배포는 수행하지 않았다.

final result: passed


## 상단을 세 활동으로 재편 (2026-11-01)

- 상단: 수요곡선 만들기 → 공급곡선 만들기 → 시장 균형 확인하기.
- 수요 아래에는 구매 의향·수요 점 찍기, 공급 아래에는 판매 계획·공급 점 찍기만 표시한다. 곡선 새로 쓰기·새 균형 비교는 탐색과 수업 안내에서 제거했다.
- 점 연결 후 주 버튼, 다음·이전, 방향키도 수요→공급→시장 순서에 맞춘다. 기존 응답·그래프와 기록 불러오기 형식은 보존하고, 제거된 활동의 저장 위치는 사용 가능한 활동으로 돌린다.
- Node 회귀 검사 통과: 활동 전환·완료·이전 이동·기록 보존, 기존 조사·점 찍기 검증.
- 실제 브라우저 853×827에서 세 상단 버튼과 각 하위 화면을 확인했다. 기존 실제 응답 2 / 24 / 12 / 미기록 / 미기록 유지, 콘솔 경고·오류 없음.
- 화면: three-activity-navigation.jpg. 별도 서체·색상 개편은 이번 변경에 포함하지 않았다.


## White and Cobalt — selected design implementation (2026-11-01)

Source: `/Users/a/.codex/generated_images/01a19571-8629-7740-9182-2286bd250e6a/exec-311fef38-be6f-470b-afd9-663606989d8f.png` (the first displayed result of the latest ideation set).

Initial comparison: `cobalt-comparison-full.jpg` and `cobalt-comparison-modal.jpg`, source and implementation both 1487×1058. Survey state is 4/5, class size 24, 4,000원으로 올랐습니다, blank count, question 이래도 살래요? 진짜?. The source's obsolete navigation and supply-screen backdrop are superseded by the user's explicit three-activity navigation and survey-table workflow.

- P1, found during responsive verification: table-cell padding was applied around an already padded price button and pushed the fifth row / coordinate action beyond the panel at 1280×720. Fixed by setting plot table-cell padding to zero and keeping padding on its button; captured all rows and the action within the rail.
- P2, initial modal comparison: Korean product/question text is visibly smaller than the reference; increase product 26→30px, question 40→44px, sentence ending 28→30px, retaining regular body weights.
- P2, initial modal comparison: primary color is slightly more indigo than the reference. Move the common cobalt token from #315EEB to #2458ED, including inline graph cues.
- P3: native dialog is vertically centered rather than the source image's lower placement; this is intentional for varying viewport sizes.

Initial result: blocked pending type/color adjustment and new combined comparison.

### Post-fix comparison and verification

Reopened the updated full-view and focused combined comparisons. Product text is now 30px, the question is 44px, and the sentence ending is 30px at the reference desktop size; compact/mobile rules scale these down. Buttons now use the reference's approximate 1:1.2 width balance. Shared cobalt is #2458ED. Both earlier P2 findings are resolved.

Required fidelity surfaces:

- Fonts/typography: bundled Pretendard Variable v1.3.9 with 45–920 declared weights. Body and inputs inherit it; SVG chart text inherits the same family. Regular body text, medium UI controls, semibold headings and large tabular prices reproduce the selected hierarchy without making every label heavy. Native number-input and focus behavior remains intact.
- Spacing/layout: 750px dialog, 16px radius, thin separators, restrained shadow, full-width header navigation with active underline, white table/graph surfaces. Both comparison images use 1487×1058 captures at one pixel per CSS pixel. The modal crops align dialog bounds for detailed inspection. Normal native vertical centering is an accepted P3 difference.
- Colors/tokens: white #FFFFFF, dark ink #172238, cobalt #2458ED, light borders #DFE4EC and soft blue #EEF3FF applied across all available activities, guide/reset/completion dialogs and the survey. Demand remains cobalt; supply uses contrasting #B95032 and equilibrium #147064 to preserve chart meaning. Inline SVG price cues and text were updated with the common palette.
- Image/asset quality: the selected design has no illustrative content. Removed the old custom ice-cream illustration and brand mark; chart SVGs remain functional data visualizations. No placeholder or generated raster UI is used. Font file and OFL license are local, with no runtime CDN dependency.
- Copy/content: user-required questions remain unchanged, including 4,000원 “이래도 살래요? 진짜?” and 5,000원 “정말 살거에요?”. “아이스크림 한 개” and the sequential “으로 올랐습니다.” ending remain. The newer three-activity navigation intentionally replaces the outdated four-lesson mock navigation. No auxiliary prose was added to the product.

Verification evidence:

- `cobalt-checks.json` and `cobalt-*.jpg` in the session's market-graph-mockups folder.
- At 1280×720, visited all activity surfaces: purchase table, demand plotting, supply plan, supply plotting, market quantities, shortage, surplus and equilibrium. All use the same font/white background, with no horizontal overflow; the plotting table and coordinate button fit within their panel and primary actions remain visible.
- Exercised coordinate selection → point confirmation → undo using an isolated 8002 origin. Checked guide dialog, modal previous/next, blank input focus, and the sequential 4,000원 question. Main origin's actual class responses were not edited.
- At 390×844, inspected survey, plotting and market surfaces. Reduced the plotting footer height and suppressed its empty status area. Vertical document scrolling is intentional; no horizontal overflow. At both 853×827 and 390×844, the entire survey dialog fits inside the viewport.
- Final real-app capture: `cobalt-final-modal.jpg`, 853×827, 4/5 with the original blank 4,000원 response. Live page remains at http://127.0.0.1:8000/.
- Browser console: no errors or warnings. Existing workflow regression suite passed; `git diff --check` passed.

Remaining P3 differences: the native close button says “닫기” without a redundant × icon; the native number steppers follow the browser's platform rendering. These do not affect hierarchy or operation. No P0/P1/P2 findings remain.

final result: passed

## Annotation: remove class-size setting from the survey dialog

- Moved the existing labeled class-size input to the response-table toolbar. The modal header now contains only progress and close; input bounds, stored size and recorded responses are preserved.
- At the actual 853×827 viewport, verified the updated table toolbar and reopened 2,000원 (24) and 4,000원 (blank) dialogs without saving responses. The class-size input is outside the dialog DOM; only the purchase-intention count is editable during the modal.
- Evidence: `class-size-on-table.jpg`, `survey-without-class-size.jpg`, `survey-without-class-size-2000.jpg` in the session capture folder. This intentionally supersedes the class-size placement in the selected mockup per the user's annotation.
- Existing workflow tests and `git diff --check` pass. No browser errors or warnings. No new runtime logic or dependency.

final result: passed


## Comprehensive UI/UX fixes

The selected font/color system remains intact. Flow, state, focus and responsive fixes are documented with current-run evidence in `ui-ux-review.md`. Completed the full survey→demand curve→supply curve→market equilibrium workflow in isolated origins, verified keyboard behavior and multi-window synchronization, and retained actual responses 2 / 24 / 12 / 1 / 2 on the real origin. Corrected blank side panels, duplicate/frozen actions, guide selection, error clipping, equilibrium label collisions and class-size input handling. No P0/P1/P2 findings remain in the checked flows. Device/screen-reader and external deployment limits are explicit in the report.

final result: passed


## Price-first point plotting animation

- Added to valid point confirmation on both demand and supply plots. The marker rises from the origin along the price axis (600ms), pauses at the selected price (220ms), moves horizontally to quantity (800ms), then settles (200ms). Price and quantity cells highlight in that order. Existing confirmed points stay visible; stored values are unchanged.
- New point data is committed before the animation. The next action is temporarily disabled during the flight, then re-enabled; keyboard focus returns if it was on the action button. Navigation/undo rerenders cancel the frame without losing recorded points. Animation state is transient and not serialized.
- Actual browser capture of 2,000원·24개: six captured price-only frames followed by ten horizontal-motion frames; final dot visible, highlight/overlay removed, next action enabled. GIF and frame metadata are in the session's `point-animation/` folder. The source frames were inspected before assembling the GIF.
- Verified supply animation, navigation during animation, and reduced-motion preference. Reduced motion shows the final point immediately. No console errors/warnings. Unit checks cover price-before-quantity timing, exact final position, zero quantity, supply axis range, invalid-point rejection and unchanged record validity. Existing tests and whitespace checks pass.

final result: passed

## Annotation: remove coordinate hint buttons

Removed both quantity/price hint controls and their action handlers. Plot rendering ignores legacy hint flags, and undo no longer exposes a hidden-guide action. Existing records remain valid, while price-first point confirmation animation and its temporary trail are preserved. Updated the guide and regression checks. At the actual 853×827 viewport verified zero hint buttons, zero saved guide lines, unchanged responses 2 / 24 / 12 / 1 / 2. Capture: `no-hint-buttons.jpg`. Existing workflow and animation tests plus whitespace checks pass.

final result: passed


## Annotation: incorrect-coordinate feedback in a modal

Moved incorrect-point feedback from the stage banner into a native, labelled dialog with the existing message and a single “다시 선택하기” action. The wrong candidate remains visible for comparison. Both the button and Escape dismiss the dialog and restore focus to the graph; a correct retry still records/animates normally. At 853×827, reproduced 2,000원·12개 against 2,000원·24개 in an isolated origin, verified no duplicate inline message, close/focus behavior and successful correction. Captured `point-error-modal.jpg`; no console errors/warnings. Regression tests and whitespace checks pass.

final result: passed


## Annotation: stable plotting header

Moved “점 위치 선택” into the source header at the graph’s upper right. The header stays present after point confirmation; the curve legend uses the same row when connected. Reserved the coordinate-button slot so its disappearance cannot resize the adjacent graph. In the browser, SVG x/y/width/height were identical before selection, with a candidate, during confirmation and at the next row at 853×827; they also stayed identical through all points and line connection at 1280×900. Checked 390px layout for horizontal overflow (none). Existing workflow/animation/modal tests and whitespace checks pass. Actual responses and confirmed points were retained; both local user tabs were refreshed. Evidence: `stable-graph-header.jpg` and `stable-graph-header-metrics.json` in the session artifact directory. No external deployment or physical-device check.

final result: passed


## Market continuity: reuse the drawn curves

Replaced the separate example market with the exact confirmed vertices/lines from the demand and supply activities. Display, readouts, shortage/surplus and equilibria all use the same piecewise-linear data. Calculations stay in the shared recorded price range; missing curves lead back to completion. Multiple crossings, no crossing and coincident intervals are represented without changing class responses. Price steps stop at an intervening crossing and at range boundaries; fractional prices remain valid for saving/loading and undo. A curve signature initializes old or changed market lessons with matching shortage/surplus starting prices, while unchanged rerenders retain market progress. Teacher guide and README updated.

At 853px, the actual local demand plot and market SVG demand paths matched exactly. Actual 2,000원 readout was demand 24 / supply 8. An isolated full workflow using the same responses 2 / 24 / 12 / 1 / 2 displayed both crossings (1,111.1원·4.4개 and 3,000원·12개). Existing class/plot records were retained. Verified required-curve return flow, source labelling and no console warnings/errors. The market canvas has a minimum height and can scroll, preventing multi-line equilibrium results from overlapping the graph/readout at 853×827 and 1280×720. Evidence: `market-live-connected.jpg` (actual origin) and `market-uses-drawn-curves.jpg` (isolated completed workflow). Regression checks cover exact curve reuse, interpolation, multiple/no/shared-segment equilibria, sparse rows, fractional stepping/undo, boundary limits, changed-data initialization and large-class axes; all existing tests pass. No external deployment or physical-device check.

final result: passed


## Latest build gate — market screen, selected option 3

**Target and evidence**

- Visual truth: `/Users/a/.codex/generated_images/01a19571-8629-7740-9182-2286bd250e6a/exec-9db188a8-3df3-46c8-8792-4c03955072ea.png`, the third displayed image in the latest ideation set (Compare Then Adjust).
- Implementation: `http://127.0.0.1:8000/`, current actual class data, price 2,000원, demand 24개 / supply 8개, quantities revealed and prediction not yet opened.
- Source image: 1274×1234 pixels. It was normalized in full to 853×827 (approximately 1.494× density; aspect difference below 0.1%). Implementation screenshot: 853×827 CSS/pixels at deviceScaleFactor 1, without browser chrome.
- Evidence directory: `/Users/a/.codex/visualizations/2026/11/01/01a19571-8629-7740-9182-2286bd250e6a/market-graph-mockups/market-option3/`. Actual-origin capture `live-final.png`; side-by-side evidence `comparison-final.png`; focused quantity/type and bottom-control comparisons `comparison-details.png`. Both combined comparisons were opened and visually inspected.

**Findings and comparison history**

- First comparison (`comparison-1.png`): blocked [P2]. Figures were too small and spread too far apart; the chart was vertically compressed relative to the target. Fixed by centering a 528px comparison group, using 54px numerals, correcting title weight/size and chart padding, reducing excess footer height, and fitting chart geometry to its actual container rather than stretching its type.
- Second comparison (`comparison-2.png`): no remaining major hierarchy drift. Subsequent responsive checks found [P2] mobile sticky footer covering price controls (`mobile-390.png`) and [P2] the 1280×720 viewport pushing the main action below the fold (`desktop-1280.png`). Fixed by using normal document flow for the phone footer and compact sizing for short desktop viewports. Rechecked in `mobile-390-final.png` and `desktop-1280-final.png`; phone controls are uncovered and scrollable, and the short desktop document is exactly 720px high with the footer ending at 710px.
- Final combined comparison (`comparison-final.png`, `comparison-details.png`): no actionable P0/P1/P2 findings. The three activity navigation labels, title/source, large centered quantities, full-width chart, bottom price controls and sole primary action follow the chosen hierarchy. At 853×827, all controls fit with document height 827px.

**Required fidelity surfaces**

- Fonts/typography: local Pretendard verified through computed style; 54px quantity figures, 34px title, readable chart labels and distinct numeric hierarchy. No wrapping/clipping at the target state. Title and navigation retain the existing project's typography rather than rasterizing the generated text.
- Spacing/layout: comparison figures centered around the divider; graph occupies the central surface; price controls and footer remain below it. Bounded chart, quantities, price and footer rectangles were identical before prediction, after prediction, after price change and after equilibrium reveal (`layout-metrics.json`).
- Colors/tokens: existing white/navy/cobalt/rust tokens retained across functional curves, figures and controls. Primary is the existing solid cobalt rather than the mock's incidental generated gradient.
- Image/assets: no photo, illustration or decorative raster asset occurs in this design. The chart remains a functional, accessible SVG visualization of the recorded data. Full text price buttons make the optional decorative plus/minus glyphs unnecessary; no handcrafted replacement asset was added. Type and lines remain sharp during resize.
- Copy/content: chosen title, source, quantities, price, action labels and three high-level activities match the target. No four subordinate tabs, separate control sidebar, permanent prediction group, extra legend, inline result banner or competing Next button. Empty required-curve guidance remains accessible.

**Interactions and verification**

- Native prediction modal: three visible choices; selection records the prediction and closes it. Escape closes without recording and returns focus to the main action.
- Reaction modal: actual 24−8=16 excess demand, correct price pressure, functional price-adjust action. Price change resets the reveal for the new price; undo restores the previous price/phase.
- Equilibrium modal shows both actual crossings (1,111.1원·4.4개 and 3,000원·12개). Reveal can be undone; finishing opens the existing end-of-activity dialog directly, without visiting hidden legacy subscenes.
- Existing stored class responses, confirmed vertices, connected lines, prediction and legacy state shape were preserved on the real origin. Actual market was left at 2,000원 / 24개 / 8개 with the prediction action visible. Both user tabs were refreshed.
- Tested 853×827 and 1280×720 desktop, 390px phone, 60-person axis spacing, required-curve return path and fresh survey recovery. Narrow 60-person charts use 10-unit ticks. No horizontal overflow or console errors/warnings in the checked flow.
- All regression checks pass: earlier survey/plot/animation/synchronization tests plus exact normalized vertices, interpolation/intersections, modal prediction→reaction→adjust flow, fractional price controls, undo, equilibrium reveal and finish. `git diff --check` passes.

**Accepted differences / follow-up polish**

- [P3] Minor generated-font/curve-marker differences remain: only the active price's two points are emphasized, preserving the app's existing deliberate reveal behavior, rather than marking every vertex as the mock did. Text-labelled price buttons omit redundant symbolic icons. Both are intentional functional choices, not blocked assets.
- Physical phone and dedicated screen-reader hardware were not available; keyboard/focus, native dialog semantics and emulated responsive layouts were verified. No external deployment was performed.

**Implementation checklist**

- [x] Apply the selected hierarchy and responsive chart layout.
- [x] Preserve recorded curves, calculations and persistence.
- [x] Complete prediction/result/price/undo/finish actions.
- [x] Fix responsive overlap and verify final combined evidence.
- [x] Pass regression checks and leave the local app available.

final result: passed


## Latest annotation — remove source copy, right-side live price slider

Removed the market source paragraph and bottom price buttons. The current price and native vertical range control now sit to the graph's right, with the thumb aligned to the selected price height. The input has an explicit label, vertical orientation and formatted currency value. No new raster assets or dependencies were needed.

Quantities are always visible and update with the two reading dots/price line during `input`. The slider element is retained throughout a drag; only derived text and SVG content are repainted. One gesture records one bounded undo entry; returning to its starting price restores the former prediction without adding an entry. Release/blur/cancel commits once, saves and synchronizes other windows. Other actions finish any pending gesture. Prediction/result/equilibrium modals and existing recorded curves remain available. Legacy market navigation via bare arrow keys is suppressed so the slider keyboard controls cannot send users into hidden subscenes.

Browser evidence in `/Users/a/.codex/visualizations/2026/11/01/01a19571-8629-7740-9182-2286bd250e6a/market-graph-mockups/market-slider/`:

- `first-pass.png` at the annotation's 1093×827 viewport; source text and bottom controls absent, current price shown at right.
- `drag-held.png`: actual mouse press held through 2,300→2,500→3,000원; live readouts changed 20.4/9.2→18/10→12/12 without releasing or losing slider focus. Price-thumb height matched the horizontal graph price line.
- Reload retained 3,000원; a single undo restored 2,000원. ArrowUp increased price; End/Home reached 5,000/1,000원.
- A second isolated window stayed at its committed 1,000원 during the held drag, then received 2,500.2원 on release. The accessibility announcement included the final price and both quantities.
- `mobile-390.png`, `layout-853.png`, `layout-1280.png`: right-side control retained, readable chart axes, no horizontal overflow. The 1280×720 document remained 720px tall with its footer ending at 710px. No console warnings/errors.
- `live-final.png`: actual user origin after refresh, preserving the user's current example data at 1,000원 / demand 20 / supply 4. It was opened and inspected. No extra source/status copy was introduced.

Existing regressions and the new gesture-level tests pass: live quantity values, currency accessibility text, one-entry drag undo, restoration of price/prediction, no-op gesture, invalid input rejection, fractional equilibrium data, bounded history, modal flow, persistence and earlier survey/plot behavior. Whitespace checks pass. Both local user tabs are refreshed; no external deployment or physical touchscreen testing was performed.

final result: passed


## Coarse price exploration, precise equilibrium results

Slider and keyboard selection now use 1,000-won steps. Old continuous prices normalize to the closest selectable price on entry; undoing old fractional history also clears any prediction tied to the old price. Mathematical curve interpolation/intersections retain full precision. When a 1,000-won adjustment would cross an off-grid equilibrium, the flow offers the equilibrium result instead of bouncing between prices.

Verified in an isolated browser using class values 2 / 15 / 11 / 1 / 2: Home then ArrowUp selected 2,000원, with quantities 15 / 8. Predicting rise and checking the reaction led directly to equilibrium confirmation, displaying both 1,222.2원·4.9개 and 2,875원·11.5개. The two underlying intersections were not rounded to the control's step. Screenshot `market-slider/off-grid-equilibria.png` was opened and inspected. No console warnings/errors. Real class/example data was preserved; only the active control price was normalized.

Regression checks cover 1,000-won steps, old fractional price/history normalization, multiple off-grid roots, precise quantities, no oscillation, gesture undo, validation and previous workflows. All pass, as does whitespace validation. Local only; no external deployment or physical touchscreen check.

final result: passed
