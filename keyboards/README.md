# Keyboards layout


```
{
  "version": string, (e.g "1.0")
  "timestamp": datetime, (e.g. )
  "description": string, (e.g. "Standard QWERTY US keyboard")
  "language": string, (e.g. "us")
  "size": { "rows": float, "cols": float }, (e.g. 6.25)
  "keys": [
    { "type": int, "id": int, "dx": float, "dy": float, "labels": [string, string, string, string] },
    { "id": 58, "dx": 1, "labels": ["F1"] },
    { "id": 59, "labels": ["F2"] },
    { "id": 60, "labels": ["F3"] },
    { "id": 61, "labels": ["F4"] },
    ...
  ]
}
```
