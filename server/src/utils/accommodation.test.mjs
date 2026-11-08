import assert from 'assert';
import {
  ACCOMMODATION_OPTIONS,
  calculateAccommodationAvailability,
  getAccommodationFee,
  normalizeAccommodationType
} from './accommodation.js';

assert.strictEqual(getAccommodationFee(), 1350);
assert.strictEqual(getAccommodationFee('fan'), 1350);
assert.strictEqual(getAccommodationFee('aircon'), 1500);
assert.strictEqual(getAccommodationFee('unknown'), null);
assert.strictEqual(normalizeAccommodationType('AIRCON'), 'aircon');
assert.strictEqual(normalizeAccommodationType('unknown'), null);

assert.deepStrictEqual(
  Object.fromEntries(Object.entries(ACCOMMODATION_OPTIONS).map(([type, option]) => [type, [option.rooms, option.beds]])),
  {
    fan: [680, 1360],
    aircon: [132, 264]
  }
);

const initialAvailability = calculateAccommodationAvailability();
assert.strictEqual(initialAvailability.fan.remainingRooms, 680);
assert.strictEqual(initialAvailability.fan.remainingBeds, 1360);
assert.strictEqual(initialAvailability.aircon.remainingRooms, 132);
assert.strictEqual(initialAvailability.aircon.remainingBeds, 264);

const oneFanBedOccupied = calculateAccommodationAvailability({ fan: 1 });
assert.strictEqual(oneFanBedOccupied.fan.occupiedRooms, 1);
assert.strictEqual(oneFanBedOccupied.fan.remainingRooms, 679);
assert.strictEqual(oneFanBedOccupied.fan.remainingBeds, 1359);

const airconFull = calculateAccommodationAvailability({ aircon: 264 });
assert.strictEqual(airconFull.aircon.remainingRooms, 0);
assert.strictEqual(airconFull.aircon.remainingBeds, 0);

const airconOverCapacity = calculateAccommodationAvailability({ aircon: 265 });
assert.strictEqual(airconOverCapacity.aircon.remainingRooms, 0);
assert.strictEqual(airconOverCapacity.aircon.remainingBeds, 0);

console.log('accommodation tests passed');
