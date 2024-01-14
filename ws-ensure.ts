#!/usr/bin/env -S deno run -A

import {
  ensureRepo,
  mGitStatus,
  workspaceContext,
  workspaceRepo,
} from "./mgit.ts";

/**
 * Declarative (idempotent) managed Git (mGit) repo maintenance. When you want to work on a Git repo
 * in your workspace, add it to `const wsRepos` below and then run these commands:
 *
 *   cd $HOME/workspaces         # or whereever you store your repos
 *   deno run -A ./ws-ensure.ts  # run this script
 *
 * You safely can run this script as many times a day as you want since it's idempotent.
 */

const wsContext = workspaceContext();

/* add your managed Git (GitHub, GitLab, BitBucket, etc.) repos here*/
const wsRepos = [{
  repoUrlWithoutScheme: "github.com/netspective-labs/sql-aide",
}, {
  repoUrlWithoutScheme: "github.com/opsfolio/resource-surveillance",
}];

for (const wsr of wsRepos) {
  await ensureRepo(await workspaceRepo(wsr.repoUrlWithoutScheme, wsContext), {
    ensureVscWsDepsFolders: true,
    // by default we require *.mgit.code-workspace ("strict" matcher) but you can use
    // relaxedVsCodeWsPathMatchers() or your own matchers in case you want others.
    // vsCodeWsPathMatchers: relaxedVsCodeWsPathMatchers(),
  });
}

await mGitStatus(wsContext);
