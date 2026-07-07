export function getElementDimensions(el) {
  if (!el) return { width: 0, height: 0 };
  let defaultW = 140;
  let defaultH = 80;
  if (el.type === 'actor') { defaultW = 80; defaultH = 120; }
  else if (el.type === 'System') { defaultW = 300; defaultH = 400; }
  else if (el.type === 'package') { defaultW = 200; defaultH = 150; }
  else if (el.type === 'note') { defaultW = 120; defaultH = 120; }
  return {
    width: el.width || defaultW,
    height: el.height || defaultH
  };
}

export function getConnectionPoint(element, side = 'right') {
  if (!element) return { x: 0, y: 0 };
  const { width, height } = getElementDimensions(element);
  const positions = {
    top: { x: element.x + width / 2, y: element.y, side: 'top' },
    bottom: { x: element.x + width / 2, y: element.y + height, side: 'bottom' },
    left: { x: element.x, y: element.y + height / 2, side: 'left' },
    right: { x: element.x + width, y: element.y + height / 2, side: 'right' }
  };
  return positions[side] || { ...positions.right, side: 'right' };
}

export function getOrthogonalPathPoints(fromPt, fromElement, toPt, toElement) {
  const x1 = fromPt?.x || 0;
  const y1 = fromPt?.y || 0;
  const x2 = toPt?.x || 0;
  const y2 = toPt?.y || 0;
  const fromSide = fromPt?.side || 'right';
  const toSide = toPt?.side || 'left';

  let fromB = null;
  if (fromElement) {
    const { width, height } = getElementDimensions(fromElement);
    fromB = {
      left: fromElement.x,
      right: fromElement.x + width,
      top: fromElement.y,
      bottom: fromElement.y + height
    };
  }

  let toB = null;
  if (toElement) {
    const { width, height } = getElementDimensions(toElement);
    toB = {
      left: toElement.x,
      right: toElement.x + width,
      top: toElement.y,
      bottom: toElement.y + height
    };
  }

  // 1. Calculate clearance projection points using boundary edges
  let px1 = x1;
  let py1 = y1;
  if (fromElement && fromB) {
    if (fromSide === 'right') px1 = fromB.right + 24;
    else if (fromSide === 'left') px1 = fromB.left - 24;
    else if (fromSide === 'top') py1 = fromB.top - 24;
    else if (fromSide === 'bottom') py1 = fromB.bottom + 24;
  } else {
    if (fromSide === 'right') px1 = x1 + 24;
    else if (fromSide === 'left') px1 = x1 - 24;
    else if (fromSide === 'top') py1 = y1 - 24;
    else if (fromSide === 'bottom') py1 = y1 + 24;
  }

  let px2 = x2;
  let py2 = y2;
  if (toElement && toB) {
    if (toSide === 'right') px2 = toB.right + 24;
    else if (toSide === 'left') px2 = toB.left - 24;
    else if (toSide === 'top') py2 = toB.top - 24;
    else if (toSide === 'bottom') py2 = toB.bottom + 24;
  } else {
    if (toSide === 'right') px2 = x2 + 24;
    else if (toSide === 'left') px2 = x2 - 24;
    else if (toSide === 'top') py2 = y2 - 24;
    else if (toSide === 'bottom') py2 = y2 + 24;
  }

  const isFromHorizontal = ['left', 'right'].includes(fromSide);
  const isToHorizontal = ['left', 'right'].includes(toSide);

  // Case A: Horizontal Exit -> Horizontal Entry
  if (isFromHorizontal && isToHorizontal) {
    // A1: Right to Left
    if (fromSide === 'right' && toSide === 'left') {
      if (x2 >= x1) {
        const midX = px1 + (px2 - px1) / 2;
        return [
          { x: x1, y: y1 },
          { x: px1, y: py1 },
          { x: midX, y: py1 },
          { x: midX, y: py2 },
          { x: px2, y: py2 },
          { x: x2, y: y2 }
        ];
      } else {
        const midY = py1 + (y2 - y1) / 2;
        return [
          { x: x1, y: y1 },
          { x: px1, y: py1 },
          { x: px1, y: midY },
          { x: px2, y: midY },
          { x: px2, y: py2 },
          { x: x2, y: y2 }
        ];
      }
    }
    // A2: Left to Right
    if (fromSide === 'left' && toSide === 'right') {
      if (x2 <= x1) {
        const midX = px1 + (px2 - px1) / 2;
        return [
          { x: x1, y: y1 },
          { x: px1, y: py1 },
          { x: midX, y: py1 },
          { x: midX, y: py2 },
          { x: px2, y: py2 },
          { x: x2, y: y2 }
        ];
      } else {
        const midY = py1 + (y2 - y1) / 2;
        return [
          { x: x1, y: y1 },
          { x: px1, y: py1 },
          { x: px1, y: midY },
          { x: px2, y: midY },
          { x: px2, y: py2 },
          { x: x2, y: y2 }
        ];
      }
    }
    // A3: Same-Side (Right-to-Right or Left-to-Left)
    let escapeY;
    if (y2 >= y1) {
      const maxY = Math.max(fromB ? fromB.bottom : y1, toB ? toB.bottom : y2);
      escapeY = maxY + 24;
    } else {
      const minY = Math.min(fromB ? fromB.top : y1, toB ? toB.top : y2);
      escapeY = minY - 24;
    }
    return [
      { x: x1, y: y1 },
      { x: px1, y: py1 },
      { x: px1, y: escapeY },
      { x: px2, y: escapeY },
      { x: px2, y: py2 },
      { x: x2, y: y2 }
    ];
  }

  // Case B: Vertical Exit -> Vertical Entry
  if (!isFromHorizontal && !isToHorizontal) {
    // B1: Bottom to Top
    if (fromSide === 'bottom' && toSide === 'top') {
      if (y2 >= y1) {
        const midY = py1 + (py2 - py1) / 2;
        return [
          { x: x1, y: y1 },
          { x: px1, y: py1 },
          { x: px1, y: midY },
          { x: px2, y: midY },
          { x: px2, y: py2 },
          { x: x2, y: y2 }
        ];
      } else {
        const midX = px1 + (x2 - x1) / 2;
        return [
          { x: x1, y: y1 },
          { x: px1, y: py1 },
          { x: midX, y: py1 },
          { x: midX, y: py2 },
          { x: px2, y: py2 },
          { x: x2, y: y2 }
        ];
      }
    }
    // B2: Top to Bottom
    if (fromSide === 'top' && toSide === 'bottom') {
      if (y2 <= y1) {
        const midY = py1 + (py2 - py1) / 2;
        return [
          { x: x1, y: y1 },
          { x: px1, y: py1 },
          { x: px1, y: midY },
          { x: px2, y: midY },
          { x: px2, y: py2 },
          { x: x2, y: y2 }
        ];
      } else {
        const midX = px1 + (x2 - x1) / 2;
        return [
          { x: x1, y: y1 },
          { x: px1, y: py1 },
          { x: midX, y: py1 },
          { x: midX, y: py2 },
          { x: px2, y: py2 },
          { x: x2, y: y2 }
        ];
      }
    }
    // B3: Same-Side (Top-to-Top or Bottom-to-Bottom)
    const escapeX = x2 >= x1 
      ? Math.max(fromB ? fromB.right : x1, toB ? toB.right : x2) + 24 
      : Math.min(fromB ? fromB.left : x1, toB ? toB.left : x2) - 24;
    return [
      { x: x1, y: y1 },
      { x: px1, y: py1 },
      { x: escapeX, y: py1 },
      { x: escapeX, y: py2 },
      { x: px2, y: py2 },
      { x: x2, y: y2 }
    ];
  }

  // Case C: Horizontal Exit -> Vertical Entry
  if (isFromHorizontal && !isToHorizontal) {
    if ((fromSide === 'right' && px2 < px1) || 
        (fromSide === 'left' && px2 > px1) ||
        (toSide === 'bottom' && py1 < py2) ||
        (toSide === 'top' && py1 > py2)) {
      return [
        { x: x1, y: y1 },
        { x: px1, y: py1 },
        { x: px1, y: py2 },
        { x: px2, y: py2 },
        { x: x2, y: y2 }
      ];
    }
    return [
      { x: x1, y: y1 },
      { x: px1, y: py1 },
      { x: px2, y: py1 },
      { x: px2, y: py2 },
      { x: x2, y: y2 }
    ];
  }

  // Case D: Vertical Exit -> Horizontal Entry
  if (!isFromHorizontal && isToHorizontal) {
    if ((fromSide === 'bottom' && py2 < py1) || 
        (fromSide === 'top' && py2 > py1) ||
        (toSide === 'left' && px1 > px2) ||
        (toSide === 'right' && px1 < px2)) {
      return [
        { x: x1, y: y1 },
        { x: px1, y: py1 },
        { x: px2, y: py1 },
        { x: px2, y: py2 },
        { x: x2, y: y2 }
      ];
    }
    return [
      { x: x1, y: y1 },
      { x: px1, y: py1 },
      { x: px1, y: py2 },
      { x: px2, y: py2 },
      { x: x2, y: y2 }
    ];
  }

  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 }
  ];
}

export function getOrthogonalPathMidpoint(points) {
  if (!points || points.length === 0) return { x: 0, y: 0 };
  if (points.length === 2) {
    return {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2
    };
  }
  if (points.length === 6) {
    const p2 = points[2];
    const p3 = points[3];
    return {
      x: (p2.x + p3.x) / 2,
      y: (p2.y + p3.y) / 2
    };
  }
  if (points.length === 5) {
    return { x: points[2].x, y: points[2].y };
  }
  
  // Fallback: total length based midpoint
  let totalLength = 0;
  const lengths = [];
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i+1].x - points[i].x;
    const dy = points[i+1].y - points[i].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    lengths.push(len);
    totalLength += len;
  }
  
  let target = totalLength / 2;
  let accumulated = 0;
  for (let i = 0; i < points.length - 1; i++) {
    if (accumulated + lengths[i] >= target) {
      const ratio = (target - accumulated) / lengths[i];
      return {
        x: points[i].x + (points[i+1].x - points[i].x) * ratio,
        y: points[i].y + (points[i+1].y - points[i].y) * ratio
      };
    }
    accumulated += lengths[i];
  }
  
  const last = points[points.length - 1];
  return {
    x: (points[0].x + last.x) / 2,
    y: (points[0].y + last.y) / 2
  };
}

export function getPathStringFromPoints(points) {
  if (!points || points.length === 0) return '';
  return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
}
