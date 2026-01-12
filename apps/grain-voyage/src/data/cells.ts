import { ports } from "./ports";
import { routes } from "./routes";

/**
 * 航路上のマス（セル）
 * 港と港の間に配置される中間地点
 */
export interface RouteCell {
  id: string;
  routeId: string;
  index: number; // 航路上の位置（0から始まる）
  coordinates: { lat: number; lng: number };
  type: "normal" | "port"; // 港マスか通常マスか
  portId?: string; // 港マスの場合のみ
}

/**
 * 2点間の座標を線形補間
 */
function lerp(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  t: number
): { lat: number; lng: number } {
  return {
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
  };
}

/**
 * ウェイポイント配列に沿ってセルの座標を生成
 * 始点と終点を含む全体のパスに対して均等にセルを配置
 */
function generateCellsAlongPath(
  startCoord: { lat: number; lng: number },
  endCoord: { lat: number; lng: number },
  waypoints: { lat: number; lng: number }[] | undefined,
  cellCount: number // セルの総数（始点と終点を含む）
): { lat: number; lng: number }[] {
  // 全ての点を配列にまとめる
  const allPoints = [startCoord, ...(waypoints || []), endCoord];

  // 各セグメントの長さを計算
  const segmentLengths: number[] = [];
  let totalLength = 0;

  for (let i = 0; i < allPoints.length - 1; i++) {
    const p1 = allPoints[i];
    const p2 = allPoints[i + 1];
    const length = Math.sqrt(
      Math.pow(p2.lat - p1.lat, 2) + Math.pow(p2.lng - p1.lng, 2)
    );
    segmentLengths.push(length);
    totalLength += length;
  }

  // セルの座標を生成
  const cellCoords: { lat: number; lng: number }[] = [];

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
    const p1 = allPoints[segmentIndex];
    const p2 = allPoints[segmentIndex + 1];
    cellCoords.push(lerp(p1, p2, t));
  }

  return cellCoords;
}

/**
 * 全航路のマスを生成
 */
function generateAllCells(): RouteCell[] {
  const cells: RouteCell[] = [];

  for (const route of routes) {
    const fromPort = ports.find((p) => p.id === route.from);
    const toPort = ports.find((p) => p.id === route.to);

    if (!fromPort || !toPort) continue;

    // セルの総数 = distance + 1（始点と終点を含む）
    const cellCount = route.distance + 1;

    // ウェイポイントに沿ってセル座標を生成
    const cellCoords = generateCellsAlongPath(
      fromPort.coordinates,
      toPort.coordinates,
      route.waypoints,
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
