const root = document.documentElement;
const sections = Array.from(document.querySelectorAll("[data-section]"));
const revealables = Array.from(document.querySelectorAll("[data-reveal]"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const emailAddress = ["jeremyjdawson", "gmail.com"].join("@");

root.dataset.enhanced = "true";

if (!reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      }
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  for (const item of revealables) {
    revealObserver.observe(item);
  }
} else {
  for (const item of revealables) {
    item.classList.add("is-visible");
  }
}

const setActiveSection = () => {
  const viewportMidpoint = window.innerHeight * 0.35;
  let activeSection = sections[0]?.getAttribute("data-section") ?? "top";

  for (const section of sections) {
    const bounds = section.getBoundingClientRect();
    if (bounds.top <= viewportMidpoint && bounds.bottom >= viewportMidpoint) {
      activeSection = section.getAttribute("data-section") ?? activeSection;
    }
  }

  root.dataset.activeSection = activeSection;
};

// ── Timeline path ─────────────────────────────────────

const svg = document.getElementById("timeline-path-svg");
const trackPath = document.getElementById("timeline-track");
const drawPath = document.getElementById("timeline-draw");
const ghostGroup = document.getElementById("ghost-paths");
const branchGroup = document.getElementById("branch-paths");
const sectionNodesGroup = document.getElementById("section-nodes");
const splitPathsGroup = document.getElementById("split-paths");
const portalGroup = document.getElementById("portal-group");
const fanPathsGroup = document.getElementById("fan-paths");
const prismGroup = document.getElementById("prism-group");
const prismPathsGroup = document.getElementById("prism-paths");
const leadingDot = document.getElementById("leading-dot");
const terminusOrb = document.getElementById("terminus-orb");
const pathGradient = document.getElementById("path-gradient");

// Dynamic element state
let ghostPathEls = [];
let ghostLengths = [];
let branchPathEls = [];
let branchLengths = [];
let branchThresholds = [];
let sectionNodeEls = [];
let sectionNodeYs = [];
let splitPathEls = [];
let splitLengths = [];
let splitRange = { start: 0, end: 0 };
let portalEl = null;
let portalInnerEl = null;
let portalProgress = 0;
let fanPathEls = [];
let fanLengths = [];
let fanRange = { start: 0, end: 0 };
let prismBodyEl = null;
let prismBeamEl = null;
let prismGlowEl = null;
let prismEdgeEls = [];
let prismHighlightEl = null;
let prismRayEls = [];
let prismRayLengths = [];
let prismRange = { start: 0, end: 0, faceY: 0 };
let terminusProgress = 1;
// When the contact section contains a loop around the heading, the path is
// non-monotonic in Y, so the viewport→arc-length binary search fails there.
// We instead allocate the contact loop's arc length linearly by how far the
// user has scrolled into the section.
let contactLinearInfo = null;

let glowHeaders = [];

// Spectral colors for rainbow/prism effects (red→violet dispersion order)
const SPECTRAL_COLORS = [
  "#da6c62", "#CC9B52", "#a9dc76", "#00B3BD", "#5288BA", "#c47cbf",
];

// Portal rainbow uses a different ordering for visual balance
const PORTAL_COLORS = [
  "#00B3BD", "#c47cbf", "#da6c62", "#CC9B52", "#a9dc76", "#5288BA",
];

function svgEl(tag, attrs, parent) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  if (parent) parent.appendChild(el);
  return el;
}

function initDashPath(path, lengthsArray) {
  const len = path.getTotalLength();
  lengthsArray.push(len);
  path.style.strokeDasharray = String(len);
  path.style.strokeDashoffset = String(len);
  return len;
}

// Per-section gradient colors (coral -> gold -> lime -> teal -> blue -> purple -> coral)
const gradientColors = [
  "#da6c62",
  "#CC9B52",
  "#a9dc76",
  "#00B3BD",
  "#5288BA",
  "#c47cbf",
  "#da6c62",
];

function buildBezierString(waypoints) {
  let d = `M ${waypoints[0][0]},${waypoints[0][1]}`;
  for (let i = 1; i < waypoints.length; i++) {
    const [px, py] = waypoints[i - 1];
    const [cx2, cy] = waypoints[i];
    const dy = cy - py;
    d += ` C ${px},${py + dy * 0.5} ${cx2},${cy - dy * 0.5} ${cx2},${cy}`;
  }
  return d;
}

let pathLUT = [];

function getPointAtProgress(progress) {
  if (pathLUT.length === 0) return { x: 0, y: 0 };
  const step = Math.min(1, Math.max(0, progress)) * (pathLUT.length - 1);
  const idx1 = Math.floor(step);
  const idx2 = Math.ceil(step);
  if (idx1 === idx2) return pathLUT[idx1];
  const p1 = pathLUT[idx1];
  const p2 = pathLUT[idx2];
  const t = step - idx1;
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
}

// Given a target Y in document coordinates, binary-search the arc-length at
// which the path's leading edge crosses that Y. Returns a 0..1 fraction of
// total arc length. Used to pace the draw animation to the viewport — curved
// and looped segments (contact underscore!) inflate pathLength past docHeight,
// so a naive scrollProgress * pathLength scheme races the leading edge ahead
// of the user's viewport and finishes early.
function pathProgressAtY(path, length, targetY) {
  if (pathLUT.length === 0 || length <= 0 || targetY <= 0) return 0;
  let lo = 0;
  let hi = pathLUT.length - 1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (pathLUT[m].y < targetY) lo = m + 1;
    else hi = m - 1;
  }
  const idx = Math.min(lo, pathLUT.length - 1);
  return Math.min(1, Math.max(0, pathLUT[idx].l / length));
}

function buildTimelinePath() {
  if (
    !(svg instanceof SVGSVGElement) ||
    !(trackPath instanceof SVGPathElement) ||
    !(drawPath instanceof SVGPathElement)
  ) {
    return 0;
  }

  const docHeight = document.documentElement.scrollHeight;
  svg.style.height = docHeight + "px";

  // Clean up prism mask from previous build
  drawPath.removeAttribute("mask");
  const oldMask = document.getElementById("prism-mask");
  if (oldMask) oldMask.remove();
  const oldMaskGrad = document.getElementById("prism-mask-gradient");
  if (oldMaskGrad) oldMaskGrad.remove();

  const W = window.innerWidth;
  const maxW = 1100;
  const padding = 32;
  const colW = Math.min(W - padding, maxW);
  const leftMargin = (W - colW) / 2;

  const cx = leftMargin + colW * 0.5;
  const leftX = leftMargin + colW * 0.18;
  const rightX = leftMargin + colW * 0.82;

  // Per-section midpoint x — tuned so the curve threads column gaps and
  // content edges instead of ploughing through body text. The 2-column
  // grids (about / projects / research) collapse to a single column
  // below 960px, so narrow viewports fall back to the default alternating
  // bounds where no clean gap exists.
  const wide = W > 960;
  const sectionSideX = wide ? {
    top:        leftX,                                // hero — original left sweep
    about:      leftMargin + colW * 0.589,            // body/principles col gap
    experience: Math.min(leftMargin + colW + 20, W - 8), // past right content edge
    projects:   leftMargin + colW * 0.506,            // right side of card gap
    research:   leftMargin + colW * 0.494,            // left side of card gap
    contact:    rightX,                               // unused — custom underscore
  } : null;

  const waypoints = [[cx, 0]];
  let goLeft = true;

  const sectionMids = [];
  const sectionBounds = [];
  let contactUnderscore = null;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const height = rect.height;
    const mid = top + height * 0.5;
    const bottom = top + height;

    const sideX = sectionSideX?.[section.id] ?? (goLeft ? leftX : rightX);

    // Contact section: build a smooth underscore arc separately
    if (section.id === "contact") {
      const heading = section.querySelector(".section__title");
      if (heading) {
        const range = document.createRange();
        range.selectNodeContents(heading);
        const tRect = range.getBoundingClientRect();
        const tStr = getComputedStyle(heading).transform;
        const hTY = tStr && tStr !== "none" ? new DOMMatrix(tStr).m42 : 0;
        const headingTopAbs = tRect.top + window.scrollY - hTY;
        const headingBottomAbs = tRect.bottom + window.scrollY - hTY;
        contactUnderscore = {
          headingTop: headingTopAbs,
          underY: headingBottomAbs + 12,
          textLeft: tRect.left,
          textRight: tRect.right,
          textMidX: (tRect.left + tRect.right) / 2,
          bottom,
        };
      } else {
        waypoints.push([sideX, mid]);
        waypoints.push([cx, bottom]);
      }
    } else {
      waypoints.push([sideX, mid]);
      waypoints.push([cx, bottom]);
    }

    sectionMids.push({ x: sideX, y: mid, goLeft, bottom });
    sectionBounds.push({ top, mid, bottom, sideX, goLeft });
    goLeft = !goLeft;
  }

  // ── Main path ──────────────────────────────────────
  let d = buildBezierString(waypoints);

  // Measure the pre-contact path length so the animation can switch from
  // viewport-tracking to a simple scroll-linear progress inside the loop.
  // The loop is non-monotonic in Y (ascends the left flank, sweeps over the
  // top, descends the right flank) so a y→arc-length binary search isn't
  // usable there.
  let contactBaseLength = 0;
  let contactStartY = 0;

  // Clockwise loop around the "Get in touch." heading. The path:
  //   1. enters from (cx, startY) and curves right to land on the TOP of
  //      an ellipse circumscribing the heading,
  //   2. sweeps 4 quarter-ellipse cubics clockwise (T→R→B→L→T) so the
  //      underline is the bottom edge of the loop and the top sweep passes
  //      *over* the heading,
  //   3. does one more T→R quarter so the line "continues around the right
  //      side" after the loop,
  //   4. exits smoothly from the right side to (cx, bottom).
  if (contactUnderscore) {
    drawPath.setAttribute("d", d);
    contactBaseLength = drawPath.getTotalLength();

    const { headingTop, underY, textLeft, textRight, bottom } = contactUnderscore;
    const prev = waypoints[waypoints.length - 1];
    const startX = prev[0];
    const startY = prev[1];
    contactStartY = startY;

    const textW = textRight - textLeft;
    const padX = Math.max(textW * 0.1, 36);
    const padY = 28;

    // Ellipse circumscribing the heading with some breathing room
    const ovCx = (textLeft + textRight) / 2;
    const topY = headingTop - padY;
    const botY = underY;
    const ovRy = (botY - topY) / 2;
    const ovCy = topY + ovRy;
    const ovRx = textW / 2 + padX;

    // Cubic-Bezier constant for approximating a quarter ellipse with a
    // single cubic. Control-arm length = k * radius.
    const k = 0.5522847498;
    const cX = k * ovRx;
    const cY = k * ovRy;

    // Loop anchor points (clockwise: Top → Right → Bottom → Left)
    const T = [ovCx, topY];
    const R = [ovCx + ovRx, ovCy];
    const B = [ovCx, botY];
    const L = [ovCx - ovRx, ovCy];

    // Entry A→T: vertical-down tangent at the start, horizontal-right
    // tangent at T so the line smoothly joins the clockwise loop.
    d += ` C ${startX},${(startY + T[1]) / 2} ${T[0] - cX},${T[1]} ${T[0]},${T[1]}`;

    // Q1 T→R: over-top quarter, tangents (right, down)
    d += ` C ${T[0] + cX},${T[1]} ${R[0]},${R[1] - cY} ${R[0]},${R[1]}`;
    // Q2 R→B: right-flank descent to underline, tangents (down, left)
    d += ` C ${R[0]},${R[1] + cY} ${B[0] + cX},${B[1]} ${B[0]},${B[1]}`;
    // Q3 B→L: underline sweep, tangents (left, up)
    d += ` C ${B[0] - cX},${B[1]} ${L[0]},${L[1] + cY} ${L[0]},${L[1]}`;
    // Q4 L→T: left-flank rise, tangents (up, right) — closes the loop
    d += ` C ${L[0]},${L[1] - cY} ${T[0] - cX},${T[1]} ${T[0]},${T[1]}`;
    // Q5 T→R: second pass, "continue around the right side"
    d += ` C ${T[0] + cX},${T[1]} ${R[0]},${R[1] - cY} ${R[0]},${R[1]}`;

    // Exit: return to the column-gap centerline just below the loop, then
    // descend straight to the section bottom. A single curving cubic from R
    // to (cx, bottom) would cut diagonally through the right-column cards.
    const returnY = Math.min(bottom - 40, botY + 70);
    const dyRet = returnY - R[1];
    d += ` C ${R[0]},${R[1] + dyRet * 0.5} ${cx},${returnY - dyRet * 0.5} ${cx},${returnY}`;
    const dyE = bottom - returnY;
    d += ` C ${cx},${returnY + dyE * 0.33} ${cx},${bottom - dyE * 0.33} ${cx},${bottom}`;

    // Single waypoint at (cx, bottom) so the terminus orb lands at the
    // section bottom and the ghost paths descend to the same endpoint.
    // We intentionally skip the loop waypoints — ghost paths use
    // buildBezierString which can't reproduce the loop shape, so we let
    // them ride a simple vertical descent through the contact area.
    waypoints.push([cx, bottom]);
  }

  trackPath.setAttribute("d", d);
  drawPath.setAttribute("d", d);

  const length = drawPath.getTotalLength();
  drawPath.style.strokeDasharray = String(length);
  drawPath.style.strokeDashoffset = String(length);

  pathLUT = [];
  const steps = Math.ceil(length / 2); // roughly 1 point every 2px
  for (let i = 0; i <= steps; i++) {
    const l = (i / steps) * length;
    const pt = drawPath.getPointAtLength(l);
    pathLUT.push({ l, x: pt.x, y: pt.y });
  }

  // Publish the contact section's scroll-fraction mapping so animateTimelinePath
  // can bypass the y→arc binary search once the user reaches the loop area.
  //
  // The draw-tracking point moves with the user: targetY = scrollY + winH*progress,
  // so it starts at the viewport top (progress=0) and drifts to the viewport
  // bottom (progress=1).  The crossover into the contact section happens when
  // targetY = contactStartY, which solves to scrollFracStart = contactStartY / docHeight.
  if (contactUnderscore) {
    const scrollFracStart = Math.max(
      0,
      Math.min(1, contactStartY / Math.max(1, docHeight)),
    );
    contactLinearInfo = {
      scrollFracStart,
      arcStart: contactBaseLength,
      arcEnd: length,
    };
  } else {
    contactLinearInfo = null;
  }

  // Find the arc-length fraction at which the main line's leading edge
  // reaches a given Y. Lets us sync child elements (fan paths, masks) to
  // where the main line *visually* is, not where the user has scrolled to.
  const progressAtY = (targetY) => pathProgressAtY(drawPath, length, targetY);

  // ── Per-section gradient ───────────────────────────
  if (pathGradient) {
    pathGradient.setAttribute("y2", String(docHeight));
    while (pathGradient.firstChild) pathGradient.removeChild(pathGradient.firstChild);

    const positions = [0];
    for (const sb of sectionBounds) {
      positions.push(sb.mid / docHeight);
    }
    positions.push(1);

    for (let i = 0; i < positions.length && i < gradientColors.length; i++) {
      svgEl("stop", { offset: positions[i], "stop-color": gradientColors[i] }, pathGradient);
    }
  }

  // ── Ghost paths (4 echoes using gradient) ──────────
  if (ghostGroup) {
    ghostGroup.innerHTML = "";
    ghostPathEls = [];
    ghostLengths = [];

    const offsets = [14, -14, 28, -28];
    const opacities = [0.12, 0.12, 0.05, 0.05];

    for (let g = 0; g < offsets.length; g++) {
      const ghostWaypoints = waypoints.map(([wx, wy]) => [wx + offsets[g], wy]);
      const path = svgEl("path", {
        d: buildBezierString(ghostWaypoints),
        class: "timeline-path__ghost",
        stroke: "url(#path-gradient)",
        "stroke-opacity": opacities[g],
      }, ghostGroup);
      ghostPathEls.push(path);
      initDashPath(path, ghostLengths);
    }
  }

  // ── Section transition nodes ───────────────────────
  if (sectionNodesGroup) {
    sectionNodesGroup.innerHTML = "";
    sectionNodeEls = [];
    sectionNodeYs = [];

    for (let i = 2; i < waypoints.length; i += 2) {
      const [nx, ny] = waypoints[i];
      const ring = svgEl("circle", { cx: nx, cy: ny, r: 0, class: "section-node__ring", stroke: "url(#path-gradient)" }, sectionNodesGroup);
      const dot = svgEl("circle", { cx: nx, cy: ny, r: 0, class: "section-node__dot", fill: "url(#path-gradient)" }, sectionNodesGroup);

      sectionNodeEls.push({ ring, dot });
      sectionNodeYs.push(progressAtY(ny));
    }
  }

  // ── Portal + Rainbow split (About section — index 1) ─────────
  if (splitPathsGroup && sectionBounds.length > 1) {
    splitPathsGroup.innerHTML = "";
    splitPathEls = [];
    splitLengths = [];

    const prevBottom = sectionBounds[0].bottom;
    const aboutMidY = sectionBounds[1].mid;
    const aboutBottom = sectionBounds[1].bottom;
    const aboutSideX = sectionBounds[1].sideX;

    splitRange = {
      start: progressAtY(prevBottom),
      end: progressAtY(aboutBottom),
      startY: prevBottom,
      endY: aboutBottom,
    };

    const LINE_SPACING = 10;
    for (let s = 0; s < PORTAL_COLORS.length; s++) {
      const off = (s - (PORTAL_COLORS.length - 1) / 2) * LINE_SPACING;
      const splitD = buildBezierString([
        [cx, prevBottom],
        [aboutSideX + off, aboutMidY],
        [cx, aboutBottom],
      ]);
      const path = svgEl("path", { d: splitD, class: "timeline-path__rainbow" }, splitPathsGroup);
      path.style.stroke = PORTAL_COLORS[s];
      splitPathEls.push(path);
      initDashPath(path, splitLengths);
    }

    portalProgress = progressAtY(prevBottom);
    if (portalGroup) {
      portalGroup.innerHTML = "";
      portalEl = svgEl("ellipse", { cx, cy: prevBottom, rx: 35, ry: 18, class: "portal__ring" }, portalGroup);
      portalInnerEl = svgEl("ellipse", { cx, cy: prevBottom, rx: 25, ry: 12, class: "portal__inner" }, portalGroup);
    }
  }

  // ── Fan-out paths (Projects section — index 3) ────
  if (fanPathsGroup && sectionBounds.length > 3) {
    fanPathsGroup.innerHTML = "";
    fanPathEls = [];
    fanLengths = [];

    const projStart = sectionBounds[2].bottom;
    const projEnd = sectionBounds[3].bottom;
    const spread = colW * 0.3;

    // Stop at the prism's upper face, not its center
    const prismFaceOffset = sectionBounds.length > 4 ? 55 * 2 / 3 : 0;
    const fanEndY = projEnd - prismFaceOffset;

    // Tie fan progress to where the main line actually is, so the fan lines
    // arrive at the prism face at the same scroll position as the main line.
    fanRange = {
      start: progressAtY(projStart),
      end: progressAtY(fanEndY),
      startY: projStart,
      endY: fanEndY,
    };

    const fanCount = 5;
    const fanColors = [
      "rgba(82, 136, 186, 0.26)",
      "rgba(196, 124, 191, 0.26)",
      "rgba(218, 108, 98, 0.4)",
      "rgba(196, 124, 191, 0.26)",
      "rgba(82, 136, 186, 0.26)",
    ];

    for (let f = 0; f < fanCount; f++) {
      const t = (f / (fanCount - 1)) * 2 - 1; // -1 to 1
      const peakX = cx + t * spread;
      const midX = cx + t * spread * 0.4;
      const peakY = projStart + (projEnd - projStart) * 0.55;
      const midY = projStart + (projEnd - projStart) * 0.3;
      const endY = fanEndY;

      const fanD = `M ${cx},${projStart} C ${midX},${midY} ${peakX},${midY + 60} ${peakX},${peakY} C ${peakX},${peakY + (endY - peakY) * 0.5} ${cx},${endY - (endY - peakY) * 0.2} ${cx},${endY}`;
      const path = svgEl("path", { d: fanD, class: "timeline-path__fan" }, fanPathsGroup);
      path.style.stroke = fanColors[f];
      fanPathEls.push(path);
      initDashPath(path, fanLengths);
    }
  }

  // ── Prism refraction (Research section — index 4) ──
  //
  // Physics model (simplified DSOTM):
  //   - The main line comes down vertically. We treat it as "white light".
  //   - It enters the top-left face of the prism.
  //   - Inside, refraction disperses the wavelengths.
  //   - Rays exit through the bottom-left face, with red bending least
  //     (closest to straight-through) and violet bending most.
  //   - Color order from least to most refraction:
  //     Red → Orange → Yellow → Green → Cyan → Violet
  //
  if (prismGroup && prismPathsGroup && sectionBounds.length > 4) {
    prismGroup.innerHTML = "";
    prismPathsGroup.innerHTML = "";
    prismRayEls = [];
    prismRayLengths = [];
    prismEdgeEls = [];

    const prismCy = sectionBounds[3].bottom;
    const prismSize = 55;
    const triHalfBase = (prismSize * 2) / Math.sqrt(3);

    // Apex on left, right face vertical. The beam enters the upper-left
    // face and exits the lower-left face — just like DSOTM album art.
    const apexLeft = [cx - triHalfBase, prismCy];
    const topRight = [cx + triHalfBase * 0.5, prismCy - prismSize];
    const bottomRight = [cx + triHalfBase * 0.5, prismCy + prismSize];

    const triPoints = `${apexLeft[0]},${apexLeft[1]} ${topRight[0]},${topRight[1]} ${bottomRight[0]},${bottomRight[1]}`;

    // Glow layer behind body (pulses when beam hits)
    prismGlowEl = svgEl("polygon", { points: triPoints, class: "prism__glow" }, prismGroup);
    prismBodyEl = svgEl("polygon", { points: triPoints, class: "prism__body" }, prismGroup);

    // Bright edges
    prismEdgeEls = [[apexLeft, topRight], [apexLeft, bottomRight], [topRight, bottomRight]].map(
      ([p1, p2]) => svgEl("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], class: "prism__edge" }, prismGroup)
    );

    // Internal highlight (suggests refraction path)
    prismHighlightEl = svgEl("line", {
      x1: cx, y1: prismCy - prismSize * 0.35,
      x2: cx - triHalfBase * 0.35, y2: prismCy + prismSize * 0.35,
      class: "prism__highlight",
    }, prismGroup);

    // Entry point: where x=cx meets the upper-left face (apexLeft→topRight)
    const entryFrac = (cx - apexLeft[0]) / (topRight[0] - apexLeft[0]);
    const entryY = apexLeft[1] + (topRight[1] - apexLeft[1]) * entryFrac;
    const entryPoint = [cx, entryY];

    prismBeamEl = null;

    const researchMidY = sectionBounds[4].mid;
    const researchBottom = sectionBounds[4].bottom;
    const researchSideX = sectionBounds[4].sideX;

    prismRange = {
      start: progressAtY(prismCy),
      end: progressAtY(researchBottom),
      faceY: entryY,
      endY: researchBottom,
    };

    // Red exits near apex (least deviation), violet near bottomRight (most)
    const spreadRange = Math.abs(cx - researchSideX);
    const convergeY = researchBottom;

    for (let r = 0; r < SPECTRAL_COLORS.length; r++) {
      const t = r / (SPECTRAL_COLORS.length - 1); // 0=red (least bent), 1=violet (most)

      const exitFrac = 0.3 + t * 0.5;
      const exitX = apexLeft[0] + (bottomRight[0] - apexLeft[0]) * exitFrac;
      const exitY = apexLeft[1] + (bottomRight[1] - apexLeft[1]) * exitFrac;

      const midX = cx - t * spreadRange * 0.6;
      const midY = researchMidY;

      // Three cubics with vertical tangents at every junction so the ray
      // enters the prism in the same direction as the main line above it
      // (vertical), bends inside the prism toward its dispersion exit,
      // then continues to the convergence point.
      const dy1 = exitY - entryPoint[1];
      const dy2 = midY - exitY;
      const dy3 = convergeY - midY;
      const inside = `C ${entryPoint[0]},${entryPoint[1] + dy1 * 0.5} ${exitX},${exitY - dy1 * 0.5} ${exitX},${exitY}`;
      const out1 = `C ${exitX},${exitY + dy2 * 0.5} ${midX},${midY - dy2 * 0.5} ${midX},${midY}`;
      const out2 = `C ${midX},${midY + dy3 * 0.5} ${cx},${convergeY - dy3 * 0.5} ${cx},${convergeY}`;

      const rayD = `M ${entryPoint[0]},${entryPoint[1]} ${inside} ${out1} ${out2}`;

      const path = svgEl("path", { d: rayD, class: "timeline-path__prism-ray" }, prismPathsGroup);
      path.style.stroke = SPECTRAL_COLORS[r];
      prismRayEls.push(path);
      initDashPath(path, prismRayLengths);
    }

    // SVG mask: hide main draw path through prism section.
    // Fade starts well above the prism so the gradient-colored line
    // disappears before the white beam takes over — no purple leaking.
    // Bottom: main line reappears where spectral rays converge.
    const maskRevealY = convergeY;

    const defs = svg.querySelector("defs");

    const maskGrad = svgEl("linearGradient", {
      id: "prism-mask-gradient",
      gradientUnits: "userSpaceOnUse",
      x1: 0, y1: 0, x2: 0, y2: docHeight,
    }, defs);

    // Keep the main line fully visible until it reaches the prism's entry
    // face, then snap it out within a few px (no fade above the prism).
    const maskStops = [
      [0, "white"],
      [entryY / docHeight, "white"],
      [(entryY + 4) / docHeight, "black"],
      [(maskRevealY - 60) / docHeight, "black"],
      [(maskRevealY + 30) / docHeight, "white"],
      [1, "white"],
    ];
    for (const [offset, color] of maskStops) {
      svgEl("stop", { offset, "stop-color": color }, maskGrad);
    }

    const mask = svgEl("mask", { id: "prism-mask" }, defs);
    svgEl("rect", { x: 0, y: 0, width: "100%", height: docHeight, fill: "url(#prism-mask-gradient)" }, mask);

    drawPath.setAttribute("mask", "url(#prism-mask)");
    for (const gp of ghostPathEls) {
      gp.setAttribute("mask", "url(#prism-mask)");
    }
  }

  // ── Terminus orb ───────────────────────────────────
  if (terminusOrb && waypoints.length > 0) {
    const last = waypoints[waypoints.length - 1];
    terminusOrb.setAttribute("cx", String(last[0]));
    terminusOrb.setAttribute("cy", String(last[1]));
    terminusProgress = progressAtY(last[1]);
  }

  // ── Branch filaments at each timeline entry ────────
  if (branchGroup) {
    branchGroup.innerHTML = "";
    branchPathEls = [];
    branchLengths = [];
    branchThresholds = [];

    const entries = document.querySelectorAll("[data-entry-index]");

    entries.forEach((entry, i) => {
      const rect = entry.getBoundingClientRect();
      const entryY = rect.top + window.scrollY + rect.height * 0.3;
      const mid = sectionMids[Math.min(i, sectionMids.length - 1)];
      if (!mid) return;

      const branchDir = mid.goLeft ? 1 : -1;
      const startX = mid.x;
      const endX = startX + branchDir * 50;
      const ctrlX = startX + branchDir * 30;

      const bD = `M ${startX},${entryY} C ${ctrlX},${entryY - 15} ${endX},${entryY - 8} ${endX},${entryY + 5}`;
      const path = svgEl("path", { d: bD, class: "timeline-path__branch" }, branchGroup);
      branchPathEls.push(path);
      initDashPath(path, branchLengths);
      branchThresholds.push(progressAtY(entryY));
    });
  }

  glowHeaders = [];
  const headerEls = document.querySelectorAll(
    ".section__title, .timeline__content h3, .project-card h3, .speaking-card h3"
  );
  headerEls.forEach(el => {
    const isSection = el.classList.contains("section__title");
    el.classList.add("glow-header");
    if (isSection) {
      el.classList.add("glow-header--section");
    } else {
      el.classList.add("glow-header--item");
    }
    // Store only the element — we read live position each tick so reveal
    // animations and layout shifts don't produce stale coordinates.
    glowHeaders.push({ el, isLit: false });
  });

  return length;
}

let pathLength = 0;
let currentLerpY = 0;
let needsLERP = false;

function animateTimelinePath() {
  if (pathLength === 0 || reduceMotion) return;
  if (!(drawPath instanceof SVGPathElement)) return;

  const docH = document.documentElement.scrollHeight;
  const winH = window.innerHeight;
  // Scroll progress — used for driving scroll-anchored effects (portal,
  // prism, fan, branch filaments, stroke width) that should fire at specific
  // scroll positions regardless of how much arc length the main line has
  // accumulated.
  const progress = window.scrollY / Math.max(docH - winH, 1);

  // Draw progress — tracks how much of the path to reveal.
  //
  // The tracking point drifts as the user scrolls:
  //   targetY = scrollY + winH * progress
  // At the top of the page (progress=0) it sits at the viewport top edge,
  // so 0% is drawn initially.  At the bottom of the page (progress=1) it
  // sits at the viewport bottom edge, so the line finishes exactly as the
  // user reaches the end.  Throughout the journey the tip is visible at a
  // position that is (progress * 100)% down the viewport.
  //
  // The contact section contains a non-monotonic loop so the Y→arc binary
  // search is unreliable there.  We switch to a scroll-fraction linear ramp;
  // the crossover is seamless because scrollFracStart = contactStartY/docH,
  // which is the exact scroll fraction where targetY first reaches contactStartY.
  const unlerpedTargetY = window.scrollY + winH * progress;
  
  if (currentLerpY === 0 || Math.abs(unlerpedTargetY - currentLerpY) > docH) {
    currentLerpY = unlerpedTargetY;
  } else {
    currentLerpY += (unlerpedTargetY - currentLerpY) * 0.12;
  }
  
  needsLERP = Math.abs(unlerpedTargetY - currentLerpY) > 0.5;
  const targetY = currentLerpY;
  
  let drawProgress;
  if (contactLinearInfo && progress >= contactLinearInfo.scrollFracStart) {
    const { scrollFracStart, arcStart, arcEnd } = contactLinearInfo;
    const remaining = Math.max(0.0001, 1 - scrollFracStart);
    const t = Math.min(1, Math.max(0, (progress - scrollFracStart) / remaining));
    const arcS = arcStart + (arcEnd - arcStart) * t;
    drawProgress = Math.min(1, Math.max(0, arcS / pathLength));
  } else {
    drawProgress = pathProgressAtY(drawPath, pathLength, targetY);
  }

  // ── Main draw path ──
  drawPath.style.strokeDashoffset = String(pathLength * (1 - drawProgress));

  // Leading point of the main line — used to pace secondary effects so their
  // tips never extend beyond the main line's current position.
  const mainLinePt = getPointAtProgress(drawProgress);
  const mainLineY = mainLinePt.y;

  // Stroke width: 2.5 -> 12 with cubic ease-out
  const easedProgress = 1 - Math.pow(1 - progress, 3);
  const strokeW = 2.5 + easedProgress * 9.5;
  drawPath.style.strokeWidth = String(strokeW);

  // ── Ghost paths (trail behind main, scale with width) ──
  // Tie ghost offsets to drawProgress too so they stay aligned with the main
  // line's leading edge, not the scroll fraction.
  const ghostDelays = [0.02, 0.04, 0.06, 0.08];
  for (let g = 0; g < ghostPathEls.length; g++) {
    const ghostProgress = Math.max(0, drawProgress - ghostDelays[g]);
    ghostPathEls[g].style.strokeDashoffset = String(
      ghostLengths[g] * (1 - ghostProgress),
    );
    ghostPathEls[g].style.strokeWidth = String(1.5 + easedProgress * 2.5);
  }

  // ── Leading-edge dot ──
  if (leadingDot && drawProgress > 0.005 && drawProgress < 0.995) {
    const point = mainLinePt;
    // Hide the dot exactly when its center reaches the prism entry face,
    // so it travels all the way down before disappearing.
    const inPrism = prismRange.faceY > 0 &&
      point.y >= prismRange.faceY && drawProgress <= prismRange.end + 0.02;
    if (inPrism) {
      leadingDot.setAttribute("opacity", "0");
    } else {
      leadingDot.setAttribute("cx", String(point.x));
      leadingDot.setAttribute("cy", String(point.y));
      leadingDot.setAttribute("opacity", "1");
      leadingDot.setAttribute("r", String(4 + easedProgress * 5));
    }
  } else if (leadingDot) {
    leadingDot.setAttribute("opacity", "0");
  }

  // ── Section transition nodes ──
  for (let n = 0; n < sectionNodeEls.length; n++) {
    const { ring, dot } = sectionNodeEls[n];
    const threshold = sectionNodeYs[n];

    if (drawProgress >= threshold - 0.02) {
      const p = Math.min(1, (drawProgress - threshold + 0.02) / 0.04);
      const e = 1 - Math.pow(1 - p, 3);

      ring.setAttribute("r", String(8 + e * 14));
      ring.setAttribute("opacity", String(0.25 * e));
      dot.setAttribute("r", String(e * 5));
      dot.setAttribute("opacity", String(e * 0.9));
    } else {
      ring.setAttribute("opacity", "0");
      dot.setAttribute("opacity", "0");
    }
  }

  // ── Portal gateway ──
  if (portalEl && portalInnerEl) {
    if (drawProgress >= portalProgress - 0.03 && drawProgress <= splitRange.end + 0.05) {
      const portalEntry = (drawProgress - portalProgress + 0.03) / 0.06;
      const portalVis = Math.min(1, Math.max(0, portalEntry));
      const scale = 1 - Math.pow(1 - portalVis, 3);

      const sp = splitRange.end > splitRange.start
        ? (drawProgress - splitRange.start) / (splitRange.end - splitRange.start)
        : 0;
      const fadeOut = sp > 0.85 ? Math.max(0, 1 - (sp - 0.85) / 0.15) : 1;

      let outerRx = 35 * scale;
      let innerRx = 25 * scale;
      if (portalVis >= 1 && fadeOut > 0.5) {
        const pulse = Math.sin(Date.now() / 400) * 2;
        outerRx += pulse;
        innerRx += pulse * 0.6;
      }

      portalEl.setAttribute("rx", String(outerRx));
      portalEl.setAttribute("ry", String(18 * scale));
      portalEl.setAttribute("opacity", String(portalVis * fadeOut));
      portalInnerEl.setAttribute("rx", String(innerRx));
      portalInnerEl.setAttribute("ry", String(12 * scale));
      portalInnerEl.setAttribute("opacity", String(portalVis * fadeOut * 0.8));
    } else {
      portalEl.setAttribute("opacity", "0");
      portalInnerEl.setAttribute("opacity", "0");
    }
  }

  // ── Rainbow split paths (About section) ──
  if (splitRange.end > splitRange.start) {
    for (let s = 0; s < splitPathEls.length; s++) {
      if (drawProgress >= splitRange.start && drawProgress <= splitRange.end + 0.05) {
        // Draw position tracks main line Y — tips stay at viewport bottom, not ahead
        const yRange = splitRange.endY - splitRange.startY;
        const yFrac = yRange > 0
          ? Math.min(1, Math.max(0, (mainLineY - splitRange.startY) / yRange))
          : 0;
        splitPathEls[s].style.strokeDashoffset = String(splitLengths[s] * (1 - yFrac));

        // Opacity: staggered fade-in, fade-out near end
        const range = splitRange.end - splitRange.start;
        const sp = (drawProgress - splitRange.start) / Math.max(0.001, range);
        const stagger = s * 0.02;
        const adjusted = Math.max(0, sp - stagger);
        const fadeIn = Math.min(1, adjusted * 6);
        const fadeOut = sp > 0.80 ? Math.max(0, 1 - (sp - 0.80) / 0.20) : 1;
        splitPathEls[s].style.opacity = String(Math.max(0, fadeIn * fadeOut));
      } else {
        splitPathEls[s].style.strokeDashoffset = String(splitLengths[s]);
        splitPathEls[s].style.opacity = "0";
      }
    }
  }

  // ── Fan-out paths (Projects section → converge at prism) ──
  if (fanRange.end > fanRange.start) {
    for (let f = 0; f < fanPathEls.length; f++) {
      if (drawProgress >= fanRange.start) {
        // Draw position tracks main line Y — exact sync, no arc-length/Y mismatch
        const fanYRange = fanRange.endY - fanRange.startY;
        const yFrac = fanYRange > 0
          ? Math.min(1, Math.max(0, (mainLineY - fanRange.startY) / fanYRange))
          : 0;
        fanPathEls[f].style.strokeDashoffset = String(fanLengths[f] * (1 - yFrac));
        const fp = (drawProgress - fanRange.start) / Math.max(0.001, fanRange.end - fanRange.start);
        const fadeIn = Math.min(1, fp * 5);
        // Linger after convergence, then fade
        const fadeOut = fp > 1.2 ? Math.max(0, 1 - (fp - 1.2) / 0.15) : 1;
        fanPathEls[f].style.opacity = String(Math.max(0, fadeIn * fadeOut));
      } else {
        fanPathEls[f].style.strokeDashoffset = String(fanLengths[f]);
        fanPathEls[f].style.opacity = "0";
      }
    }
  }

  // ── Prism refraction (Research section) ──
  if (prismRange.end > prismRange.start) {
    // Prism body + beam + glow visibility
    if (prismBodyEl) {
      const ps = prismRange.start;
      if (drawProgress >= ps - 0.08 && drawProgress <= prismRange.end + 0.08) {
        // Beam fades in early and smoothly
        const beamEntry = (drawProgress - ps + 0.08) / 0.05;
        const beamVis = Math.min(1, Math.max(0, beamEntry));

        // Prism body appears when beam is close
        const prismEntry = (drawProgress - ps + 0.03) / 0.04;
        const prismVis = Math.min(1, Math.max(0, prismEntry));

        const sectionP = (drawProgress - ps) / (prismRange.end - ps);
        const fadeOut = sectionP > 0.90 ? Math.max(0, 1 - (sectionP - 0.90) / 0.15) : 1;
        const opacity = prismVis * fadeOut;

        // Momentary flash when fan paths converge on the prism
        const impactDelta = drawProgress - ps;
        let flash = 0;
        if (impactDelta >= -0.005 && impactDelta < 0.04) {
          const t = impactDelta < 0
            ? (impactDelta + 0.005) / 0.005
            : Math.max(0, 1 - impactDelta / 0.03);
          flash = t * t;
        }

        prismBodyEl.style.opacity = String(Math.min(1, opacity + flash * 0.4));
        for (const edge of prismEdgeEls) {
          edge.style.opacity = String(Math.min(1, opacity * 0.8 + flash * 0.5));
        }
        if (prismHighlightEl) {
          const shimmer = 0.15 + Math.sin(Date.now() / 600) * 0.05;
          prismHighlightEl.style.opacity = String(Math.min(1, opacity * shimmer / 0.2 + flash * 0.6));
        }
        if (prismBeamEl) {
          prismBeamEl.style.opacity = String(Math.min(1, beamVis * fadeOut + flash * 0.3));
        }

        // Inner glow: momentary flash at impact, then gone
        if (prismGlowEl) {
          prismGlowEl.style.opacity = String(flash * fadeOut);
        }
      } else {
        prismBodyEl.style.opacity = "0";
        for (const edge of prismEdgeEls) edge.style.opacity = "0";
        if (prismHighlightEl) prismHighlightEl.style.opacity = "0";
        if (prismBeamEl) prismBeamEl.style.opacity = "0";
        if (prismGlowEl) prismGlowEl.style.opacity = "0";
      }
    }

    // Rainbow ray paths — persist well into the Contact section
    for (let r = 0; r < prismRayEls.length; r++) {
      if (drawProgress >= prismRange.start && drawProgress <= prismRange.end + 0.25) {
        const range = prismRange.end - prismRange.start;
        const rp = (drawProgress - prismRange.start) / Math.max(0.001, range);

        // Draw position tracks main line Y — rays grow with the user's viewport
        const rayYRange = prismRange.endY - prismRange.faceY;
        const yFrac = rayYRange > 0
          ? Math.min(1, Math.max(0, (mainLineY - prismRange.faceY) / rayYRange))
          : 0;
        prismRayEls[r].style.strokeDashoffset = String(prismRayLengths[r] * (1 - yFrac));

        // Opacity: staggered fade-in, linger after convergence then fade
        const stagger = r * 0.025;
        const adjusted = Math.max(0, rp - stagger);
        const fadeIn = Math.min(1, adjusted * 5);
        const fadeOut = rp > 1.3 ? Math.max(0, 1 - (rp - 1.3) / 0.65) : 1;
        prismRayEls[r].style.opacity = String(Math.max(0, fadeIn * fadeOut));
      } else {
        prismRayEls[r].style.strokeDashoffset = String(prismRayLengths[r]);
        prismRayEls[r].style.opacity = "0";
      }
    }
  }

  // ── Terminus orb ──
  if (terminusOrb) {
    if (drawProgress > terminusProgress - 0.08) {
      const tp = Math.min(1, (drawProgress - terminusProgress + 0.08) / 0.1);
      const e = 1 - Math.pow(1 - tp, 3);
      terminusOrb.setAttribute("r", String(e * 22));
      terminusOrb.setAttribute("opacity", String(e * 0.7));
    } else {
      terminusOrb.setAttribute("r", "0");
      terminusOrb.setAttribute("opacity", "0");
    }
  }

  // ── Branch filaments ──
  for (let b = 0; b < branchPathEls.length; b++) {
    const threshold = branchThresholds[b];
    if (drawProgress >= threshold) {
      const branchProgress = Math.min(1, (drawProgress - threshold) / 0.05);
      const eased = 1 - Math.pow(1 - branchProgress, 2);
      branchPathEls[b].style.strokeDashoffset = String(
        branchLengths[b] * (1 - eased),
      );
    }
  }

  // ── Header Glow Intersection ──
  // Read position live so reveal transforms don't produce stale coordinates.
  const margin = 20;
  let needsGlowIdle = false;
  glowHeaders.forEach(header => {
    const rect = header.el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const bottom = rect.bottom + window.scrollY;
    const inRange = currentLerpY >= top - margin && currentLerpY <= bottom + margin;
    if (inRange) {
      if (!header.isLit) {
        header.el.classList.add("is-illuminated");
        header.isLit = true;
      }
      needsGlowIdle = true;
    } else {
      if (header.isLit) {
        header.el.classList.remove("is-illuminated");
        header.isLit = false;
      }
    }
  });

  // ── Dispatch RAF tick ──
  const needsPortalIdle = portalEl && parseFloat(portalEl.getAttribute("opacity") || "0") > 0;
  const needsPrismIdle = prismBodyEl && parseFloat(prismBodyEl.style.opacity || "0") > 0;
  
  if ((needsLERP || needsPortalIdle || needsPrismIdle || needsGlowIdle) && !reduceMotion) {
    if (!idleLoopRunning) {
      idleLoopRunning = true;
      requestAnimationFrame(idleTick);
    }
  } else {
    idleLoopRunning = false;
  }
}

let resizeTimer = -1;
let lastWindowWidth = window.innerWidth;

function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth !== lastWindowWidth) {
      lastWindowWidth = window.innerWidth;
      pathLength = buildTimelinePath();
      animateTimelinePath();
      setActiveSection();
    }
  }, 150);
}

let idleLoopRunning = false;

function idleTick() {
  idleLoopRunning = false; // Reset so animateTimelinePath can definitively reclaim it
  animateTimelinePath();
}

const onScroll = () => {
  setActiveSection();
  if (!idleLoopRunning) {
    idleLoopRunning = true;
    requestAnimationFrame(idleTick);
  }
};

// Reduced-motion fallback: show everything static
if (reduceMotion) {
  pathLength = buildTimelinePath();
  if (drawPath instanceof SVGPathElement && pathLength > 0) {
    drawPath.style.strokeDashoffset = "0";
    drawPath.style.strokeWidth = "12";
  }
  if (leadingDot) leadingDot.setAttribute("opacity", "0");
  for (const gp of ghostPathEls) gp.style.strokeDashoffset = "0";
  for (const bp of branchPathEls) bp.style.strokeDashoffset = "0";
  for (const sp of splitPathEls) {
    sp.style.strokeDashoffset = "0";
    sp.style.opacity = "1";
  }
  if (portalEl) {
    portalEl.setAttribute("opacity", "0.6");
  }
  if (portalInnerEl) {
    portalInnerEl.setAttribute("opacity", "0.5");
  }
  for (const fp of fanPathEls) {
    fp.style.strokeDashoffset = "0";
    fp.style.opacity = "1";
  }
  if (prismBodyEl) prismBodyEl.style.opacity = "0.6";
  for (const edge of prismEdgeEls) edge.style.opacity = "0.5";
  if (prismHighlightEl) prismHighlightEl.style.opacity = "0.3";
  // prismBeamEl removed — fan paths serve as incoming light
  for (const rp of prismRayEls) {
    rp.style.strokeDashoffset = "0";
    rp.style.opacity = "1";
  }
  for (const { ring, dot } of sectionNodeEls) {
    ring.setAttribute("r", "20");
    ring.setAttribute("opacity", "0.25");
    dot.setAttribute("r", "5");
    dot.setAttribute("opacity", "0.9");
  }
  if (terminusOrb) {
    terminusOrb.setAttribute("r", "22");
    terminusOrb.setAttribute("opacity", "0.7");
  }
} else {
  pathLength = buildTimelinePath();
  onScroll();
  if (leadingDot) {
    leadingDot.style.animation = "dot-pulse 2s ease-in-out infinite";
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onResize);

// Re-run after fonts load in case reflow shifts section positions
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    pathLength = buildTimelinePath();
    animateTimelinePath();
  });
}

// ── Email reveal ──────────────────────────────────────

const emailCard = document.querySelector("[data-email-card]");

if (emailCard instanceof HTMLElement) {
  const emailValue = emailCard.querySelector("[data-email-value]");
  const emailDetail = emailCard.querySelector("[data-email-detail]");
  const revealButton = emailCard.querySelector("[data-email-reveal]");
  const emailLink = emailCard.querySelector("[data-email-link]");
  const copyButton = emailCard.querySelector("[data-email-copy]");

  const revealEmail = () => {
    if (!(emailValue instanceof HTMLElement)) return;

    emailValue.textContent = emailAddress;

    if (emailLink instanceof HTMLAnchorElement) {
      emailLink.href = `mailto:${emailAddress}`;
      emailLink.hidden = false;
    }

    if (copyButton instanceof HTMLButtonElement) {
      copyButton.hidden = false;
    }

    if (revealButton instanceof HTMLButtonElement) {
      revealButton.hidden = true;
    }
  };

  if (revealButton instanceof HTMLButtonElement) {
    revealButton.addEventListener("click", revealEmail);
  }

  if (copyButton instanceof HTMLButtonElement) {
    copyButton.addEventListener("click", async () => {
      revealEmail();

      if (!(emailDetail instanceof HTMLElement)) return;

      try {
        await navigator.clipboard.writeText(emailAddress);
        emailDetail.textContent = "Email copied to clipboard.";
      } catch {
        emailDetail.textContent = "Copy failed. Use the mail link or select the address.";
      }
    });
  }
}
