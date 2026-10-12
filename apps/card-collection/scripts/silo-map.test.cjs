require("./register-typescript.cjs");
const test = require("node:test");
const assert = require("node:assert/strict");
const { silos } = require("../../../packages/shared/src/data/silos.ts");
const { getSiloPosition, getSiloZoom, groupNearbySilos, getUncollectedRegions } = require("../src/lib/siloMap.ts");
const { siloLocations } = require("../src/data/siloLocations.ts");

test("21施設に監査結果レコードがあり、施設IDと数値範囲が整合する", () => {
  assert.equal(silos.length, 21);
  assert.deepEqual(Object.keys(siloLocations).sort(), silos.map(s => s.id).sort());
  for (const silo of silos) {
    const [lat, lng] = getSiloPosition(silo);
    assert.ok(lat > 30 && lat < 46 && lng > 129 && lng < 146);
    if (siloLocations[silo.id].coordinates) assert.match(siloLocations[silo.id].sourceUrl, /^https:/);
  }
});

test("未獲得を地域に集約し、名称・施設ID・実座標を返さない", () => {
  const regions = getUncollectedRegions(silos, []);
  assert.equal(regions.reduce((sum, region) => sum + region.remaining, 0), 21);
  for (const region of regions) {
    assert.deepEqual(Object.keys(region).sort(), ["id", "name", "position", "remaining"]);
    assert.ok(!region.id.startsWith("silo-"));
    assert.ok(!silos.some(silo => silo.name === region.name));
    assert.ok(!silos.some(silo => JSON.stringify(getSiloPosition(silo)) === JSON.stringify(region.position)));
  }
});

test("収集後は該当地域の残数だけが減り、全獲得で地域ピンがなくなる", () => {
  const before = getUncollectedRegions(silos, []);
  const after = getUncollectedRegions(silos, ["silo-kanto"]);
  assert.equal(before.find(r => r.id === "kanto").remaining - after.find(r => r.id === "kanto").remaining, 1);
  assert.equal(after.reduce((sum, r) => sum + r.remaining, 0), 20);
  assert.deepEqual(getUncollectedRegions(silos, silos.map(s => s.id)), []);
});

test("密集したピンを小縮尺で集約し、拡大後は各施設を選べる。座標を変更しない", () => {
  const snapshot = JSON.stringify(silos);
  const nearby = silos.filter(s => ["silo-toyo", "silo-zenno-tokai"].includes(s.id));
  const project = silo => { const [lat,lng] = getSiloPosition(silo); return [lat * 100, lng * 100]; };
  assert.equal(groupNearbySilos(nearby, project, 52).length, 1);
  assert.equal(groupNearbySilos(nearby, project, 0).length, 2);
  assert.equal(JSON.stringify(silos), snapshot);
});

test("共有座標は丸めず、地点が未確認の施設は既存座標を維持する", () => {
  const silo = silos.find(s => s.id === "silo-nakanihon");
  assert.deepEqual(getSiloPosition(silo), [silo.coordinates.lat, silo.coordinates.lng]);
});


test("概略施設は精密地点と同じ倍率へ拡大しない", () => {
  assert.equal(getSiloZoom(silos.find(s => s.id === "silo-kanto")), 16);
  assert.equal(getSiloZoom(silos.find(s => s.id === "silo-nakanihon")), 11);
});
