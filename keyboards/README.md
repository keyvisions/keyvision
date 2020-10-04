# Keyboards layout

The keys array id property is the Usage ID, see [Universal Serial Bus (USB)](http://www.usb.org/developers/hidpage/Hut1_12v2.pdf) (Page 53, Table 12)

```
{
  "version": string, (e.g "1.0")
  "timestamp": datetime, (e.g. )
  "description": string, (e.g. "Standard QWERTY US keyboard")
  "language": string, (e.g. "us")
  "error": string, (e.g. "No Pen or Touch Input is available for this Display")
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
