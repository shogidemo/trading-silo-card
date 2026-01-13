import { ports } from "./ports";
import { routes } from "./routes";
import { MAP_HEIGHT, MAP_LNG_RANGE, MAP_LAT_RANGE, MAP_WIDTH } from "./mapLayout";

/**
 * 航路上のマス（セル）
 * 港と港の間に配置される中間地点
 */
export interface RouteCell {
  id: string;
  routeId: string;
  index: number; // 航路上の位置（0から始まる）
  coordinates: { x: number; y: number };
  type: "normal" | "port"; // 港マスか通常マスか
  portId?: string; // 港マスの場合のみ
}

/**
 * 2点間の座標を線形補間
 */
function lerp(
  from: { x: number; y: number },
  to: { x: number; y: number },
  t: number
): { x: number; y: number } {
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}

/**
 * ウェイポイント配列に沿ってセルの座標を生成
 * 始点と終点を含む全体のパスに対して均等にセルを配置
 */
function generateCellsAlongPath(
  startCoord: { x: number; y: number },
  endCoord: { x: number; y: number },
  waypoints: { x: number; y: number }[] | undefined,
  cellCount: number // セルの総数（始点と終点を含む）
): { x: number; y: number }[] {
  // 全ての点を配列にまとめる
  const rawPoints = [startCoord, ...(waypoints || []), endCoord];

  // 斜め移動を避けるため、必要なら直角の経由点を追加
  const allPoints: { x: number; y: number }[] = [];
  rawPoints.forEach((point, index) => {
    if (index === 0) {
      allPoints.push(point);
      return;
    }
    const prev = rawPoints[index - 1];
    if (prev.x !== point.x && prev.y !== point.y) {
      const corner = { x: point.x, y: prev.y };
      if (corner.x !== prev.x || corner.y !== prev.y) {
        allPoints.push(corner);
      }
    }
    allPoints.push(point);
  });

  const normalizedPoints = allPoints.filter((point, index) => {
    if (index === 0) return true;
    const prev = allPoints[index - 1];
    return point.x !== prev.x || point.y !== prev.y;
  });

  // 各セグメントの長さを計算
  const segmentLengths: number[] = [];
  let totalLength = 0;

  for (let i = 0; i < normalizedPoints.length - 1; i++) {
    const p1 = normalizedPoints[i];
    const p2 = normalizedPoints[i + 1];
    const length = Math.sqrt(
      Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
    );
    segmentLengths.push(length);
    totalLength += length;
  }

  // セルの座標を生成
  const cellCoords: { x: number; y: number }[] = [];

  for (let i = 0; i < cellCount; i++) {
    const targetDistance = (i / (cellCount - 1)) * totalLength;

    // どのセグメント上にあるか探す
    let accumulatedLength = 0;
    let segmentIndex = 0;

    for (let j = 0; j < segmentLengths.length; j++) {
      if (accumulatedLength + segmentLengths[j] >= targetDistance || j === segmentLengths.length - 1) {
        segmentIndex = j;
        break;
      }
      accumulatedLength += segmentLengths[j];
    }

    // セグメント内での位置（0〜1）
    const segmentLength = segmentLengths[segmentIndex];
    const distanceInSegment = targetDistance - accumulatedLength;
    const t = segmentLength > 0 ? Math.min(1, distanceInSegment / segmentLength) : 0;

    // 補間
    const p1 = normalizedPoints[segmentIndex];
    const p2 = normalizedPoints[segmentIndex + 1];
    cellCoords.push(lerp(p1, p2, t));
  }

  return cellCoords;
}

function projectToMap(coordinates: { lat: number; lng: number }): { x: number; y: number } {
  const x =
    ((coordinates.lng - MAP_LNG_RANGE.min) /
      (MAP_LNG_RANGE.max - MAP_LNG_RANGE.min)) *
    MAP_WIDTH;
  const y =
    (1 -
      (coordinates.lat - MAP_LAT_RANGE.min) /
        (MAP_LAT_RANGE.max - MAP_LAT_RANGE.min)) *
    MAP_HEIGHT;

  return { x, y };
}

function getPortMapPosition(portId: string): { x: number; y: number } | null {
  const port = ports.find((p) => p.id === portId);
  if (!port) return null;
  if (port.mapPosition) return port.mapPosition;
  return projectToMap(port.coordinates);
}

/**
 * 全航路のマスを生成
 */
function generateAllCells(): RouteCell[] {
  const cells: RouteCell[] = [];

  for (const route of routes) {
    const fromPort = ports.find((p) => p.id === route.from);
    const toPort = ports.find((p) => p.id === route.to);

    const fromPosition = getPortMapPosition(route.from);
    const toPosition = getPortMapPosition(route.to);

    if (!fromPort || !toPort || !fromPosition || !toPosition) continue;

    // セルの総数 = distance + 1（始点と終点を含む）
    const cellCount = route.distance + 1;

    // ウェイポイントに沿ってセル座標を生成
    const cellCoords = generateCellsAlongPath(
      fromPosition,
      toPosition,
      route.mapWaypoints,
      cellCount
    );

    // セルを作成
    for (let i = 0; i < cellCount; i++) {
      const isStartPort = i === 0;
      const isEndPort = i === cellCount - 1;

      cells.push({
        id: `${route.id}-${i}`,
        routeId: route.id,
        index: i,
        coordinates: cellCoords[i],
        type: isStartPort || isEndPort ? "port" : "normal",
        portId: isStartPort ? fromPort.id : isEndPort ? toPort.id : undefined,
      });
    }
  }

  return cells;
}

// 全マスを生成
export const routeCells = generateAllCells();

/**
 * 特定の航路のマスを取得
 */
export function getCellsForRoute(routeId: string): RouteCell[] {
  return routeCells.filter((c) => c.routeId === routeId);
}

/**
 * 特定の港に接続しているマスを取得
 */
export function getCellsAtPort(portId: string): RouteCell[] {
  return routeCells.filter((c) => c.type === "port" && c.portId === portId);
}

/**
 * マスIDから次に進めるマスを取得
 * @param cellId 現在のマスID
 * @param direction 進行方向（1: to方向, -1: from方向）
 */
export function getNextCell(
  cellId: string,
  direction: 1 | -1 = 1
): RouteCell | null {
  const currentCell = routeCells.find((c) => c.id === cellId);
  if (!currentCell) return null;

  const nextIndex = currentCell.index + direction;
  const route = routes.find((r) => r.id === currentCell.routeId);

  if (!route) return null;

  // 範囲チェック
  if (nextIndex < 0 || nextIndex > route.distance) {
    return null;
  }

  return routeCells.find(
    (c) => c.routeId === currentCell.routeId && c.index === nextIndex
  ) || null;
}

/**
 * 現在位置から到達可能なマスを取得
 * @param currentCellId 現在のマスID
 * @param moves 残り移動数
 */
export function getReachableCells(
  currentCellId: string,
  moves: number
): RouteCell[] {
  if (moves <= 0) return [];

  const reachable: RouteCell[] = [];
  const visited = new Set<string>();

  function dfs(cellId: string, remainingMoves: number) {
    if (remainingMoves < 0 || visited.has(cellId)) return;

    visited.add(cellId);
    const cell = routeCells.find((c) => c.id === cellId);
    if (!cell) return;

    // 到達したマスを追加（remainingMoves >= 0 なら到達可能）
    reachable.push(cell);

    // 両方向に探索
    const nextForward = getNextCell(cellId, 1);
    const nextBackward = getNextCell(cellId, -1);

    if (nextForward) {
      dfs(nextForward.id, remainingMoves - 1);
    }
    if (nextBackward) {
      dfs(nextBackward.id, remainingMoves - 1);
    }

    // 港の場合、他の航路にも移動可能
    if (cell.type === "port" && cell.portId) {
      const connectedCells = getCellsAtPort(cell.portId);
      for (const connectedCell of connectedCells) {
        if (connectedCell.id !== cellId) {
          // 他の航路の最初/最後のマスに移動
          const nextOnRoute =
            connectedCell.index === 0
              ? getNextCell(connectedCell.id, 1)
              : getNextCell(connectedCell.id, -1);
          if (nextOnRoute) {
            dfs(nextOnRoute.id, remainingMoves - 1);
          }
        }
      }
    }
  }

  // 現在位置から探索開始
  const currentCell = routeCells.find((c) => c.id === currentCellId);
  if (currentCell) {
    // 両方向に探索
    const nextForward = getNextCell(currentCellId, 1);
    const nextBackward = getNextCell(currentCellId, -1);

    if (nextForward) dfs(nextForward.id, moves - 1);
    if (nextBackward) dfs(nextBackward.id, moves - 1);

    // 港の場合、他の航路にも
    if (currentCell.type === "port" && currentCell.portId) {
      const connectedCells = getCellsAtPort(currentCell.portId);
      for (const connectedCell of connectedCells) {
        if (connectedCell.id !== currentCellId) {
          const nextOnRoute =
            connectedCell.index === 0
              ? getNextCell(connectedCell.id, 1)
              : getNextCell(connectedCell.id, -1);
          if (nextOnRoute) {
            dfs(nextOnRoute.id, moves - 1);
          }
        }
      }
    }
  }

  return reachable;
}

/**
 * 港IDから初期マスIDを取得（ゲーム開始時用）
 */
export function getStartingCellId(portId: string): string | null {
  const cells = getCellsAtPort(portId);
  return cells.length > 0 ? cells[0].id : null;
}
