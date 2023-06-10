# Crowd-Funding

Crowdfunding is the practice of funding a project or venture by raising small
amounts of money from a large number of people, typically via the Internet.
Crowdfunding is a form of crowdsourcing and alternative finance.

## Run Locally

<hr>
Postman
<br>
<a href="https://documenter.getpostman.com/view/19873401/2s93m8xf94" target="_blank">API Postman Collection</a>
<hr>
Clone the project

```bash
  git clone git@github.com:MohamedSarhan7/Crowd-Funding.git
```
<hr>

### create virtual environment 

### windows 
* create 
```bash
  python -m venv env
```
* activate
```bash
  env\Scripts\activate
```

### ubuntu 
* install venv 
```bash
sudo apt-get install python3-venv

```
* create 
```bash
python3 -m venv env
```
* activate
```bash
  source env/bin/activate
```
<hr>

Go to the project directory

```bash
  cd Crowd-Funding
```

Install dependencies

```bash
  pip install -r requirements.txt
```

create .env file

> :warning:
> **please don't forget to fill the env variables**

```bash
  cp .env.example .env
```

make migrations

```bash
  python manage.py makemigrations customauth
  python manage.py makemigrations api
```

migrate

```bash
  python manage.py migrate
```

Start the server

```bash
  python manage.py runserver
```
