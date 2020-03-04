
export const safeJsonParse = (json: any) => {
    if (typeof json !== 'string') { return json; }

    try { return JSON.parse(json); } catch { return undefined; }
};
