# Security notes

| Issue | Lab mitigation |
|-------|----------------|
| Anyone pauses | admin-only pause |
| Single-key unpause deadlock | msig may unpause |
| Transfers during incident | `transferGate` refuses when paused |

Production still needs real `require_auth`, table storage, and careful definition of which actions pause covers (transfer only vs issue/retire).
