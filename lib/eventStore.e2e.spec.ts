import { Knex } from "knex";
import { createClient, createSchema, dropSchema } from "./database";
import { EventStore } from "./eventStore";
import {
  connectionString,
  createAnotherEvent,
  createDbEvent,
  createEvent,
  createMinimalEvent,
} from "./tests";
import { Event } from "./types";

const describeE2e = process.env.E2E_TESTS === "true" ? describe : describe.skip;

describeE2e("Event store", () => {
  let client: Knex;
  let eventStore: EventStore;

  beforeEach(async () => {
    client = createClient({ connectionString });
    await createSchema(client);
    eventStore = new EventStore(client);
  });

  afterEach(async () => {
    await dropSchema(client);
    await client.destroy();
  });

  describe("on add", () => {
    it("should insert event to database", async () => {
      const event = createEvent();

      const insertedEvent = await eventStore.add(event);

      expect(insertedEvent).toEqual({ ...event, id: "1" });
    });

    it("should insert minimal event to database", async () => {
      const event = createMinimalEvent();

      const insertedEvent = await eventStore.add(event);

      expect(insertedEvent).toEqual({
        id: "1",
        type: event.type,
        date: event.date,
        targetId: null,
        targetType: null,
        payload: null,
      });
    });
  });

  describe("on add all", () => {
    it("should insert events to database", async () => {
      const event = createEvent();
      const anotherEvent = createAnotherEvent();
      const events = [event, anotherEvent];

      const insertedEvents = await eventStore.addAll(events);

      expect(insertedEvents).toEqual([
        { ...event, id: "1" },
        { ...anotherEvent, id: "2" },
      ]);
    });
  });

  describe("on find", () => {
    it("should return events based on a type", async () => {
      const relevantEvent1 = createDbEvent({ id: "1", type: "Relevant" });
      const irrelevantEvent1 = createDbEvent({ id: "2", type: "Irrelevant" });
      const relevantEvent2 = createDbEvent({ id: "3", type: "Relevant" });
      const dbEvents = [relevantEvent1, irrelevantEvent1, relevantEvent2];
      await client("events").insert(dbEvents);

      const stream = eventStore.find({ type: "Relevant" });

      const events = await streamToArray(stream);
      expect(events).toHaveLength(2);
      expect(events[0]).toMatchObject({ id: "1", type: "Relevant" });
      expect(events[1]).toMatchObject({ id: "3", type: "Relevant" });
    });

    it("should return events based on various types", async () => {
      const relevantEvent1 = createDbEvent({ id: "1", type: "Relevant1" });
      const irrelevantEvent1 = createDbEvent({ id: "2", type: "Irrelevant" });
      const relevantEvent2 = createDbEvent({ id: "3", type: "Relevant2" });
      const dbEvents = [relevantEvent1, irrelevantEvent1, relevantEvent2];
      await client("events").insert(dbEvents);

      const stream = eventStore.find({ types: ["Relevant1", "Relevant2"] });

      const events = await streamToArray(stream);
      expect(events).toHaveLength(2);
      expect(events[0]).toMatchObject({ id: "1", type: "Relevant1" });
      expect(events[1]).toMatchObject({ id: "3", type: "Relevant2" });
    });

    it("should return events based on target type", async () => {
      const relevantEvent1 = createDbEvent({
        id: "1",
        target_type: "Relevant",
      });
      const irrelevantEvent1 = createDbEvent({
        id: "2",
        target_type: "Irrelevant",
      });
      const relevantEvent2 = createDbEvent({
        id: "3",
        target_type: "Relevant",
      });
      const dbEvents = [relevantEvent1, irrelevantEvent1, relevantEvent2];
      await client("events").insert(dbEvents);

      const stream = eventStore.find({ targetType: "Relevant" });

      const events = await streamToArray(stream);
      expect(events).toHaveLength(2);
      expect(events[0]).toMatchObject({ id: "1", targetType: "Relevant" });
      expect(events[1]).toMatchObject({ id: "3", targetType: "Relevant" });
    });

    it("should return events based on target id", async () => {
      const relevantEvent1 = createDbEvent({ id: "1", target_id: "42" });
      const irrelevantEvent1 = createDbEvent({ id: "2", target_id: "1337" });
      const relevantEvent2 = createDbEvent({ id: "3", target_id: "42" });
      const dbEvents = [relevantEvent1, irrelevantEvent1, relevantEvent2];
      await client("events").insert(dbEvents);

      const stream = eventStore.find({ targetId: "42" });

      const events = await streamToArray(stream);
      expect(events).toHaveLength(2);
      expect(events[0]).toMatchObject({ id: "1", targetId: "42" });
      expect(events[1]).toMatchObject({ id: "3", targetId: "42" });
    });

    it("should return events after id if provided", async () => {
      const irrelevantEvent1 = createDbEvent({ id: "1", type: "Relevant" });
      const irrelevantEvent2 = createDbEvent({ id: "2", type: "Relevant" });
      const relevantEvent1 = createDbEvent({ id: "3", type: "Relevant" });
      const relevantEvent2 = createDbEvent({ id: "4", type: "Relevant" });
      const dbEvents = [
        irrelevantEvent1,
        irrelevantEvent2,
        relevantEvent1,
        relevantEvent2,
      ];
      await client("events").insert(dbEvents);

      const stream = eventStore.find({ type: "Relevant", afterId: "2" });

      const events = await streamToArray(stream);
      expect(events).toHaveLength(2);
      expect(events[0]).toMatchObject({ id: "3" });
      expect(events[1]).toMatchObject({ id: "4" });
    });

    it("should return events based on multiple criteria", async () => {
      const relevantEvent1 = createDbEvent({
        id: "1",
        target_id: "42",
        target_type: "Relevant",
      });
      const irrelevantEvent1 = createDbEvent({
        id: "2",
        target_id: "42",
        target_type: "Irrelevant",
      });
      const relevantEvent2 = createDbEvent({
        id: "3",
        target_id: "42",
        target_type: "Relevant",
      });
      const irrelevantEvent2 = createDbEvent({
        id: "4",
        target_id: "1337",
        target_type: "Relevant",
      });
      const dbEvents = [
        relevantEvent1,
        irrelevantEvent1,
        relevantEvent2,
        irrelevantEvent2,
      ];
      await client("events").insert(dbEvents);

      const stream = eventStore.find({
        targetId: "42",
        targetType: "Relevant",
      });

      const events = await streamToArray(stream);
      expect(events).toHaveLength(2);
      expect(events[0]).toMatchObject({ id: "1", targetType: "Relevant" });
      expect(events[1]).toMatchObject({ id: "3", targetType: "Relevant" });
    });

    it("could return no events", async () => {
      const irrelevantEvent1 = createDbEvent({
        id: "1",
        target_type: "Irrelevant",
      });
      const dbEvents = [irrelevantEvent1];
      await client("events").insert(dbEvents);

      const stream = eventStore.find({ targetType: "Relevant" });

      const events = await streamToArray(stream);
      expect(events).toHaveLength(0);
    });
  });

  function streamToArray(stream: NodeJS.ReadableStream): Promise<Event[]> {
    return new Promise((resolve, reject) => {
      const result: Event[] = [];
      stream.on("data", (data) => result.push(data));
      stream.on("end", () => resolve(result));
      stream.on("close", () => resolve(result));
      stream.on("error", (error) => reject(error));
    });
  }
});
