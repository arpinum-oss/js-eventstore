import { dbEventToEvent, eventToDbEvent } from "./mapping";

describe("mapping", () => {
  const anyDate = new Date();

  describe("event to db event", () => {
    it("should convert", () => {
      const event = {
        type: "SomeEvent",
        date: anyDate,
        payload: {
          value: "a value",
        },
        targetType: "Thing",
        targetId: "3",
      };

      const result = eventToDbEvent(event);

      expect(result).toEqual({
        type: "SomeEvent",
        date: anyDate,
        payload: {
          value: "a value",
        },
        target_type: "Thing",
        target_id: "3",
      });
    });
  });

  describe("db event to event", () => {
    it("should convert", () => {
      const dbEvent = {
        id: "1",
        type: "SomeEvent",
        date: anyDate,
        payload: {
          value: "a value",
        },
        target_type: "Thing",
        target_id: "3",
      };
      const result = dbEventToEvent(dbEvent);

      expect(result).toEqual({
        id: "1",
        type: "SomeEvent",
        date: anyDate,
        payload: {
          value: "a value",
        },
        targetType: "Thing",
        targetId: "3",
      });
    });
  });
});
