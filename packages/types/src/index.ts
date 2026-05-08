
export interface PREvent{
    installationId : number;
    repoFullName : string;
    prNumber : number;
    prTitle : string;
    baseCommit : string;
    latestCommit : string
}

export interface ReviewJob extends PREvent{
    jobId : string;
}