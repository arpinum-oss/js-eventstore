import { DbEvent, DbEventValue, Event, EventValue } from './types';

export function eventToDbEvent(event: EventValue): DbEventValue {
  return {
    type: event.type,
    date: event.date,
    payload: event.payload,
    target_type: event.targetType,
    target_id: event.targetId
  };
}

export function dbEventToEvent(dbEvent: DbEvent): Event {
  return {
    id: dbEvent.id,
    type: dbEvent.type,
    date: dbEvent.date,
    payload: dbEvent.payload,
    targetType: dbEvent.target_type,
    targetId: dbEvent.target_id
  };
}
