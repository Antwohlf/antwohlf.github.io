#!/usr/bin/env python3
"""Loopback preview with fresh observations every five minutes. Ctrl-C stops both."""
import functools, http.server, threading
from pathlib import Path
from collect_activity import collect
stop=threading.Event()
def refresh():
    while not stop.is_set():
        try: collect()
        except Exception as error: print('Refresh failed: '+type(error).__name__,flush=True)
        stop.wait(300)
class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store');super().end_headers()
if __name__=='__main__':
    thread=threading.Thread(target=refresh,daemon=True);thread.start()
    handler=functools.partial(Handler,directory=str(Path(__file__).resolve().parents[1]))
    server=http.server.ThreadingHTTPServer(('127.0.0.1',8879),handler)
    print('Project Town: http://127.0.0.1:8879/world/ · checks every 5 minutes',flush=True)
    try: server.serve_forever()
    except KeyboardInterrupt: pass
    finally: stop.set();server.server_close()
