/**
 * Handles streaming meeting events from a generator
 * and assigns rooms dynamically.
 *
 * @param {Generator<{start: number, end: number}, void, unknown>} eventGenerator
 * @returns {{ minRooms: number, assignments: Array<{start: number, end: number, roomId: number}> }}
 */
function handleStreamingMeetings(eventGenerator) {
  const minHeap = []; // [endTime, roomId]
  const assignments = [];
  let nextRoomId = 0;

  function pushHeap(endTime, roomId) {
    minHeap.push([endTime, roomId]);
    minHeap.sort((a, b) => a[0] - b[0]); // Min heap 
  }

  function popHeap() {
    return minHeap.shift();
  }

  for (const event of eventGenerator) {
    let assigned = false;
    if (minHeap.length > 0 && minHeap[0][0] <= event.start) {
      const [_, roomId] = popHeap();
      pushHeap(event.end, roomId);
      assignments.push({ ...event, roomId });
      assigned = true;
    }

    if (!assigned) {
      const roomId = nextRoomId++;
      pushHeap(event.end, roomId);
      assignments.push({ ...event, roomId });
    }
  }

  return {
    minRooms: nextRoomId,
    assignments
  };
}

//Generator function for streaming input 
function* eventStream() {
  yield { start: 0, end: 30 };
  yield { start: 5, end: 10 };
  yield { start: 15, end: 20 };
  yield { start: 35, end: 40 };
}

const result = handleStreamingMeetings(eventStream());
console.log("Minimum rooms required:", result.minRooms);
console.log("Room assignments:", result.assignments);
