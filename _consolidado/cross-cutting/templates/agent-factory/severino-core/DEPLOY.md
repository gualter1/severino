# 🚀 Severino Core Deployment Guide

## Overview

This guide covers deploying Severino Core to production environments.

## Prerequisites

- Linux server (Ubuntu 22.04+ recommended)
- Node.js 20+ LTS
- PostgreSQL 15+ (optional, for persistent state)
- Redis 7+ (optional, for session/cache)
- Nginx (reverse proxy + SSL)
- Domain with DNS configured

## Quick Deployment (Docker)

### 1. Build Image
```bash
cd severino-core
docker build -t severino-core:latest .
```

### 2. Run Container
```bash
docker run -d \
  --name severino \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.production \
  -v $(pwd)/rooms:/app/rooms \
  -v $(pwd)/grill-sessions:/app/grill-sessions \
  -v $(pwd)/whatsapp-session:/app/whatsapp-session \
  severino-core:latest
```

### 3. Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name severino.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name severino.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/severino.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/severino.yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    # Webhook endpoints need raw body
    location /webhook/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Systemd Deployment (Bare Metal)

### 1. Create Service User
```bash
sudo useradd -r -s /bin/false -m -d /opt/severino severino
sudo mkdir -p /opt/severino
sudo chown severino:severino /opt/severino
```

### 2. Deploy Application
```bash
# As severino user
cd /opt/severino
git clone <your-repo> .
npm ci --production
npm run build
```

### 3. Environment File
```bash
# /opt/severino/.env
NODE_ENV=production
PORT=3000
HOST=127.0.0.1
LOG_LEVEL=warn

NINEROUTER_API_KEY=sk-xxxx
NINEROUTER_BASE_URL=https://api.9router.com/v1
DEFAULT_MODEL=anthropic/claude-3.5-sonnet

TELEGRAM_BOT_TOKEN=your_token
WHATSAPP_SESSION_PATH=/opt/severino/whatsapp-session

ROOMS_DIR=/opt/severino/rooms
TEMPLATES_DIR=/opt/severino/templates
```

### 4. Systemd Service
```ini
# /etc/systemd/system/severino.service
[Unit]
Description=Severino Master Orchestrator
After=network.target nginx.service
Wants=nginx.service

[Service]
Type=simple
User=severino
Group=severino
WorkingDirectory=/opt/severino
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=severino

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/opt/severino/rooms /opt/severino/grill-sessions /opt/severino/whatsapp-session

# Resource limits
LimitNOFILE=65536
MemoryMax=2G

EnvironmentFile=/opt/severino/.env

[Install]
WantedBy=multi-user.target
```

### 5. Enable & Start
```bash
sudo systemctl daemon-reload
sudo systemctl enable severino
sudo systemctl start severino
sudo systemctl status severino
```

## Environment-Specific Configurations

### Development
```env
NODE_ENV=development
LOG_LEVEL=debug
PORT=3000
HOST=0.0.0.0
```

### Staging
```env
NODE_ENV=staging
LOG_LEVEL=info
PORT=3000
HOST=127.0.0.1
```

### Production
```env
NODE_ENV=production
LOG_LEVEL=warn
PORT=3000
HOST=127.0.0.1
```

## Database (Optional)

For persistent state across restarts, you can add a database layer. The current implementation uses filesystem storage (`rooms/`, `grill-sessions/`).

### PostgreSQL Schema (Future)
```sql
CREATE TABLE teams (
  team_id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255),
  domain VARCHAR(64),
  robot_ids JSONB,
  status VARCHAR(32),
  total_tasks_completed INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE robots (
  robot_id VARCHAR(64) PRIMARY KEY,
  team_id VARCHAR(64) REFERENCES teams(team_id),
  role VARCHAR(64),
  name VARCHAR(255),
  capabilities JSONB,
  status VARCHAR(32),
  room_dir TEXT
);

CREATE TABLE grill_sessions (
  id VARCHAR(64) PRIMARY KEY,
  topic TEXT,
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  status VARCHAR(32),
  summary TEXT,
  insights JSONB,
  action_items JSONB
);
```

## Monitoring

### Health Checks
```bash
# Liveness
curl -f http://localhost:3000/health

# Readiness (checks adapters)
curl -f http://localhost:3000/adapters
```

### Prometheus Metrics (Future)
Add `/metrics` endpoint for Prometheus scraping.

### Log Aggregation
```bash
# Journalctl
journalctl -u severino -f

# Application logs (pino)
tail -f /opt/severino/logs/app.log
```

## Backup Strategy

### Critical Data
```bash
# Daily backup
tar -czf severino-backup-$(date +%Y%m%d).tar.gz \
  /opt/severino/rooms \
  /opt/severino/grill-sessions \
  /opt/severino/whatsapp-session \
  /opt/severino/.env

# Upload to S3/GCS
aws s3 cp severino-backup-*.tar.gz s3://your-bucket/severino-backups/
```

### Restore
```bash
tar -xzf severino-backup-20261010.tar.gz -C /
sudo systemctl restart severino
```

## Scaling

### Horizontal (Multiple Instances)
- Shared `rooms/` and `grill-sessions/` via NFS or object storage
- Redis for session state
- Load balancer with sticky sessions for WebSocket

### Vertical
- Increase `MemoryMax` in systemd
- Tune Node.js: `NODE_OPTIONS="--max-old-space-size=4096"`

## Security Checklist

- [ ] TLS 1.3 enabled on Nginx
- [ ] Firewall: only 80/443 open externally
- [ ] `NINEROUTER_API_KEY` stored in secret manager
- [ ] Telegram/WhatsApp tokens in secret manager
- [ ] Regular dependency updates (`npm audit`)
- [ ] Non-root user (severino)
- [ ] Resource limits configured
- [ ] Audit logging enabled

## Troubleshooting

### Port Already in Use
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### WhatsApp Session Issues
```bash
rm -rf /opt/severino/whatsapp-session
# Restart service, scan QR code again
```

### Memory Leaks
```bash
# Monitor
node --inspect dist/index.js
# Or use clinic.js
clinic doctor -- node dist/index.js
```

### Model Router Errors
```bash
# Check 9router connectivity
curl -H "Authorization: Bearer $NINEROUTER_API_KEY" https://api.9router.com/v1/models
```

## CI/CD Pipeline Example (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy Severino
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: severino
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/severino
            git pull origin main
            npm ci --production
            npm run build
            sudo systemctl restart severino
```

## Rollback Procedure

```bash
# Quick rollback
cd /opt/severino
git log --oneline -5
git checkout <previous-commit>
npm ci --production
npm run build
sudo systemctl restart severino
```

---

For questions, check logs: `journalctl -u severino -n 100 -f`
