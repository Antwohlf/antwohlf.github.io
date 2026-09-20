# Observed Project Town activity

The town now has source-backed status at building doors, inside rooms and on an activity board. Website checks cover Food Maps, Resume Revamped, DuoCalculator and BuiltHere.City. Public GitHub observations include latest workflow results and open pull-request counts. An optional read-only SSH observation supplies aggregate food-runtime process availability to Food Maps and the Homelab.

Run `python3 world/serve_activity.py` from the repository and open http://127.0.0.1:8879/world/. The loopback server collects every five minutes; the browser reloads the feed every 30 seconds and on return to the tab. Ctrl-C stops the server and refresh loop. `python3 world/collect_activity.py` produces one snapshot without serving.

For the already-configured food host, set `TOWN_FOOD_SSH_HOST` to its SSH alias. If necessary, set `TOWN_FOOD_SSH_ADDRESS` to the existing connection address. These values are never written to the feed. Existing SSH authentication is required; no new credentials or access grants are created. Without that configuration the Homelab remains unobserved.

All observations expire after 15 minutes. A stopped collector therefore stops advertising fresh activity. Feed errors suppress current-state claims while showing the last observations as historical. HTTP success only establishes public-page reachability; a running supervisor is process availability, not proof that every child job is succeeding. Latest workflow results include the event's own timestamp separately from observation time. Private repositories are not queried beyond their visibility metadata; private review titles and commit details are never exported. No home sensor readings, occupancy, travel locations, IPs or process IDs enter the JSON.

Character movement and station demos remain illustrative. Only an observed in-progress workflow drives the extra activity glow; queued, stopping, cancelled, skipped, neutral, and supervisor-available states remain explicit non-active labels. The food pipeline simulator is explicitly labeled as a demo. Side Quests has no connected activity source.

Validation: `node --test world/activity.test.cjs` and `python3 -m unittest discover -s world -p 'test_*.py'`. Browser checks cover building transitions, live source recovery, expired observations, missing-feed failure, real process indicators, and a 390px mobile view.

This isolated branch includes the existing unpublished town and only its referenced image assets. The original working tree's unrelated edits remain untouched. The local preview has live refresh. A plain static deployment serves a dated snapshot and will correctly expire unless a collector republishes it; no recurring cloud automation has been enabled.
