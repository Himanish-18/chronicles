# Phase 7: GitHub Actions CI/CD Deployment

This document outlines the CI/CD architecture implemented for the Chronicles blogging platform. We have introduced an automated deployment pipeline utilizing GitHub Actions to securely and predictably deploy updates to an AWS EC2 instance.

## 1. Required GitHub Secrets
To authenticate the workflow securely with your AWS EC2 instance, you must configure the following Repository Secrets in your GitHub repository (`Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`):

- `EC2_HOST`: The public IP address or DNS name of your AWS EC2 instance (e.g., `12.34.56.78`).
- `EC2_USER`: The SSH username for your instance (typically `ubuntu` for Ubuntu AMIs).
- `EC2_SSH_KEY`: The raw private key (usually `.pem` file content) used to access the EC2 instance. Must include the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` lines.

## 2. Repository Changes
- **`.github/workflows/deploy.yml`**: Added the GitHub Actions workflow file that triggers on every `push` to the `main` branch. It checks out the code, configures SSH securely, connects to the EC2 instance, and executes the deployment script remotely.
- **`scripts/deploy.sh`**: Developed a robust bash script that executes on the EC2 instance. It fetches the latest code, tears down the old Docker Compose setup, rebuilds the images, restarts the containers in detached mode, cleans up unused resources, and importantly, verifies that all critical services (`mysql`, `backend`, `frontend`) are running successfully. 
- **Execute Permissions**: Modified the Git index to track `scripts/deploy.sh` as an executable file (`chmod +x`), ensuring it runs smoothly across different operating systems.

## 3. How to Test the Pipeline
1. Ensure your GitHub Secrets are fully configured in the repository settings.
2. Commit a small, safe change (e.g., updating a `README.md` or adding a console log) locally.
3. Push the change to the `main` branch: `git push origin main`.
4. Navigate to the **Actions** tab in your GitHub repository.
5. Watch the `Deploy to EC2` workflow run.
6. Verify that the changes went live on your EC2 public IP.

## 4. Expected Workflow Execution
1. **Trigger**: A push event occurs on the `main` branch.
2. **Checkout & SSH Prep**: The GitHub Runner checks out your code and prepares the SSH key from your secrets.
3. **Execution**: The runner SSHs into your EC2 instance and triggers `scripts/deploy.sh`.
4. **Build & Deploy**: The script pulls the latest code from `origin/main` directly onto the EC2 instance and runs `docker compose up -d --build`.
5. **Validation**: The script waits briefly and inspects the status of the `mysql`, `backend`, and `frontend` containers. 
6. **Success/Failure**: If all containers are `Up`, the pipeline succeeds. If any container crashes, it prints the logs for that specific container and the GitHub Action fails, sending you a notification.

## 5. Common Failure Scenarios
- **SSH Connection Timeout**: Occurs if the `EC2_HOST` IP changes (common if you stop/start EC2 without an Elastic IP) or if AWS Security Groups block port 22 from GitHub's IP ranges.
- **Permission Denied (publickey)**: Occurs if the `EC2_SSH_KEY` or `EC2_USER` is incorrect. Ensure there are no extra spaces or missing characters in the secret.
- **Merge Conflicts**: If manual changes were made directly on the EC2 instance, `git pull origin main` inside `deploy.sh` will fail.
- **Container Crash**: If a syntax error is introduced into the code, Docker might build successfully but the container will crash on boot. The validation step in `deploy.sh` will catch this and fail the workflow.

## 6. Troubleshooting Guide
- **Reviewing Logs**: Always start by clicking on the failed run in the GitHub Actions tab. Expand the `Deploy via SSH` step to see the exact output from the EC2 instance.
- **Fixing Merge Conflicts on EC2**: SSH into your instance manually, navigate to `~/chronicles`, and run `git reset --hard origin/main` to force the instance to match GitHub, then rerun the deployment.
- **Checking Service Logs**: If the deployment fails because a service isn't running, the deployment script will automatically print that service's logs into the GitHub Actions console for easy debugging.
