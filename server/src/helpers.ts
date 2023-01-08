export function extractLimitOffset(o: any): {
  limit: number;
  offset: number;
} {
  return {
    limit: o?.limit || -1,
    offset: o?.offset || 0,
  };
}

export function setSkipAndTake({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): { skip: number; take: number } {
  let o: any = {};
  if (limit >= 1) {
    o = {
      skip: offset,
      take: limit,
    };
  }

  return o;
}
