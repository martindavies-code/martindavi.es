# Workspace Rules

## Always Sync & Pull Before Modifying
- **Pull latest from GitHub first**: At the start of any new conversation or before making any edits/changes to the website, ALWAYS check for remote updates (`git fetch origin main`) and pull the latest changes (`git pull --ff-only origin main` or report if divergent) to guarantee you are working on the latest version from GitHub.
- **Always Sync Everything on Change**: Whenever any files are created, edited, or modified in this workspace, ALWAYS automatically stage (`git add`), commit with a descriptive message, and push (`git push origin main`) to GitHub without waiting to be asked.
- Verify that the local branch and GitHub remote (`origin/main`) remain in lockstep and the working tree is clean after every task.
