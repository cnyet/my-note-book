import logging
import json
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class StructuredLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        log_data = {
            "method": request.method,
            "url": str(request.url),
            "status_code": response.status_code,
            "duration": f"{process_time:.4f}s",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }

        print(json.dumps(log_data))
        return response


def setup_logging():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("work-agents")
    return logger
