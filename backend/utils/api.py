

from app import app 

def api_route(route, **options):
    """Prepend '/api' to all routes."""
    def decorator(func):
        app.route(f'/api{route}', **options)(func)
        return func
    return decorator