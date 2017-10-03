# KeyVision Project (Programmable Visual Keyboard)

## A bit of history
Back in the mid 80s I imagined keyboards with a 32x32 LCD display on each key, a new breed of keyboards not limited to be simple input devices but full fledged IO devices: PVKs (Programmable Visual Keyboards). PVKs where meant to provide visual feedback on the system state by changing the mini displays dynamically, for example, conveying the active font family and style or the available commands through icons, animating keys and naturally portraying any keyboard layout. I designed the PVK electronics and mechanics but the idea remained on paper due to its prohibitive manufacturing cost. Some 10 years later I got in touch with several LCD manufacturers in order to understand if the device had become economically feasible, well, not really, one manufacturer suggested making the whole keyboard a touch screen, my reply was that yes that was an alternative but one of the main objectives of the project was maintaining the keyboard mechanical feel most of us are accustomed to.

Around 2000 Art Lebedev released the wonderfully designed mechanical keyboard [Optimus Maximus keyboard](https://www.artlebedev.com/optimus/maximus/) and in the late 2000 the touch based concept [Optimus Tactus keyboard](https://www.artlebedev.com/optimus/tactus/).

By the way, the name of my one man company is KeyVisions (founded in 1996/01/17), it's genesis stems from the KeyVision project ;).

## A revamp
I've decided to revamp the KeyVision project. While waiting for a breakthrough in haptic technologies, endowing mechanical switch like characteristics to a 19" 18:5 touch screen with a 1920x540 resolution (1/2HD), I'd settle for a tablet or smartphone as keyboard substitutes. No soldering required.

Let's transform a Raspberry PI Zero W into a USB OTG device making it appear as an HID keyboard to the attached host; we'll make the PI run a local node.js web application, at http://localhost, that emulates a touch sensitive, configurable keyboard that sends key press events (touch events really) to the HID interface. We'll configure the PI to start automatically in kiosk mode, thus, if a touch screen (any touch screen) is attached to the PI then we'll have a PVK in our hands—the KeyVision project can be used as the base for any project requiring a keyboard/keypad frontend. Alternatively, by visiting the PI's IP address with a touch device we'll be able to type away on the connected host—do you have a smart TV and are in need of a keyboard?

## Setup
What's required? A [Raspberry PI Zero W](https://www.raspberrypi.org/products/pi-zero-w/) (the W stands for Wi-Fi and Bluetooth), a [Raspian Jessie with Pixel](https://www.raspberrypi.org/downloads/raspbian/) image, a USB OTG cable to be inserted in the micro USB port of the PI on one end and the host on the other.

The project uses HTML, CSS, Javascript, JSON, Node.js, Express and sockets.io.

## Keyboard layout

Key type (1|2|3) (Action|Character|Hybrid)

Work in progress...

## Acknowledgments
The Internet, a neverending source of experiences. The open source community, a wonderful group of brains that share their thoughts in hacks and code.

Work in progress...

## Keywords
keyboard, programmable, visual, wireless, raspberrypi, OTG, HID, node.js, express, sockets.io, kiosk, domotics

// http://www.usb.org/developers/hidpage/Hut1_12v2.pdf (Page 53, Table 12)
// https://docs.mbed.com/docs/ble-hid/en/latest/api/md_doc_HID.html
// http://isticktoit.net/?p=1383


