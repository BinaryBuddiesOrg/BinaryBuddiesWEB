# Odoo Local Setup & Run (Quick README)

## Setup Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install wheel
pip install -r requirements.txt
```

## PostgreSQL User

```bash
sudo -u postgres createuser -s odoo
```

## Config Changes (`odoo.conf`)

```ini
; remove or comment this line
; db_name = nameofdb

list_db = True
admin_passwd = admin
```

## Run Odoo (Local)

```bash
python3 odoo/odoo-bin -c odoo.conf
```

## Run Odoo in Background (Server)

```bash
nohup python3 odoo/odoo-bin -c odoo.conf > odoo.log 2>&1 &
```

## Restart Odoo (Kill + Start)

```bash
pkill -f odoo-bin
nohup python3 odoo/odoo-bin -c odoo.conf > odoo.log 2>&1 &
```

## Logs

```bash
tail -f odoo.log
```
