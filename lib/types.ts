export interface NewEvent {
  type: string;
  date: Date;
  payload?: any;
  targetType?: string;
  targetId?: string;
}

export interface Event extends NewEvent {
  id: string;
}

export interface NewDbEvent {
  type: string;
  date: Date;
  payload?: any;
  target_type?: string;
  target_id?: string;
}

export interface DbEvent extends NewDbEvent {
  id: string;
}
