export declare const safelyParseJson: <T = Record<string, any>>(text: string) => T | null;
export declare const typedEntries: <T extends object>(o: T) => [keyof T, T[keyof T]][];
export declare const typedKeys: <T extends object>(o: T) => (keyof T)[];
export declare const typedValues: <T extends object>(o: T) => T[keyof T][];
