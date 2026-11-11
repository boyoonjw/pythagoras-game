// ===== 기본 데이터 =====
var TEAM_COLORS = ["#e5484d", "#f76b15", "#30a46c", "#0090ff"];
var teams = TEAM_COLORS.map(function (c, i) {
  return { name: (i + 1) + "모둠", color: c, tiles: [], land: 0 };
});
var turn = 0;
var missionDone = false;
var puzzleCount = 0;
var REWARD = { 1: [1, 2], 2: [2, 3], 3: [3, 4] };

// 미션 32문제 (미션목록.md와 같은 번호)
// fig.grid: 격자 위 기울어진 정사각형 / fig.three: 세 변 위 정사각형 / fig.tri: 격자 위 삼각형
// optFigs: 보기가 그림인 문제 (보기 이름은 opts)
var AREA_Q = "이 정사각형의 넓이는?";
var HYP_Q = "빗변 위 정사각형의 넓이는?";
var LEG_Q = "나머지 짧은 변 위 정사각형의 넓이는?";
function rightQ(x, y, z) { return "세 변 위 정사각형의 넓이가 " + x + ", " + y + ", " + z + "인 삼각형은 직각삼각형일까?"; }
var MISSIONS = [
  // A. 넓이 구하기
  { id: "A1", level: 1, fig: { grid: [1, 1] }, q: AREA_Q, opts: ["1", "2", "3", "4"], ans: 1,
    why: "둘러싼 정사각형 4에서 직각삼각형 4개(넓이 0.5씩)를 빼면 4 − 2 = 2예요." },
  { id: "A2", level: 1, fig: { grid: [1, 2] }, q: AREA_Q, opts: ["4", "5", "6", "9"], ans: 1,
    why: "둘러싼 정사각형 9에서 직각삼각형 4개(넓이 1씩)를 빼면 9 − 4 = 5예요." },
  { id: "A3", level: 1, fig: { grid: [2, 2] }, q: AREA_Q, opts: ["4", "8", "9", "16"], ans: 1,
    why: "둘러싼 정사각형 16에서 직각삼각형 4개(넓이 2씩)를 빼면 16 − 8 = 8이에요." },
  { id: "A4", level: 2, fig: { grid: [1, 3] }, q: AREA_Q, opts: ["9", "10", "12", "16"], ans: 1,
    why: "둘러싼 정사각형 16에서 직각삼각형 4개(넓이 1.5씩)를 빼면 16 − 6 = 10이에요." },
  { id: "A5", level: 2, fig: { grid: [2, 3] }, q: AREA_Q, opts: ["12", "13", "16", "25"], ans: 1,
    why: "둘러싼 정사각형 25에서 직각삼각형 4개(넓이 3씩)를 빼면 25 − 12 = 13이에요." },
  { id: "A6", level: 2, fig: { grid: [3, 3] }, q: AREA_Q, opts: ["9", "16", "18", "36"], ans: 2,
    why: "둘러싼 정사각형 36에서 직각삼각형 4개(넓이 4.5씩)를 빼면 36 − 18 = 18이에요." },
  { id: "A7", level: 2, fig: { grid: [3, 4] }, q: AREA_Q, opts: ["16", "24", "25", "49"], ans: 2,
    why: "둘러싼 정사각형 49에서 직각삼각형 4개(넓이 6씩)를 빼면 49 − 24 = 25예요." },
  { id: "A8", level: 3, fig: { grid: [1, 4] }, q: AREA_Q, opts: ["16", "17", "20", "25"], ans: 1,
    why: "둘러싼 정사각형 25에서 직각삼각형 4개(넓이 2씩)를 빼면 25 − 8 = 17이에요." },
  { id: "A9", level: 3, fig: { grid: [2, 4] }, q: AREA_Q, opts: ["16", "20", "24", "36"], ans: 1,
    why: "둘러싼 정사각형 36에서 직각삼각형 4개(넓이 4씩)를 빼면 36 − 16 = 20이에요." },
  { id: "A10", level: 3, fig: { grid: [4, 4] }, q: AREA_Q, opts: ["16", "32", "36", "64"], ans: 1,
    why: "둘러싼 정사각형 64에서 직각삼각형 4개(넓이 8씩)를 빼면 64 − 32 = 32예요." },
  { id: "A11", level: 2, q: "넓이가 10인 정사각형은?", opts: ["가", "나", "다", "라"], optFigs: [[1, 2], [1, 3], [2, 2], [2, 3]], ans: 1,
    why: "나: 둘러싼 정사각형 16에서 직각삼각형 4개(넓이 1.5씩)를 빼면 10이에요. 가는 5, 다는 8, 라는 13이에요." },
  { id: "A12", level: 3, q: "넓이가 13인 정사각형은?", opts: ["가", "나", "다", "라"], optFigs: [[1, 3], [2, 3], [2, 2], [3, 3]], ans: 1,
    why: "나: 둘러싼 정사각형 25에서 직각삼각형 4개(넓이 3씩)를 빼면 13이에요. 가는 10, 다는 8, 라는 18이에요." },

  // B. 빈칸 채우기
  { id: "B1", level: 1, fig: { three: ["1", "4", "?"] }, q: HYP_Q, opts: ["3", "5", "9", "25"], ans: 1,
    why: "두 짧은 변 위 정사각형 넓이의 합: 1 + 4 = 5예요." },
  { id: "B2", level: 1, fig: { three: ["4", "9", "?"] }, q: HYP_Q, opts: ["5", "13", "25", "36"], ans: 1,
    why: "두 짧은 변 위 정사각형 넓이의 합: 4 + 9 = 13이에요." },
  { id: "B3", level: 1, fig: { three: ["1", "9", "?"] }, q: HYP_Q, opts: ["8", "9", "10", "16"], ans: 2,
    why: "두 짧은 변 위 정사각형 넓이의 합: 1 + 9 = 10이에요." },
  { id: "B4", level: 1, fig: { three: ["9", "16", "?"] }, q: HYP_Q, opts: ["7", "12", "25", "49"], ans: 2,
    why: "두 짧은 변 위 정사각형 넓이의 합: 9 + 16 = 25예요." },
  { id: "B5", level: 2, fig: { three: ["9", "?", "25"] }, q: LEG_Q, opts: ["4", "9", "16", "34"], ans: 2,
    why: "빗변 위 정사각형에서 빼야 해요: 25 − 9 = 16이에요." },
  { id: "B6", level: 2, fig: { three: ["4", "?", "13"] }, q: LEG_Q, opts: ["3", "9", "13", "17"], ans: 1,
    why: "빗변 위 정사각형에서 빼야 해요: 13 − 4 = 9예요." },
  { id: "B7", level: 2, fig: { three: ["1", "?", "10"] }, q: LEG_Q, opts: ["3", "9", "10", "11"], ans: 1,
    why: "빗변 위 정사각형에서 빼야 해요: 10 − 1 = 9예요." },
  { id: "B8", level: 2, fig: { three: ["16", "?", "20"] }, q: LEG_Q, opts: ["2", "4", "16", "36"], ans: 1,
    why: "빗변 위 정사각형에서 빼야 해요: 20 − 16 = 4예요." },
  { id: "B9", level: 2, q: "짧은 두 변의 길이가 3, 4인 직각삼각형의 빗변의 길이는?", opts: ["5", "6", "7", "25"], ans: 0,
    why: "3 × 3 + 4 × 4 = 9 + 16 = 25이고, 넓이가 25인 정사각형의 한 변은 5예요." },
  { id: "B10", level: 3, q: "짧은 두 변의 길이가 6, 8인 직각삼각형의 빗변의 길이는?", opts: ["10", "14", "48", "100"], ans: 0,
    why: "6 × 6 + 8 × 8 = 36 + 64 = 100이고, 넓이가 100인 정사각형의 한 변은 10이에요." },
  { id: "B11", level: 3, q: "빗변의 길이가 5, 짧은 변의 길이가 3인 직각삼각형의 다른 짧은 변의 길이는?", opts: ["2", "4", "8", "16"], ans: 1,
    why: "5 × 5 − 3 × 3 = 25 − 9 = 16이고, 넓이가 16인 정사각형의 한 변은 4예요." },
  { id: "B12", level: 3, q: "빗변의 길이가 13, 짧은 변의 길이가 5인 직각삼각형의 다른 짧은 변의 길이는?", opts: ["8", "12", "18", "144"], ans: 1,
    why: "13 × 13 − 5 × 5 = 169 − 25 = 144이고, 넓이가 144인 정사각형의 한 변은 12예요." },

  // C. 함정 미션 (O/X)
  { id: "C1", level: 1, q: rightQ(4, 9, 13), opts: ["O", "X"], ans: 0,
    why: "4 + 9 = 13이므로 직각삼각형이에요." },
  { id: "C2", level: 2, q: rightQ(4, 9, 16), opts: ["O", "X"], ans: 1,
    why: "4 + 9 = 13이고 16이 아니므로 직각삼각형이 아니에요 (둔각삼각형)." },
  { id: "C3", level: 2, q: rightQ(9, 16, 20), opts: ["O", "X"], ans: 1,
    why: "9 + 16 = 25이고 20이 아니므로 직각삼각형이 아니에요 (예각삼각형)." },
  { id: "C4", level: 1, q: rightQ(1, 4, 5), opts: ["O", "X"], ans: 0,
    why: "1 + 4 = 5이므로 직각삼각형이에요." },
  { id: "C5", level: 2, q: rightQ(5, 5, 10), opts: ["O", "X"], ans: 0,
    why: "5 + 5 = 10이므로 직각삼각형이에요." },
  { id: "C6", level: 3, fig: { tri: [[1, 0], [0, 3], [4, 3]] },
    q: "이 삼각형에서 두 짧은 변 위 정사각형을 가장 긴 변 위 정사각형 하나로 바꿀 수 있을까?", opts: ["O", "X"], ans: 1,
    why: "세 변 위 정사각형의 넓이는 10, 16, 18이에요. 10 + 16 = 26이고 18이 아니므로 바꿀 수 없어요 (예각삼각형)." },
  { id: "C7", level: 2, q: "모든 삼각형에서 두 변 위 정사각형 넓이의 합은 나머지 한 변 위 정사각형 넓이와 같다.", opts: ["O", "X"], ans: 1,
    why: "직각삼각형에서만 성립해요. 예를 들어 넓이가 4, 9, 16인 삼각형은 4 + 9 = 13이라 16과 달라요." },
  { id: "C8", level: 2, q: "직각삼각형에서 가장 넓은 정사각형은 항상 빗변 위에 있다.", opts: ["O", "X"], ans: 0,
    why: "빗변 위 정사각형의 넓이는 다른 두 정사각형 넓이의 합이라서 항상 가장 넓어요." }
];
var used = [];

// ===== 공통 =====
var main = document.getElementById("main");
function cur() { return teams[turn]; }
function tileArea(t) { return t.kind === "sq" ? t.s * t.s : t.a * t.a + t.b * t.b; }
// 교환해서 받은 타일은 땅에 놓을 때 보너스 1점 (교환소를 쓸 이유를 만들어 줌)
var TILT_BONUS = 1;
function tileBonus(t) { return t.kind === "tilt" ? TILT_BONUS : 0; }
function chipHTML(t, extra) {
  return '<span class="chip' + (t.kind === "tilt" ? " tilt" : "") + '"' + (extra || "") + '>' +
    (t.kind === "sq" ? "■ " : "◆ ") + tileArea(t) + (tileBonus(t) ? " +" + tileBonus(t) : "") + "</span>";
}
function teamLabel(t) { return '<span style="color:' + t.color + '">' + t.name + "</span>"; }

function renderBoard() {
  var html = teams.map(function (t, i) {
    return '<div class="card' + (i === turn ? " current" : "") + '" style="border-color:' + (i === turn ? t.color : "var(--line)") + '">' +
      '<div class="name" style="color:' + t.color + '">' + t.name + "</div>" +
      '<div class="land">점수 <b>' + t.land + "</b></div>" +
      '<div class="chips">' + t.tiles.map(function (x) { return chipHTML(x); }).join("") + "</div></div>";
  }).join("");
  html += '<div class="timer" id="timer"></div>';
  document.getElementById("board").innerHTML = html;
  updateTimer();
}

// ===== 타이머 =====
var remain = 20 * 60;
function updateTimer() {
  var el = document.getElementById("timer");
  if (!el) return;
  var m = Math.floor(remain / 60), s = remain % 60;
  el.textContent = "⏱ " + m + ":" + (s < 10 ? "0" : "") + s;
  el.style.color = remain <= 60 ? "var(--bad)" : "var(--text)";
}
setInterval(function () {
  if (remain > 0) {
    remain--;
    updateTimer();
    if (remain === 0) showResult();
  }
}, 1000);

// ===== 대기 화면 =====
function showIdle(extra) {
  main.innerHTML = (extra || "") +
    "<h2>" + teamLabel(cur()) + " 차례예요</h2>" +
    '<p class="sub">① 미션 뽑기 → ② 교환소(선택) → ③ 땅 놓기(1개) → 다음 차례</p>';
}

// ===== 그림 =====
function svgWrap(minx, miny, w, h, inner, cls) {
  return '<svg class="fig ' + (cls || "") + '" viewBox="' + [minx, miny, w, h].join(" ") + '">' + inner + "</svg>";
}
function poly(pts, fill, stroke, extra) {
  return '<polygon points="' + pts.map(function (p) { return p[0] + "," + p[1]; }).join(" ") +
    '" fill="' + fill + '" stroke="' + (stroke || "#1f2937") + '" stroke-width="2" vector-effect="non-scaling-stroke" ' + (extra || "") + "/>";
}
function label(x, y, text, size, color) {
  return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" text-anchor="middle" dominant-baseline="middle" fill="' + (color || "#1f2937") + '" font-weight="bold">' + text + "</text>";
}

// 격자 위 기울어진 정사각형 (짧은 두 변 p, q)
function gridSquareSVG(p, q, cls) {
  var n = p + q, inner = "";
  for (var i = 0; i <= n; i++) {
    inner += '<line x1="' + i + '" y1="0" x2="' + i + '" y2="' + n + '" stroke="#c9ced6" stroke-width="1" vector-effect="non-scaling-stroke"/>';
    inner += '<line x1="0" y1="' + i + '" x2="' + n + '" y2="' + i + '" stroke="#c9ced6" stroke-width="1" vector-effect="non-scaling-stroke"/>';
  }
  inner += poly([[p, 0], [n, p], [q, n], [0, q]], "rgba(224,123,57,0.55)", "#c05a1c");
  return svgWrap(-0.3, -0.3, n + 0.6, n + 0.6, inner, cls);
}

// 격자 위 삼각형 (꼭짓점 pts)
function gridTriSVG(pts) {
  var w = Math.max.apply(null, pts.map(function (p) { return p[0]; }));
  var h = Math.max.apply(null, pts.map(function (p) { return p[1]; }));
  var inner = "";
  for (var i = 0; i <= w; i++) inner += '<line x1="' + i + '" y1="0" x2="' + i + '" y2="' + h + '" stroke="#c9ced6" stroke-width="1" vector-effect="non-scaling-stroke"/>';
  for (var j = 0; j <= h; j++) inner += '<line x1="0" y1="' + j + '" x2="' + w + '" y2="' + j + '" stroke="#c9ced6" stroke-width="1" vector-effect="non-scaling-stroke"/>';
  inner += poly(pts, "rgba(42,157,143,0.45)", "#14524b");
  return svgWrap(-0.3, -0.3, w + 0.6, h + 0.6, inner);
}

// 직각삼각형과 세 정사각형 기하 (짧은 변 a, b)
function sub(p, q) { return [p[0] - q[0], p[1] - q[1]]; }
function add(p, q) { return [p[0] + q[0], p[1] + q[1]]; }
function dot(p, q) { return p[0] * q[0] + p[1] * q[1]; }
function rot(p, o, th) {
  var d = sub(p, o), c = Math.cos(th), s = Math.sin(th);
  return [o[0] + d[0] * c - d[1] * s, o[1] + d[0] * s + d[1] * c];
}
function centroid(pts) {
  var x = 0, y = 0;
  pts.forEach(function (p) { x += p[0]; y += p[1]; });
  return [x / pts.length, y / pts.length];
}
function geom(a, b) {
  var c = Math.hypot(a, b);
  var A = [0, 0], B = [c, 0], C = [b * b / c, -a * b / c];
  var bc = sub(C, B), n = [-bc[1], bc[0]];
  if (dot(n, sub(A, B)) > 0) n = [-n[0], -n[1]];
  var ac = sub(C, A), m = [-ac[1], ac[0]];
  if (dot(m, sub(B, A)) > 0) m = [-m[0], -m[1]];
  return { a: a, b: b, c: c, A: A, B: B, C: C, n: n, m: m, E: add(B, n) };
}
function bounds(list) {
  var xs = [], ys = [];
  list.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); });
  var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs);
  var miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
  var pad = (maxx - minx) * 0.05;
  return [minx - pad, miny - pad, maxx - minx + 2 * pad, maxy - miny + 2 * pad];
}

// 빈칸 채우기용 그림 (크기는 3, 4, 5 모양으로 고정)
function threeSquaresSVG(la, lb, lc) {
  var g = geom(3, 4);
  var sqA = [g.B, g.C, add(g.C, g.n), g.E];
  var sqB = [g.A, g.C, add(g.C, g.m), add(g.A, g.m)];
  var sqC = [g.A, g.B, [g.c, g.c], [0, g.c]];
  var fs = 1.1;
  var inner = poly(sqA, "rgba(42,157,143,0.35)") + poly(sqB, "rgba(42,157,143,0.35)") +
    poly(sqC, "rgba(224,123,57,0.35)") + poly([g.A, g.B, g.C], "#ffffff");
  [[sqA, la], [sqB, lb], [sqC, lc]].forEach(function (x) {
    var c = centroid(x[0]);
    inner += label(c[0], c[1], x[1], fs);
  });
  var bb = bounds(sqA.concat(sqB, sqC));
  return svgWrap(bb[0], bb[1], bb[2], bb[3], inner);
}

// ===== 미션 =====
function openMission() {
  if (missionDone) { showIdle('<div class="msg info">이번 차례에는 이미 미션을 풀었어요</div>'); return; }
  main.innerHTML = "<h2>" + teamLabel(cur()) + " · 난이도를 고르세요</h2>" +
    '<div class="row">' +
    '<button class="big" onclick="chooseLevel(1)">★ 쉬움<br><span class="note">타일 한 변 1~2</span></button>' +
    '<button class="big" onclick="chooseLevel(2)">★★ 보통<br><span class="note">타일 한 변 2~3</span></button>' +
    '<button class="big" onclick="chooseLevel(3)">★★★ 어려움<br><span class="note">타일 한 변 3~4</span></button>' +
    "</div>";
}

var currentMission = null, currentLevel = 1;
function chooseLevel(level) {
  var pool = MISSIONS.filter(function (m) { return m.level === level && used.indexOf(m) < 0; });
  if (pool.length === 0) {
    used = used.filter(function (m) { return m.level !== level; });
    pool = MISSIONS.filter(function (m) { return m.level === level; });
  }
  var m = pool[Math.floor(Math.random() * pool.length)];
  used.push(m);
  currentMission = m;
  currentLevel = level;
  missionDone = true;
  answering = turn;
  tried = [turn];
  wrongOpts = [];
  renderQuestion("");
}

// 지금 답하는 모둠, 이미 도전한 모둠, 이미 틀린 보기
var answering = 0, tried = [], wrongOpts = [];
function renderQuestion(head) {
  var m = currentMission;
  var fig = "";
  if (m.fig && m.fig.grid) fig = gridSquareSVG(m.fig.grid[0], m.fig.grid[1]);
  if (m.fig && m.fig.three) fig = threeSquaresSVG(m.fig.three[0], m.fig.three[1], m.fig.three[2]) +
    '<div class="note">그림의 크기는 실제 넓이와 다를 수 있어요</div>';
  if (m.fig && m.fig.tri) fig = gridTriSVG(m.fig.tri);
  main.innerHTML = head +
    '<div class="note">' + "★".repeat(currentLevel) + " · " + teamLabel(teams[answering]) + " 답하는 중</div>" + fig +
    '<div class="q">' + m.q + "</div>" +
    '<div class="opts' + (m.opts.length === 2 ? " ox" : "") + (m.optFigs ? " figs" : "") + '">' +
    m.opts.map(function (o, i) {
      var inner = m.optFigs ? o + gridSquareSVG(m.optFigs[i][0], m.optFigs[i][1], "mini") : o;
      return '<button class="opt' + (wrongOpts.indexOf(i) >= 0 ? " wrong" : "") + '" onclick="answer(' + i + ')">' + inner + "</button>";
    }).join("") +
    "</div>";
}

function giveTile(ti) {
  var r = REWARD[currentLevel];
  var s = r[Math.floor(Math.random() * 2)];
  var tile = { kind: "sq", s: s };
  teams[ti].tiles.push(tile);
  renderBoard();
  return tile;
}

function answer(i) {
  var m = currentMission;
  if (wrongOpts.indexOf(i) >= 0) return;
  if (i === m.ans) {
    var t = giveTile(answering);
    var who = answering === turn ? "정답!" : teamLabel(teams[answering]) + " 가로채기 성공!";
    showIdle('<div class="msg ok">' + who + " " + m.why + "<br>" + teamLabel(teams[answering]) + "이 한 변 " + t.s + "인 정사각형 타일 " + chipHTML(t) + "을 받았어요</div>");
    return;
  }
  wrongOpts.push(i);
  // O/X 문제는 가로채기 없이 바로 정답 공개
  if (m.opts.length === 2) { revealAnswer(); return; }
  // 가로채기는 한 번만: 가로챈 모둠도 틀리면 정답 공개
  if (answering !== turn) { revealAnswer(); return; }
  var others = teams.map(function (t, k) { return k; }).filter(function (k) { return k !== turn; });
  // 정답은 보여 주지 않고 바로 가로채기
  main.innerHTML = '<div class="msg bad">' + teamLabel(teams[answering]) + "이 틀렸어요!</div>" +
    "<h2>가로채기!</h2><p class=\"sub\">답을 아는 모둠은 손을 드세요. 가장 먼저 손 든 모둠을 고르면 같은 문제에 도전해요</p>" +
    '<div class="row">' +
    others.map(function (k) {
      return '<button class="big" style="border-color:' + teams[k].color + ";color:" + teams[k].color + '" onclick="intercept(' + k + ')">' + teams[k].name + "</button>";
    }).join("") +
    '<button class="big" style="border-color:var(--line);color:var(--muted)" onclick="intercept(-1)">아무도 안 함</button></div>';
}

function intercept(k) {
  if (k < 0) { revealAnswer(); return; }
  answering = k;
  tried.push(k);
  renderQuestion('<div class="msg info">' + teamLabel(teams[k]) + " 가로채기 도전!</div>");
}

function revealAnswer() {
  var m = currentMission;
  var head = answering !== turn ? teamLabel(teams[answering]) + "도 틀렸어요. " : teamLabel(teams[answering]) + "이 틀렸어요. ";
  showIdle('<div class="msg info">' + head + "정답은 <b>" + m.opts[m.ans] + "</b>. " + m.why + "<br>이번 미션은 타일 없이 넘어가요</div>");
}

// ===== 교환소 =====
var picked = [];
function openExchange() {
  var sq = cur().tiles.filter(function (t) { return t.kind === "sq"; });
  if (sq.length < 2) {
    showIdle('<div class="msg info">교환하려면 정사각형 타일(■)이 2개 이상 있어야 해요</div>');
    return;
  }
  picked = [];
  renderExchange();
}
function renderExchange(err) {
  var tiles = cur().tiles;
  main.innerHTML = "<h2>교환소 · " + teamLabel(cur()) + "</h2>" +
    '<p class="sub">바꿀 정사각형 타일 2개를 고르세요</p><div class="row">' +
    tiles.map(function (t, i) {
      if (t.kind !== "sq") return "";
      return '<button class="big' + (picked.indexOf(i) >= 0 ? " sel" : "") + '" onclick="togglePick(' + i + ')">■ ' + tileArea(t) + '<br><span class="note">한 변 ' + t.s + "</span></button>";
    }).join("") + "</div>" +
    '<div class="err">' + (err || "") + "</div>" +
    '<button class="big primary" onclick="startPuzzle()">증명 퍼즐 시작</button>';
}
function togglePick(i) {
  var k = picked.indexOf(i);
  if (k >= 0) picked.splice(k, 1);
  else if (picked.length < 2) picked.push(i);
  renderExchange();
}
var pa, pb;
function startPuzzle() {
  if (picked.length !== 2) { renderExchange("타일 2개를 골라야 해요"); return; }
  var t1 = cur().tiles[picked[0]], t2 = cur().tiles[picked[1]];
  pa = Math.min(t1.s, t2.s); pb = Math.max(t1.s, t2.s);
  // 증명 퍼즐은 무작위로 고르되, 바로 전과 같은 증명은 피함
  var kind;
  do { kind = PUZZLES[Math.floor(Math.random() * PUZZLES.length)]; } while (kind === lastPuzzle);
  lastPuzzle = kind;
  if (kind === "euclid") { startEuclid(pa, pb); return; }
  // 끌기 퍼즐은 목록에서 삼각형을 무작위로 고르되, 바로 전과 같은 모양은 피함
  var k;
  do { k = Math.floor(Math.random() * TRIPLES.length); } while (k === lastTriple);
  lastTriple = k;
  var ta = TRIPLES[k][0], tb = TRIPLES[k][1];
  if (kind === "rearrange") startRearrange(ta, tb);
  if (kind === "bhaskara") startBhaskara(ta, tb);
  if (kind === "perigal") startPerigal(ta, tb);
  puzzleCount++;
}
function finishExchange() {
  var team = cur();
  var keep = team.tiles.filter(function (t, i) { return picked.indexOf(i) < 0; });
  var nt = { kind: "tilt", a: pa, b: pb };
  keep.push(nt);
  team.tiles = keep;
  renderBoard();
  main.innerHTML = '<div class="msg ok">교환 완료! ' + chipHTML(nt) + " 타일을 받았어요 (넓이 " + (pa * pa) + " + " + (pb * pb) + " = " + tileArea(nt) + ")<br>땅에 놓으면 교환 보너스 " + TILT_BONUS + "점을 더 받아요</div>" +
    '<p class="sub">격자판에는 이런 모양으로 놓아요: 짧은 두 변이 ' + pa + ", " + pb + "인 직각삼각형의 빗변 위 정사각형</p>" +
    gridSquareSVG(pa, pb);
}

// ===== 재배치 퍼즐 =====
// 퍼즐에 나오는 직각삼각형 (짧은 두 변). 모양이 서로 다른 것만 넣음
var TRIPLES = [[3, 4], [5, 12], [1, 2], [2, 3], [1, 3]];
var lastTriple = -1;
// 증명 퍼즐 종류
var PUZZLES = ["rearrange", "euclid", "bhaskara", "perigal"];
var lastPuzzle = "";
var R = null;
function startRearrange(a, b) {
  var S = a + b;
  var tris = [
    [[0, 0], [a, 0], [0, b]],
    [[a, 0], [S, 0], [S, a]],
    [[S, a], [S, S], [b, S]],
    [[b, S], [0, S], [0, b]]
  ];
  var slots = [
    [[a, 0], [S, 0], [S, a]],
    [[a, 0], [a, a], [S, a]],
    [[0, a], [0, S], [a, S]],
    [[0, a], [a, a], [a, S]]
  ];
  R = {
    a: a, b: b, S: S, slots: slots, moved: false, sel: -1, solved: null, init: tris, targets: targetTris(a, b),
    pieces: tris.map(function (p) { return { pts: p }; })
  };
  main.innerHTML = "<h2>증명 퍼즐 · 재배치</h2>" +
    '<div class="note">이번 삼각형: 짧은 두 변이 ' + a + ", " + b + "인 직각삼각형</div>" +
    '<p class="sub">삼각형을 끌어 옮기세요. 돌리려면 삼각형을 누른 뒤 노란 손잡이(↻)를 끌어 돌려요</p>' +
    '<div id="rsvg"></div>' +
    '<div class="row">' +
    '<button class="big" onclick="resetRearrange()">⟲ 처음으로</button>' +
    '<button class="big primary" onclick="checkRearrange()">다 놓았어요</button>' +
    "</div><div id=\"rmsg\"></div>";
  drawRearrange();
}

// 빈 곳이 a², b² 정사각형이 되는 4가지 배치 (a²가 어느 모서리에 와도 정답, b²는 그 반대 모서리)
function holeLayouts(a, b) {
  var S = a + b;
  return [
    [[0, 0, a], [a, a, b]],
    [[b, 0, a], [0, a, b]],
    [[0, b, a], [a, 0, b]],
    [[b, b, a], [0, 0, b]]
  ].map(function (v) {
    return v.map(function (q) { return { x: q[0], y: q[1], s: q[2] }; });
  });
}
// 점선 배치에서 삼각형이 들어갈 수 있는 자리 (직사각형 2개 × 대각선 2가지)
// 초록색 표시와 자석은 점선 배치에만 적용 (판정은 다른 배치도 정답으로 인정)
function targetTris(a, b) {
  var rects = [
    [[a, 0, b, a], [0, a, a, b]]
  ];
  var out = [], seen = {};
  rects.forEach(function (layout) {
    layout.forEach(function (r) {
      var p00 = [r[0], r[1]], p10 = [r[0] + r[2], r[1]], p11 = [r[0] + r[2], r[1] + r[3]], p01 = [r[0], r[1] + r[3]];
      [[p00, p10, p11], [p00, p11, p01], [p10, p11, p01], [p00, p10, p01]].forEach(function (t) {
        var k = ptsKey(t);
        if (!seen[k]) { seen[k] = true; out.push(t); }
      });
    });
  });
  return out;
}
function ptsKey(pts) { return pts.map(function (p) { return p[0] + "," + p[1]; }).sort().join(";"); }
function minXY(pts) {
  return [Math.min.apply(null, pts.map(function (p) { return p[0]; })), Math.min.apply(null, pts.map(function (p) { return p[1]; }))];
}
function shapeKey(pts) {
  var m = minXY(pts);
  return ptsKey(pts.map(function (p) { return [p[0] - m[0], p[1] - m[1]]; }));
}
function onTarget(pts) {
  var k = ptsKey(pts);
  return R.targets.some(function (t) { return ptsKey(t) === k; });
}
// 자석: 끌어 놓은 삼각형 근처에 빈 점선 자리가 있으면, 방향이 달라도 그 자리로 돌려서 붙임
function magnet(pts, self) {
  var c = centroid(pts), best = null;
  // 다른 삼각형이 정확히 들어가 있는 점선 자리는 찬 자리로 봄
  var taken = R.pieces.filter(function (p, j) { return j !== self; }).map(function (p) { return ptsKey(p.pts); });
  R.slots.forEach(function (s) {
    if (taken.indexOf(ptsKey(s)) >= 0) return;
    var d = Math.hypot(centroid(s)[0] - c[0], centroid(s)[1] - c[1]);
    if (d < Math.max(R.S * 0.35, 1.2) && (!best || d < best.d)) best = { d: d, s: s };
  });
  if (best) return best.s.map(function (p) { return [p[0], p[1]]; });
  return pts;
}
function inSquare(p, q) { return p[0] > q.x && p[0] < q.x + q.s && p[1] > q.y && p[1] < q.y + q.s; }
function inTri(p, t) {
  function cr(a, b, c) { return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); }
  var d1 = cr(t[0], t[1], p), d2 = cr(t[1], t[2], p), d3 = cr(t[2], t[0], p);
  return (d1 > 0 && d2 > 0 && d3 > 0) || (d1 < 0 && d2 < 0 && d3 < 0);
}

function resetRearrange() {
  if (R.solved) return;
  R.pieces = R.init.map(function (p) { return { pts: p }; });
  R.moved = false;
  R.sel = -1;
  document.getElementById("rmsg").innerHTML = "";
  drawRearrange();
}

function drawRearrange() {
  var S = R.S, pad = S * 0.3, fs = S * 0.13;
  var inner = '<rect x="0" y="0" width="' + S + '" height="' + S + '" fill="rgba(224,123,57,0.55)" stroke="#1f2937" stroke-width="2" vector-effect="non-scaling-stroke"/>';
  for (var g = 1; g < S; g++) {
    inner += '<line x1="' + g + '" y1="0" x2="' + g + '" y2="' + S + '" stroke="rgba(255,255,255,0.7)" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none"/>';
    inner += '<line x1="0" y1="' + g + '" x2="' + S + '" y2="' + g + '" stroke="rgba(255,255,255,0.7)" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none"/>';
  }
  R.slots.forEach(function (s) { inner += poly(s, "none", "#9aa3ad", 'stroke-dasharray="6 5"'); });
  if (R.solved) {
    var qa = R.solved[0], qb = R.solved[1];
    inner += label(qa.x + qa.s / 2, qa.y + qa.s / 2, "a²", fs * Math.min(1, R.a / 2), "#7a3a10");
    inner += label(qb.x + qb.s / 2, qb.y + qb.s / 2, "b²", fs, "#7a3a10");
  }
  R.pieces.forEach(function (p, i) {
    var sel = i === R.sel, ok = onTarget(p.pts);
    inner += '<polygon points="' + p.pts.map(function (q) { return q[0] + "," + q[1]; }).join(" ") +
      '" fill="rgba(42,157,143,0.9)" stroke="' + (sel ? "#f5b400" : ok ? "#37b24d" : "#14524b") + '" stroke-width="' + (sel || ok ? 5 : 2) +
      '" vector-effect="non-scaling-stroke" data-i="' + i + '" style="cursor:grab"/>';
  });
  // 처음 상태: 빈 곳 c² 정사각형의 테두리를 굵게 강조
  if (!R.moved && !R.solved) {
    var a = R.a, b = R.b;
    inner += '<polygon points="' + [[a, 0], [S, a], [b, S], [0, b]].map(function (q) { return q[0] + "," + q[1]; }).join(" ") +
      '" fill="none" stroke="#b3470f" stroke-width="5" vector-effect="non-scaling-stroke" pointer-events="none"/>';
    inner += label(S / 2, S / 2, "c²", fs, "#7a3a10");
  }
  // 고른 삼각형 위에 회전 손잡이
  if (R.sel >= 0 && !R.solved) {
    var c = centroid(R.pieces[R.sel].pts), h = handlePos(c), r = S * 0.06;
    inner += '<g id="rhandle">' +
      '<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + h[0] + '" y2="' + h[1] + '" stroke="#f5b400" stroke-width="3" vector-effect="non-scaling-stroke" pointer-events="none"/>' +
      '<circle cx="' + h[0] + '" cy="' + h[1] + '" r="' + r + '" fill="#fff8e1" stroke="#f5b400" stroke-width="4" vector-effect="non-scaling-stroke" data-h="1" style="cursor:grab"/>' +
      '<text x="' + h[0] + '" y="' + h[1] + '" font-size="' + (r * 1.3) + '" text-anchor="middle" dominant-baseline="central" fill="#8a6500" pointer-events="none">↻</text>' +
      "</g>";
  }
  document.getElementById("rsvg").innerHTML = svgWrap(-pad, -pad, S + 2 * pad, S + 2 * pad, inner, "lg");
  var svg = document.querySelector("#rsvg svg");
  svg.addEventListener("pointerdown", dragStart);
  svg.addEventListener("pointermove", dragMove);
  svg.addEventListener("pointerup", dragEnd);
}
function handlePos(c) { return [c[0], c[1] - R.S * 0.25]; }

var drag = null;
function svgPoint(svg, e) {
  var pt = svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  var p = pt.matrixTransform(svg.getScreenCTM().inverse());
  return [p.x, p.y];
}
function dragStart(e) {
  if (R.solved) return;
  var svg = e.currentTarget;
  // 회전 손잡이를 잡은 경우: 돌리기
  if (e.target.getAttribute("data-h") !== null && R.sel >= 0) {
    svg.setPointerCapture(e.pointerId);
    var base = R.pieces[R.sel].pts, c = centroid(base), p = svgPoint(svg, e);
    drag = {
      rotate: true, i: R.sel, c: c, base: base, ang: 0,
      start: Math.atan2(p[1] - c[1], p[0] - c[0]),
      el: svg.querySelector('polygon[data-i="' + R.sel + '"]'),
      handle: svg.querySelector("#rhandle")
    };
    return;
  }
  var i = e.target.getAttribute("data-i");
  if (i === null) return;
  svg.setPointerCapture(e.pointerId);
  drag = { i: +i, start: svgPoint(svg, e), el: e.target, base: R.pieces[+i].pts, d: [0, 0] };
}
function dragMove(e) {
  if (!drag) return;
  var p = svgPoint(e.currentTarget, e);
  if (drag.rotate) {
    var ang = Math.atan2(p[1] - drag.c[1], p[0] - drag.c[0]) - drag.start;
    drag.ang = ang;
    drag.el.setAttribute("points", drag.base.map(function (q) { var r = rot(q, drag.c, ang); return r[0] + "," + r[1]; }).join(" "));
    drag.handle.setAttribute("transform", "rotate(" + (ang * 180 / Math.PI) + " " + drag.c[0] + " " + drag.c[1] + ")");
    return;
  }
  var d = sub(p, drag.start);
  drag.el.setAttribute("points", drag.base.map(function (q) { return (q[0] + d[0]) + "," + (q[1] + d[1]); }).join(" "));
  drag.d = d;
}
// 꼭짓점이 격자점(정수 좌표)에 오도록 가장 가까운 칸으로만 맞춤
function snapToGrid(pts) {
  var dx = Math.round(pts[0][0]) - pts[0][0], dy = Math.round(pts[0][1]) - pts[0][1];
  return pts.map(function (q) { return [Math.round(q[0] + dx), Math.round(q[1] + dy)]; });
}
function dragEnd() {
  if (!drag) return;
  var piece = R.pieces[drag.i];
  R.sel = drag.i;
  if (drag.rotate) {
    // 손을 떼면 가장 가까운 90° 방향으로 맞춤
    var q = Math.round(drag.ang / (Math.PI / 2)) * (Math.PI / 2);
    if (q !== 0) {
      var c = drag.c;
      piece.pts = magnet(snapToGrid(drag.base.map(function (v) { return rot(v, c, q); })), drag.i);
      R.moved = true;
      document.getElementById("rmsg").innerHTML = "";
    }
    drag = null;
    drawRearrange();
    return;
  }
  if (Math.hypot(drag.d[0], drag.d[1]) > 0.05) {
    piece.pts = magnet(snapToGrid(drag.base.map(function (q) { return add(q, drag.d); })), drag.i);
    R.moved = true;
    document.getElementById("rmsg").innerHTML = "";
  }
  drag = null;
  drawRearrange();
}
function checkRearrange() {
  // 큰 정사각형 안을 촘촘히 점검: 빈 곳(a², b²)에는 삼각형이 없고, 나머지는 정확히 삼각형 하나로 덮여야 함
  var k = 6, match = null;
  holeLayouts(R.a, R.b).forEach(function (holes) {
    if (match) return;
    for (var i = 0; i < R.S * k; i++) {
      for (var j = 0; j < R.S * k; j++) {
        var p = [(i + 0.37) / k, (j + 0.61) / k];
        var cnt = R.pieces.filter(function (pc) { return inTri(p, pc.pts); }).length;
        var hole = inSquare(p, holes[0]) || inSquare(p, holes[1]);
        if (hole ? cnt !== 0 : cnt !== 1) return;
      }
    }
    match = holes;
  });
  if (!match) {
    document.getElementById("rmsg").innerHTML = '<div class="msg bad">아직 빈 곳이 정사각형 두 개가 아니에요. 계속 옮겨 보세요</div>';
    return;
  }
  R.solved = match;
  R.sel = -1;
  drawRearrange();
  var a2 = R.a * R.a, b2 = R.b * R.b, c = Math.sqrt(a2 + b2);
  document.querySelector("#rsvg").nextElementSibling.style.display = "none";
  document.getElementById("rmsg").innerHTML = '<div class="msg ok">성공! 큰 정사각형도, 삼각형 4개도 그대로니까 빈 곳의 넓이도 그대로예요.<br>' +
    "c² = a² + b² → " + (a2 + b2) + " = " + a2 + " + " + b2 +
    (Number.isInteger(c) ? " (빗변의 길이는 " + c + ")" : "") + "</div>" +
    '<button class="big primary" onclick="finishExchange()">타일 교환하기</button>';
}

// ===== 조각 끌기 퍼즐 공통 (바스카라 · 조각 맞추기) =====
// P.pieces: 끌 수 있는 조각 {pts, type, label}
// P.slots: 조각이 들어갈 자리 {pts, type} (같은 type 조각만 붙음, 방향은 자석이 맞춰 줌)
// P.statics: 움직이지 않는 도형, P.outline: 만들어야 할 모양의 테두리
var P = null;
function pKey(pts) { return pts.map(function (p) { return p[0].toFixed(3) + "," + p[1].toFixed(3); }).sort().join(";"); }
function copyPts(pts) { return pts.map(function (p) { return [p[0], p[1]]; }); }

function startPiecePuzzle(cfg) {
  P = cfg;
  P.init = P.pieces.map(function (p) { return copyPts(p.pts); });
  P.sel = -1; P.moved = false; P.solved = false;
  main.innerHTML = "<h2>증명 퍼즐 · " + P.title + "</h2>" +
    '<div class="note">이번 삼각형: 짧은 두 변이 ' + P.a + ", " + P.b + "인 직각삼각형</div>" +
    '<p class="sub">' + P.guide + "</p>" +
    '<div id="psvg"></div>' +
    '<div class="row" id="pbtns">' +
    '<button class="big" onclick="resetPiece()">⟲ 처음으로</button>' +
    '<button class="big primary" onclick="checkPiece()">다 놓았어요</button>' +
    '</div><div id="pmsg"></div>';
  drawPiece();
}
function pieceOnSlot(p) {
  var k = pKey(p.pts);
  return P.slots.some(function (s) { return s.type === p.type && pKey(s.pts) === k; });
}
function drawPiece() {
  var vb = P.view, S = Math.max(vb[2], vb[3]), fs = P.fs;
  var inner = "";
  (P.statics || []).forEach(function (s) { inner += poly(s.pts, s.fill, s.stroke || "#14524b"); });
  P.slots.forEach(function (s) { inner += poly(s.pts, "none", "#9aa3ad", 'stroke-dasharray="6 5"'); });
  inner += '<polygon points="' + P.outline.map(function (q) { return q[0] + "," + q[1]; }).join(" ") +
    '" fill="none" stroke="#b3470f" stroke-width="4" stroke-dasharray="10 6" vector-effect="non-scaling-stroke" pointer-events="none"/>';
  (P.labels || []).forEach(function (l) { if (!l.until || !P.moved) inner += label(l.x, l.y, l.t, fs, "#7a3a10"); });
  P.pieces.forEach(function (p, i) {
    var sel = i === P.sel, ok = pieceOnSlot(p);
    inner += '<polygon points="' + p.pts.map(function (q) { return q[0] + "," + q[1]; }).join(" ") +
      '" fill="' + p.fill + '" stroke="' + (sel ? "#f5b400" : ok ? "#37b24d" : "#14524b") + '" stroke-width="' + (sel || ok ? 5 : 2) +
      '" vector-effect="non-scaling-stroke" data-i="' + i + '" style="cursor:grab"/>';
    if (p.label) { var c = centroid(p.pts); inner += '<g pointer-events="none">' + label(c[0], c[1], p.label, fs * 0.8, "#7a3a10") + "</g>"; }
  });
  if (P.solved && P.doneLabel) inner += label(P.doneLabel.x, P.doneLabel.y, P.doneLabel.t, fs * 1.2, "#7a3a10");
  if (P.sel >= 0 && !P.solved) {
    var c = centroid(P.pieces[P.sel].pts), h = [c[0], c[1] - S * 0.12], r = S * 0.03;
    inner += '<g id="phandle">' +
      '<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + h[0] + '" y2="' + h[1] + '" stroke="#f5b400" stroke-width="3" vector-effect="non-scaling-stroke" pointer-events="none"/>' +
      '<circle cx="' + h[0] + '" cy="' + h[1] + '" r="' + r + '" fill="#fff8e1" stroke="#f5b400" stroke-width="4" vector-effect="non-scaling-stroke" data-h="1" style="cursor:grab"/>' +
      '<text x="' + h[0] + '" y="' + h[1] + '" font-size="' + (r * 1.3) + '" text-anchor="middle" dominant-baseline="central" fill="#8a6500" pointer-events="none">↻</text>' +
      "</g>";
  }
  document.getElementById("psvg").innerHTML = svgWrap(vb[0], vb[1], vb[2], vb[3], inner, "lg");
  var svg = document.querySelector("#psvg svg");
  svg.style.touchAction = "none";
  svg.addEventListener("pointerdown", pDown);
  svg.addEventListener("pointermove", pMove);
  svg.addEventListener("pointerup", pUp);
}
var pdrag = null;
function pDown(e) {
  if (P.solved) return;
  var svg = e.currentTarget;
  if (e.target.getAttribute("data-h") !== null && P.sel >= 0) {
    svg.setPointerCapture(e.pointerId);
    var base = P.pieces[P.sel].pts, c = centroid(base), p = svgPoint(svg, e);
    pdrag = { rotate: true, i: P.sel, c: c, base: base, ang: 0, start: Math.atan2(p[1] - c[1], p[0] - c[0]),
      el: svg.querySelector('polygon[data-i="' + P.sel + '"]'), handle: svg.querySelector("#phandle") };
    return;
  }
  var i = e.target.getAttribute("data-i");
  if (i === null) return;
  svg.setPointerCapture(e.pointerId);
  pdrag = { i: +i, start: svgPoint(svg, e), el: e.target, base: P.pieces[+i].pts, d: [0, 0] };
}
function pMove(e) {
  if (!pdrag) return;
  var p = svgPoint(e.currentTarget, e);
  if (pdrag.rotate) {
    var ang = Math.atan2(p[1] - pdrag.c[1], p[0] - pdrag.c[0]) - pdrag.start;
    pdrag.ang = ang;
    pdrag.el.setAttribute("points", pdrag.base.map(function (q) { var r = rot(q, pdrag.c, ang); return r[0] + "," + r[1]; }).join(" "));
    pdrag.handle.setAttribute("transform", "rotate(" + (ang * 180 / Math.PI) + " " + pdrag.c[0] + " " + pdrag.c[1] + ")");
    return;
  }
  var d = sub(p, pdrag.start);
  pdrag.el.setAttribute("points", pdrag.base.map(function (q) { return (q[0] + d[0]) + "," + (q[1] + d[1]); }).join(" "));
  pdrag.d = d;
}
// 자석: 끌어 놓은 조각 근처에 같은 종류의 빈 자리가 있으면, 방향이 달라도 그 자리로 돌려서 붙임
function pMagnet(pts, self, type) {
  var c = centroid(pts), best = null;
  var taken = P.pieces.filter(function (p, j) { return j !== self; }).map(function (p) { return pKey(p.pts); });
  P.slots.forEach(function (s) {
    if (s.type !== type || taken.indexOf(pKey(s.pts)) >= 0) return;
    var d = Math.hypot(centroid(s.pts)[0] - c[0], centroid(s.pts)[1] - c[1]);
    if (d < P.snap && (!best || d < best.d)) best = { d: d, s: s };
  });
  return best ? copyPts(best.s.pts) : pts;
}
function pUp() {
  if (!pdrag) return;
  var piece = P.pieces[pdrag.i];
  P.sel = pdrag.i;
  if (pdrag.rotate) {
    var q = Math.round(pdrag.ang / (Math.PI / 2)) * (Math.PI / 2);
    if (q !== 0) {
      var c = pdrag.c;
      piece.pts = pMagnet(pdrag.base.map(function (v) { return rot(v, c, q); }), pdrag.i, piece.type);
      P.moved = true;
    }
  } else if (Math.hypot(pdrag.d[0], pdrag.d[1]) > 0.05) {
    piece.pts = pMagnet(pdrag.base.map(function (q) { return add(q, pdrag.d); }), pdrag.i, piece.type);
    P.moved = true;
  }
  document.getElementById("pmsg").innerHTML = "";
  pdrag = null;
  drawPiece();
}
function resetPiece() {
  if (P.solved) return;
  P.pieces.forEach(function (p, i) { p.pts = copyPts(P.init[i]); });
  P.moved = false; P.sel = -1;
  document.getElementById("pmsg").innerHTML = "";
  drawPiece();
}
function checkPiece() {
  var full = P.slots.every(function (s) {
    return P.pieces.some(function (p) { return p.type === s.type && pKey(p.pts) === pKey(s.pts); });
  });
  if (!full) {
    document.getElementById("pmsg").innerHTML = '<div class="msg bad">아직 점선 모양이 다 채워지지 않았어요. 계속 옮겨 보세요</div>';
    return;
  }
  P.solved = true; P.sel = -1;
  drawPiece();
  var a2 = P.a * P.a, b2 = P.b * P.b, c = Math.sqrt(a2 + b2);
  document.getElementById("pbtns").style.display = "none";
  document.getElementById("pmsg").innerHTML = '<div class="msg ok">성공! ' + P.why + "<br>" +
    "c² = a² + b² → " + (a2 + b2) + " = " + a2 + " + " + b2 +
    (Number.isInteger(c) ? " (빗변의 길이는 " + c + ")" : "") + "</div>" +
    '<button class="big primary" onclick="finishExchange()">타일 교환하기</button>';
}

// ===== 바스카라 퍼즐 (의자 모양) =====
// 정사각형 b²와 a²를 붙인 '의자 모양'에서 직각삼각형 2개를 옮겨 기울어진 c² 정사각형을 만듦
function startBhaskara(a, b) {
  var TEAL = "rgba(42,157,143,0.9)";
  var pent = [[0, 0], [b, 0], [b, b - a], [a + b, b - a], [a, b]];
  startPiecePuzzle({
    title: "바스카라 (의자 모양)", a: a, b: b,
    guide: "a²와 b²가 붙은 의자 모양에서 직각삼각형 2개를 옮겨, 주황 점선의 기울어진 정사각형(c²)을 만들어 보세요",
    why: "삼각형 2개를 옮기기만 했으니 의자 모양(a² + b²)과 넓이가 같아요.",
    statics: [{ pts: pent, fill: "rgba(42,157,143,0.55)" }],
    pieces: [
      { pts: [[0, 0], [0, b], [a, b]], type: "tri", fill: TEAL },
      { pts: [[a, b], [a + b, b], [a + b, b - a]], type: "tri", fill: TEAL }
    ],
    slots: [
      { pts: [[0, 0], [b, 0], [b, -a]], type: "tri" },
      { pts: [[b, -a], [b, b - a], [a + b, b - a]], type: "tri" }
    ],
    outline: [[0, 0], [a, b], [a + b, b - a], [b, -a]],
    labels: [
      { x: b / 2, y: b / 2, t: "b²", until: true },
      { x: b + a / 2, y: b - a / 2, t: "a²", until: true }
    ],
    doneLabel: { x: (a + b) / 2, y: (b - a) / 2, t: "c²" },
    view: [-(a + b) * 0.15, -a - (a + b) * 0.25, (a + b) * 1.3, a + b + (a + b) * 0.45],
    fs: (a + b) * 0.08,
    snap: Math.max((a + b) * 0.3, 1.2)
  });
}

// ===== 조각 맞추기 퍼즐 (페리갈) =====
// b²를 중심을 지나는 수직인 두 직선(하나는 빗변과 평행)으로 4조각 내고, a²와 함께 c²를 채움
function startPerigal(a, b) {
  var c = Math.hypot(a, b), h = b / 2;
  var d1 = [b / c, a / c], d2 = [-a / c, b / c];
  var rays = [d1, d2, [-d1[0], -d1[1]], [-d2[0], -d2[1]]];
  function hit(v) { var t = h / Math.max(Math.abs(v[0]), Math.abs(v[1])); return [v[0] * t, v[1] * t]; }
  var corners = [[h, h], [-h, h], [-h, -h], [h, -h]];
  function angOf(p) { return Math.atan2(p[1], p[0]); }
  function between(x, lo, hi) { var t = x - lo; while (t < 0) t += 2 * Math.PI; var w = hi - lo; while (w <= 0) w += 2 * Math.PI; return t > 0 && t < w; }
  var local = [];
  for (var i = 0; i < 4; i++) {
    var r1 = rays[i], r2 = rays[(i + 1) % 4];
    var p1 = hit(r1), p2 = hit(r2);
    var corner = corners.filter(function (q) { return between(angOf(q), angOf(p1), angOf(p2)); })[0];
    var shift = [-(c / 2) * (r1[0] + r2[0]), -(c / 2) * (r1[1] + r2[1])];
    local.push({ pts: [[0, 0], p1, corner, p2], shift: shift });
  }
  // 왼쪽: 잘린 b²(위)와 a²(아래), 오른쪽: 만들어야 할 c² 정사각형
  var half = (a + b) / 2, gap = Math.max(1, b * 0.2);
  var Sb = [-half - gap - h, -half + h], Sa = [Sb[0], -half + b + gap + a / 2];
  var TEAL = "rgba(42,157,143,0.9)", CORAL = "rgba(224,123,57,0.85)";
  var pieces = local.map(function (q) {
    return { pts: q.pts.map(function (p) { return add(p, Sb); }), type: "cut", fill: TEAL };
  });
  pieces.push({ pts: [[Sa[0] - a / 2, Sa[1] - a / 2], [Sa[0] + a / 2, Sa[1] - a / 2], [Sa[0] + a / 2, Sa[1] + a / 2], [Sa[0] - a / 2, Sa[1] + a / 2]], type: "sq", fill: CORAL, label: "a²" });
  var slots = local.map(function (q) { return { pts: q.pts.map(function (p) { return add(p, q.shift); }), type: "cut" }; });
  slots.push({ pts: [[-a / 2, -a / 2], [a / 2, -a / 2], [a / 2, a / 2], [-a / 2, a / 2]], type: "sq" });
  var outline = [add(scaleV(d1, c / 2), scaleV(d2, c / 2)), add(scaleV(d1, -c / 2), scaleV(d2, c / 2)),
    add(scaleV(d1, -c / 2), scaleV(d2, -c / 2)), add(scaleV(d1, c / 2), scaleV(d2, -c / 2))];
  var left = Sb[0] - h - gap * 0.5, top = -half - gap, bottom = Math.max(half, Sa[1] + a / 2) + gap * 0.5;
  startPiecePuzzle({
    title: "조각 맞추기", a: a, b: b,
    guide: "b²를 자른 조각 4개와 a²를 끌어, 주황 점선의 정사각형(c²)을 빈틈없이 채워 보세요",
    why: "b² 조각과 a²를 빈틈없이 옮겨 담았으니 c²의 넓이는 a² + b²와 같아요.",
    pieces: pieces, slots: slots, outline: outline,
    labels: [{ x: Sb[0], y: -half - gap * 0.45, t: "b²" }, { x: 0, y: -half - gap * 0.45, t: "c²" }],
    view: [left, top, half + gap * 0.5 - left, bottom - top],
    fs: (a + b) * 0.07,
    snap: Math.max(b * 0.45, 1.2)
  });
}
function scaleV(v, k) { return [v[0] * k, v[1] * k]; }

// ===== 유클리드 퍼즐 =====
var U = null;
var REASONS = ["밑변과 높이가 같아서", "두 도형이 합동이라서", "모양이 같아서"];
var STEPS = [
  { text: "정사각형 a²를 옆으로 밀어 평행사변형으로 만들어요", ans: 0 },
  { text: "평행사변형을 꼭짓점 B를 중심으로 돌려요", ans: 1 },
  { text: "평행사변형을 다시 밀어 c² 안의 직사각형으로 만들어요", ans: 0 }
];
function startEuclid(a, b) {
  var g = geom(a, b);
  var A = g.A, B = g.B, C = g.C, n = g.n, E = g.E;
  var S1 = [B, C, add(C, n), E];
  var S2 = [B, A, add(A, n), E];
  var th = Math.atan2(sub(C, B)[1], sub(C, B)[0]) - Math.atan2(sub(E, B)[1], sub(E, B)[0]);
  while (th > Math.PI) th -= 2 * Math.PI;
  while (th < -Math.PI) th += 2 * Math.PI;
  var S3 = S2.map(function (p) { return rot(p, B, th); });
  var F = S3[1], H = [C[0], 0];
  var S4 = [B, F, add(F, sub(H, B)), H];
  var G = add(A, sub(F, B));
  U = { g: g, S: [S1, S2, S3, S4], th: th, F: F, G: G, H: H, step: 0, showB: false };
  main.innerHTML = "<h2>증명 퍼즐 · 유클리드</h2>" +
    '<p class="sub" id="etext">정사각형 a²의 넓이가 그대로 c² 안으로 옮겨 가는 과정을 따라가요</p>' +
    '<div id="esvg"></div><div id="eask"></div>' +
    '<button class="big" style="font-size:18px;padding:8px 16px" onclick="startEuclid(pa, pb)">⟲ 처음으로</button>';
  drawEuclid(S1);
  askStep();
}
function lerpPts(P, Q, t) {
  return P.map(function (p, i) { return [p[0] + (Q[i][0] - p[0]) * t, p[1] + (Q[i][1] - p[1]) * t]; });
}
function stateAt(k, t) {
  if (k === 1) return U.S[1].map(function (p) { return rot(p, U.g.B, U.th * t); });
  return lerpPts(U.S[k], U.S[k + 1], t);
}
function drawEuclid(movePts) {
  var g = U.g;
  var sqB = [g.A, g.C, add(g.C, g.m), add(g.A, g.m)];
  var sqC = [g.A, g.B, U.F, U.G];
  var fs = g.c * 0.12;
  var inner = poly(sqC, "rgba(224,123,57,0.12)", "none") +
    poly(sqB, U.showB ? "rgba(42,157,143,0.12)" : "rgba(42,157,143,0.35)", "#14524b");
  if (U.showB) inner += poly([g.A, U.H, add(U.H, sub(U.G, g.A)), U.G], "rgba(42,157,143,0.6)", "#14524b");
  inner += poly([g.A, g.B, g.C], "#ffffff");
  inner += poly(movePts, "rgba(224,123,57,0.6)", "#c05a1c");
  inner += poly([g.A, g.B, g.C], "none");
  var mc = centroid(movePts);
  inner += label(mc[0], mc[1], "a²", fs, "#5e2a08");
  var bc = centroid(sqB);
  inner += label(bc[0], bc[1], "b²", fs, "#0e3d38");
  inner += label(g.B[0] + fs * 0.6, g.B[1] - fs * 0.3, "B", fs * 0.7);
  // 빗변 위 정사각형 c²: 굵은 테두리와 글씨 (맨 위에 그림)
  inner += '<polygon points="' + sqC.map(function (q) { return q[0] + "," + q[1]; }).join(" ") +
    '" fill="none" stroke="#b3470f" stroke-width="5" vector-effect="non-scaling-stroke"/>';
  inner += label(g.c / 2, g.c * 0.88, "c²", fs * 1.2, "#7a3a10");
  var all = sqB.concat(sqC, U.S[0], U.S[1], U.S[2]);
  var bb = bounds(all);
  document.getElementById("esvg").innerHTML = svgWrap(bb[0], bb[1], bb[2], bb[3], inner, "lg");
}
function animate(k, cb) {
  var t0 = performance.now(), dur = 1400;
  function frame(now) {
    var t = Math.min(1, (now - t0) / dur);
    var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    drawEuclid(stateAt(k, e));
    if (t < 1) requestAnimationFrame(frame); else if (cb) cb();
  }
  requestAnimationFrame(frame);
}
function askStep() {
  var s = STEPS[U.step];
  document.getElementById("etext").textContent = (U.step + 1) + "단계: " + s.text;
  document.getElementById("eask").innerHTML = '<button class="big primary" onclick="playStep()">움직여 보기 ▶</button>';
}
function playStep() {
  document.getElementById("eask").innerHTML = "";
  animate(U.step, function () {
    document.getElementById("eask").innerHTML = '<div class="q">움직이기 전과 후의 넓이가 같은 이유는?</div><div class="row">' +
      REASONS.map(function (r, i) { return '<button class="big" onclick="pickReason(' + i + ')">' + r + "</button>"; }).join("") + "</div>";
  });
}
function pickReason(i) {
  var s = STEPS[U.step];
  if (i !== s.ans) {
    document.getElementById("eask").innerHTML = '<div class="msg bad">다시 한 번 볼까요? 무엇이 그대로인지 살펴보세요.</div>';
    drawEuclid(U.S[U.step]);
    setTimeout(playStep, 900);
    return;
  }
  U.step++;
  if (U.step < STEPS.length) {
    document.getElementById("eask").innerHTML = '<div class="msg ok">맞아요!</div>';
    setTimeout(askStep, 700);
    return;
  }
  U.showB = true;
  drawEuclid(U.S[3]);
  document.getElementById("etext").textContent = "b²도 같은 방법으로 옮기면 c²의 나머지 직사각형이 돼요";
  document.getElementById("eask").innerHTML = '<div class="q">그러면 c² = ?</div><div class="row">' +
    ["a² + b²", "a² × b²", "a + b"].map(function (r, i) { return '<button class="big" onclick="pickFinal(' + i + ')">' + r + "</button>"; }).join("") + "</div>";
}
function pickFinal(i) {
  if (i !== 0) {
    document.getElementById("eask").insertAdjacentHTML("afterbegin", '<div class="msg bad">c²가 어떤 두 직사각형으로 나뉘었는지 다시 보세요</div>');
    return;
  }
  var a2 = pa * pa, b2 = pb * pb;
  document.getElementById("eask").innerHTML = '<div class="msg ok">성공! c² = a² + b² → ' + (a2 + b2) + " = " + a2 + " + " + b2 + "</div>" +
    '<button class="big primary" onclick="finishExchange()">타일 교환하기</button>';
}

// ===== 화면 격자판 =====
var N = 16;
// 1~4모둠 시작 구역 (네 모서리의 4 × 4칸)
// 기울어진 정사각형은 모서리 점이나 한 칸에는 닿을 수 없어서, 타일의 가장 긴 짧은 변(4)만큼 구역을 둠
var Z = 4;
var START_CELLS = [[0, 0], [N - Z, 0], [0, N - Z], [N - Z, N - Z]].map(function (o) {
  return [[o[0], o[1]], [o[0] + Z, o[1]], [o[0] + Z, o[1] + Z], [o[0], o[1] + Z]];
});
var lands = [];          // 놓인 땅 {team, pts}
var placing = null;      // 땅 놓는 중 {tile, idx, pts: [찍은 격자점]}
var landDone = false;    // 이번 차례에 땅을 놓았는지

function drawGrid() {
  var s = "";
  for (var i = 0; i <= N; i++) {
    var w = (i === 0 || i === N) ? 2.5 : 1;
    s += '<line x1="' + i + '" y1="0" x2="' + i + '" y2="' + N + '" stroke="#9aa3ad" stroke-width="' + w + '" vector-effect="non-scaling-stroke"/>';
    s += '<line x1="0" y1="' + i + '" x2="' + N + '" y2="' + i + '" stroke="#9aa3ad" stroke-width="' + w + '" vector-effect="non-scaling-stroke"/>';
  }
  lands.forEach(function (l) {
    var t = teams[l.team];
    s += poly(l.pts, hexA(t.color, 0.45), t.color);
    var c = centroid(l.pts);
    s += label(c[0], c[1], polyArea(l.pts), 0.55, "#1f2937");
  });
  START_CELLS.forEach(function (cell, i) {
    s += poly(cell, hexA(teams[i].color, 0.25), teams[i].color, 'stroke-dasharray="4 3"');
    var c = centroid(cell);
    s += label(c[0], c[1], teams[i].name + " 시작", 0.55, teams[i].color);
  });
  for (var x = 0; x <= N; x++) for (var y = 0; y <= N; y++) {
    s += '<circle cx="' + x + '" cy="' + y + '" r="0.06" fill="#4b5563" pointer-events="none"/>';
  }
  if (placing) {
    var cur0 = teams[turn];
    if (placing.pts.length >= 2) {
      s += '<polyline points="' + placing.pts.map(function (p) { return p[0] + "," + p[1]; }).join(" ") +
        '" fill="none" stroke="' + cur0.color + '" stroke-width="3" stroke-dasharray="6 4" vector-effect="non-scaling-stroke"/>';
    }
    placing.pts.forEach(function (p, i) {
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="0.3" fill="' + cur0.color + '"/>';
      s += label(p[0], p[1], i + 1, 0.4, "#ffffff");
    });
  }
  var svg = document.getElementById("grid");
  svg.innerHTML = s;
  svg.style.cursor = placing ? "crosshair" : "default";
}
function hexA(hex, a) {
  var n = parseInt(hex.slice(1), 16);
  return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
}
function polyArea(P) {
  var s = 0;
  for (var i = 0; i < P.length; i++) { var p = P[i], q = P[(i + 1) % P.length]; s += p[0] * q[1] - q[0] * p[1]; }
  return Math.abs(s / 2);
}

// 격자판을 누르면 가장 가까운 격자점을 찍음 (이미 찍은 점을 다시 누르면 취소)
document.getElementById("grid").addEventListener("pointerdown", function (e) {
  if (!placing) return;
  var p = svgPoint(e.currentTarget, e);
  var q = [Math.round(p[0]), Math.round(p[1])];
  if (q[0] < 0 || q[0] > N || q[1] < 0 || q[1] > N) return;
  var k = placing.pts.findIndex(function (r) { return r[0] === q[0] && r[1] === q[1]; });
  if (k >= 0) placing.pts.splice(k, 1); else placing.pts.push(q);
  drawGrid();
  if (placing.pts.length === 4) tryPlace(); else renderPlacing("");
});

// ===== 땅 놓기 =====
function openPlace() {
  if (landDone) { showIdle('<div class="msg info">이번 차례에는 이미 땅을 놓았어요 (한 차례에 1개)</div>'); return; }
  if (cur().tiles.length === 0) { showIdle('<div class="msg info">놓을 타일이 없어요. 먼저 미션을 풀어 타일을 얻으세요</div>'); return; }
  placing = null;
  drawGrid();
  main.innerHTML = "<h2>땅 놓기 · " + teamLabel(cur()) + "</h2>" +
    '<p class="sub">격자판에 놓을 타일을 고르세요 (한 차례에 1개)</p><div class="row">' +
    cur().tiles.map(function (t, i) {
      return '<button class="big" onclick="choosePlaceTile(' + i + ')">' + (t.kind === "sq" ? "■ " : "◆ ") + tileArea(t) + "</button>";
    }).join("") + "</div>";
}
function choosePlaceTile(i) {
  placing = { idx: i, tile: cur().tiles[i], pts: [] };
  drawGrid();
  renderPlacing("");
}
function tileHint(t) {
  return t.kind === "sq" ? "한 변이 " + t.s + "인 정사각형"
    : "짧은 두 변이 " + t.a + ", " + t.b + "인 직각삼각형의 빗변 위 정사각형";
}
function renderPlacing(msg) {
  var t = placing.tile;
  main.innerHTML = "<h2>땅 놓기 · " + teamLabel(cur()) + "</h2>" +
    '<div class="q">' + chipHTML(t) + " 넓이 " + tileArea(t) + "</div>" +
    '<p class="sub">' + tileHint(t) + "</p>" +
    '<p class="sub">왼쪽 격자판에서 <b>꼭짓점 4개</b>를 차례로 눌러 정사각형을 만드세요 (' + placing.pts.length + " / 4)</p>" +
    msg +
    '<div class="row"><button class="big" onclick="resetPoints()">⟲ 다시 찍기</button>' +
    '<button class="big" style="border-color:var(--line);color:var(--muted)" onclick="cancelPlace()">취소</button></div>';
}
function resetPoints() { placing.pts = []; drawGrid(); renderPlacing(""); }
function cancelPlace() { placing = null; drawGrid(); showIdle(); }

// 찍은 4점이 규칙에 맞는 정사각형인지 확인
function tryPlace() {
  var err = checkSquare(placing.pts, placing.tile);
  if (err) {
    placing.pts = [];
    drawGrid();
    renderPlacing('<div class="msg bad">' + err + " 다시 찍어 보세요</div>");
    return;
  }
  var c = centroid(placing.pts);
  var pts = placing.pts.slice().sort(function (p, q) {
    return Math.atan2(p[1] - c[1], p[0] - c[0]) - Math.atan2(q[1] - c[1], q[0] - c[0]);
  });
  var team = cur(), t = placing.tile;
  lands.push({ team: turn, pts: pts });
  team.land += tileArea(t) + tileBonus(t);
  team.tiles.splice(placing.idx, 1);
  placing = null;
  landDone = true;
  renderBoard();
  drawGrid();
  showIdle('<div class="msg ok">' + teamLabel(team) + "이 넓이 " + tileArea(t) + "인 땅을 차지했어요!" +
    (tileBonus(t) ? " (교환 보너스 +" + tileBonus(t) + "점)" : "") + "</div>");
}
function checkSquare(P, t) {
  var c = centroid(P);
  var S = P.slice().sort(function (p, q) {
    return Math.atan2(p[1] - c[1], p[0] - c[0]) - Math.atan2(q[1] - c[1], q[0] - c[0]);
  });
  var v = S.map(function (p, i) { return sub(S[(i + 1) % 4], p); });
  var L = dot(v[0], v[0]);
  var isSq = L > 0 && v.every(function (w, i) { return dot(w, w) === L && dot(w, v[(i + 1) % 4]) === 0; });
  if (!isSq) return "네 점이 정사각형을 이루지 않아요.";
  if (S.some(function (p) { return p[0] < 0 || p[0] > N || p[1] < 0 || p[1] > N; })) return "격자판 밖으로 나가요.";
  var comps = [Math.abs(v[0][0]), Math.abs(v[0][1])].sort(function (x, y) { return x - y; });
  var want = t.kind === "sq" ? [0, t.s] : [Math.min(t.a, t.b), Math.max(t.a, t.b)];
  if (L !== tileArea(t)) return "이 정사각형의 넓이는 " + L + "이에요. 타일의 넓이 " + tileArea(t) + "와 달라요.";
  if (comps[0] !== want[0] || comps[1] !== want[1]) return "넓이는 맞지만 " + tileHint(t) + " 모양이 아니에요.";
  var others = lands.filter(function (l) { return true; });
  if (others.some(function (l) { return overlaps(S, l.pts); })) return "다른 땅과 겹쳐요.";
  var mine = lands.filter(function (l) { return l.team === turn; });
  var cell = START_CELLS[turn];
  var touch = mine.some(function (l) { return touches(S, l.pts); }) ||
    touches(S, cell) || overlaps(S, cell);
  if (!touch) return "자기 땅이나 시작 구역에 닿거나 걸쳐야 해요.";
  return "";
}
// 두 볼록다각형이 넓이를 가지고 겹치는지 (변이나 꼭짓점만 닿는 것은 겹침 아님)
function overlaps(A, B) {
  var polys = [A, B];
  for (var k = 0; k < 2; k++) {
    var P = polys[k];
    for (var i = 0; i < P.length; i++) {
      var e = sub(P[(i + 1) % P.length], P[i]), n = [-e[1], e[0]];
      var pa = A.map(function (p) { return dot(p, n); }), pb = B.map(function (p) { return dot(p, n); });
      if (Math.max.apply(null, pa) <= Math.min.apply(null, pb) + 1e-9 ||
          Math.max.apply(null, pb) <= Math.min.apply(null, pa) + 1e-9) return false;
    }
  }
  return true;
}
function segDist(p, a, b) {
  var ab = sub(b, a), t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / dot(ab, ab)));
  var q = [a[0] + ab[0] * t, a[1] + ab[1] * t];
  return Math.hypot(p[0] - q[0], p[1] - q[1]);
}
function distToPoly(p, P) {
  var d = Infinity;
  for (var i = 0; i < P.length; i++) d = Math.min(d, segDist(p, P[i], P[(i + 1) % P.length]));
  return d;
}
function touches(A, B) {
  return A.some(function (p) { return distToPoly(p, B) < 1e-9; }) || B.some(function (p) { return distToPoly(p, A) < 1e-9; });
}

// ===== 다음 차례 =====
function openNextTurn() {
  if (!landDone && cur().tiles.length > 0) {
    main.innerHTML = '<div class="msg info">' + teamLabel(cur()) + "이 이번 차례에 땅을 놓지 않았어요. 그래도 넘길까요?</div>" +
      '<div class="row"><button class="big" onclick="openPlace()">땅 놓기</button>' +
      '<button class="big primary" onclick="nextTurn()">다음 차례로</button></div>';
    return;
  }
  nextTurn();
}
function nextTurn() {
  placing = null;
  turn = (turn + 1) % teams.length;
  missionDone = false;
  landDone = false;
  renderBoard();
  drawGrid();
  showIdle();
}

// ===== 게임 끝 =====
// 시간이 끝나면 놓은 땅의 넓이 순서로 결과를 보여 줌 (가지고만 있는 타일은 점수 없음)
function showResult() {
  placing = null;
  drawGrid();
  var order = teams.slice().sort(function (x, y) { return y.land - x.land; });
  main.innerHTML = "<h2>⏱ 시간 끝! 결과 발표</h2>" +
    order.map(function (t) {
      // 넓이가 같으면 같은 등수
      var rank = 1 + teams.filter(function (x) { return x.land > t.land; }).length;
      return '<div class="q">' + (rank === 1 ? "🏆 " : rank + "등 ") + teamLabel(t) + " · 점수 " + t.land + "</div>";
    }).join("") +
    '<p class="note">가지고만 있고 놓지 않은 타일은 점수에 들어가지 않아요</p>';
}

renderBoard();
drawGrid();
showIdle();
