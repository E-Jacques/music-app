export function extractLimitOffset(o: { [key: string]: string }): {
  limit: number;
  offset: number;
} {
  return {
    limit: Number.parseInt(o?.limit || '-1'),
    offset: Number.parseInt(o?.offset || '0'),
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
