require("./register-typescript.cjs");
const test = require("node:test");
const assert = require("node:assert/strict");
const { silos } = require("../../../packages/shared/src/data/silos.ts");
const { getSiloPosition, getSiloZoom, groupNearbySilos, getVisibleSilos } = require("../src/lib/siloMap.ts");
const { siloLocations } = require("../src/data/siloLocations.ts");

test("21施設に監査結果レコードがあり、施設IDと数値範囲が整合する", () => {
  assert.equal(silos.length, 21);
  assert.deepEqual(Object.keys(siloLocations).sort(), silos.map(s => s.id).sort());
  for (const silo of silos) {
    const position = getSiloPosition(silo);
    if (!position) {
      assert.equal(siloLocations[silo.id].status, "unverified");
      assert.equal(siloLocations[silo.id].coordinates, undefined);
      continue;
    }
    const [lat, lng] = position;
    assert.equal(siloLocations[silo.id].status, "site-point");
    assert.match(siloLocations[silo.id].aerialUrl, /^https:\/\/cyberjapandata.gsi.go.jp\/xyz\/seamlessphoto\/(17|18)\//);
    assert.ok(lat > 30 && lat < 46 && lng > 129 && lng < 146);
    if (siloLocations[silo.id].coordinates) assert.match(siloLocations[silo.id].sourceUrl, /^https:/);
  }
});

test("0枚でもすべて表示は全施設、獲得済み表示は空になる", () => {
  assert.equal(getVisibleSilos(silos, [], false).length, 21);
  assert.deepEqual(getVisibleSilos(silos, [], true), []);
});

test("獲得済みフィルタはサイロだけを返し、保存IDを変更しない", () => {
  const ids = ["silo-kanto", "silo-zenno-kashima", "grain-wheat"];
  assert.deepEqual(getVisibleSilos(silos, ids, true).map(s => s.id), ids.slice(0, 2));
  assert.deepEqual(ids, ["silo-kanto", "silo-zenno-kashima", "grain-wheat"]);
  assert.equal(getVisibleSilos(silos, ids, false).length, 21);
});

test("密集したピンを小縮尺で集約し、拡大後は各施設を選べる。座標を変更しない", () => {
  const snapshot = JSON.stringify(silos);
  const nearby = silos.filter(s => ["silo-toyo", "silo-zenno-tokai"].includes(s.id));
  const project = silo => { const [lat,lng] = getSiloPosition(silo); return [lat * 100, lng * 100]; };
  assert.equal(groupNearbySilos(nearby, project, 52).length, 1);
  assert.equal(groupNearbySilos(nearby, project, 0).length, 2);
  assert.equal(JSON.stringify(silos), snapshot);
});

test("未確認施設は共有の概略座標へフォールバックしない", () => {
  const unknown = { ...silos[0], id: "unverified-synthetic" };
  assert.equal(getSiloPosition(unknown), null);
  assert.equal(getSiloZoom(unknown), 6);
  assert.equal(getSiloPosition(silos.find(s => s.id === "silo-zenno-niigata")), null);
});

test("画面で重なっても離れた港や県の施設を集約しない", () => {
  const facilities = silos.filter(s => ["silo-kanto", "silo-zenno-kashima", "silo-toyo"].includes(s.id));
  const groups = groupNearbySilos(facilities, () => [0, 0], 52);
  assert.deepEqual(groups.map(group => group.length), [2, 1]);
  const kurashiki = silos.filter(s => s.location === "岡山県倉敷市");
  assert.equal(groupNearbySilos(kurashiki, () => [0, 0], 52).length, 3);
});

test("鹿島と苫小牧は航空写真のサイロ本体地点に補正され、詳細倍率で表示する", () => {
  assert.deepEqual(getSiloPosition(silos.find(s => s.id === "silo-zenno-kashima")), [35.91785, 140.667347]);
  assert.deepEqual(getSiloPosition(silos.find(s => s.id === "silo-tomakomai")), [42.642262, 141.669774]);
  for (const silo of silos) assert.equal(getSiloZoom(silo), getSiloPosition(silo) ? 16 : 6);
});
