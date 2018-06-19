"""A script to start the Flask server.

Running this module will start up a Flask REST API server.

Author: Teekayu Klongtruajrok
"""
import multiprocessing
import gunicorn.app.base
from gunicorn.six import iteritems
from api import app


class StandaloneApplication(gunicorn.app.base.BaseApplication):

    def __init__(self, app, options=None):
        self.options = options or {}
        self.application = app
        super(StandaloneApplication, self).__init__()

    def load_config(self):
        config = dict([(key, value) for key, value in iteritems(self.options)
                       if key in self.cfg.settings and value is not None])
        for key, value in iteritems(config):
            self.cfg.set(key.lower(), value)

    def load(self):
        return self.application


if __name__ == '__main__':
    options = {
        'bind': '%s:%s' % ('127.0.0.1', '5000'),
        'reload': True,
        'reload_engine': 'auto',
        'workers': (multiprocessing.cpu_count() * 2) + 1,
        'worker_class': 'gevent',
        'worker_connections': 2000,
        'backlog': 1000,
        'proc_name': 'design-rec-demo-backend',
        'pidfile': 'gunicorn.pd',
        'loglevel': 'info'
    }
    StandaloneApplication(app, options).run()
