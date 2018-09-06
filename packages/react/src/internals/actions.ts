export function getActionType(action: any): string {
  if (action.constructor && action.constructor.type) {
    return action.constructor.type;
  }

  return action.type;
}
