export interface UpdateViewerProps {
    apiEndpoint?: string;
    applicationName: string;
    /**
     * The current application's version
     * against which the diff is computed.
     */
    applicationVersion: string;
    /**
     * The desired version to update to.
     * `develop` might lead to a version with bugs.
     * `stable` is the best-tested version.
     */
    updateVersionTag: VersionTag;
    customerName: string;
    customerGroup: string;
}
export type VersionTag = "develop" | "stable" | "beta";
