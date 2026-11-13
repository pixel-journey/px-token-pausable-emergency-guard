# Security notes — pause guard

| Mitigated | Behavior |
| --- | --- |
| Non-admin pause | refused |
| Non-admin/non-msig unpause | refused |
| Transfers while paused | refused |
| admin === msig at create | refused |

Production: real `require_auth`, link auth for msig, optional pause of mint/retire, event logging.
