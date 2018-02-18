import { DbEvent, Event, NewDbEvent, NewEvent } from './types';

export function eventToDbEvent(event: NewEvent): NewDbEvent {
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
