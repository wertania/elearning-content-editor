export type VersionTag = "develop" | "beta" | "stable";
export interface VersionDiffOptions {
    endpoint: string;
    applicationName: string;
    currentVersion: string;
    versionTag: VersionTag;
    customerName: string;
    customerGroup: string;
}
export interface VersionDiffResponse {
    latestVersion: {
        versionString: string;
        location: {
            container: string;
            blob: string;
        };
        spec: {
            major: number;
            minor: number;
            patch: number;
        };
    };
    updateAvailable: boolean;
    changeLogs: Record<string, ChangeLog>;
    downloadUrl: string;
}
export interface ChangeLog {
    feature: string[];
    fix: string[];
}
declare const _default: {
    versionDiff: (options: VersionDiffOptions) => Promise<VersionDiffResponse | undefined>;
};
export default _default;
