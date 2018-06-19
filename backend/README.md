# Developing a REST API with Flask and Flask-RESTful

The goal is to create a simple REST API that calls on a neural network on request. This project works with Python 3.6. 

### Setup

Recommended to work in virtualenv:

```
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
```

Run the following commands to set up the dependencies:

```
pip install flask flask-restful flask-cors numpy scipy matplotlib ipython jupyter pandas sympy nose torch torchvision
```

Or alternatively:

```
pip install -r requirements.txt
```

### Deployment

Server can be started with:

```
python start.py
```

### Structure

* **config.py -** contains specific configuration values.
* **domain -** contains domain logic of the application.
* **common -** contains third party setups.
* **api -** defines api urls.
* **api/resources -** defines the api endpoints.
* **api/resources/business_logic -** defines specific action for each api call, pertaining to business logic and not necessary domain logic.
