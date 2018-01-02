# The KeyVision Project (Programmable Visual Keyboard)

## A bit of history
Back in the mid 80s I imagined keyboards with a 32x32 LCD display on each key, a new breed of keyboards not limited to be simple input devices but full fledged IO devices: Programmable Visual Keyboards (PVKs). PVKs where meant to provide visual feedback on the system state by changing the mini displays dynamically, for example, conveying the active font family and style or the available commands through icons, animating keys and naturally portraying any keyboard layout. I designed the PVK electronics and mechanics but the idea remained on paper due to its prohibitive manufacturing cost. Some 10 years later I got in touch with several LCD manufacturers in order to understand if the device had become economically feasible, well, not really, one manufacturer suggested making the whole keyboard a touch screen, my reply was that yes that was an alternative but one of the main objectives of the project was maintaining the keyboard mechanical feel most of us are accustomed to.

Around 2000 Art Lebedev released the wonderfully designed mechanical keyboard [Optimus Maximus keyboard](https://www.artlebedev.com/optimus/maximus/) and in the late 2000 the touch based concept [Optimus Tactus keyboard](https://www.artlebedev.com/optimus/tactus/).

By the way, the name of my one man company is KeyVisions (founded in 1996/01/17), it's genesis stems from the KeyVision project ;)

## Setup
I decided to revamp the KeyVision project when I came across the [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/) and the fact it can be transformed into an HID keyboard. If you have a spare Respberry Pi Zero W and would like to transform it into a *keyboard as a service device*, do the following:

1. Download and install the latest [Raspbian with desktop image](https://www.raspberrypi.org/downloads/raspbian/) on a MicroSD,
2. Configure the Zero WiFi, 
3. Configure the Zero as an HID keyboard, see  [Composite USB Gadgets on the Raspberry Pi Zero](http://isticktoit.net/?p=1383),
4. Insert the MicroSD in the Zero and power it up by connecting the USB cable from a host PC to the Zero USB port (not the PWR IN port!),
5. Connect to the Zero via SSH and install [Node.js](https://nodejs.org/en/download/) (you'll have to remove the preinstalled node.js version),
6. Download this project code

At the prompt, change to the project directory and type:

```
$ sudo node keyvision
Running KeyVision on ${hostname}:${port}
```

Pick up your mobile phone or tablet, connect to the same WiFi the Zero is connected to, open up a browser and visit http://${hostname}:${port}, a QWERTY US keyboard should appear, touch its keys, the host PC to which the Zero is connected should receive the key clicks.

(If you'd like a preconfigured MicroSD image drop me a note)

## Kickstarter
This github project is a prof of concept, the aim is to build a real *Programmable Visual Keyboard*. A single prototype can be built for $250, the idea is to make it affordable by industrializing it. Kickstarter offers the opportunity to popolarize the idea and crowd fund it. 

While waiting for a breakthrough in haptic technologies, endowing mechanical switch like characteristics to a 22" multitouch panel with a 1920x540 resolution (1/2HD), I settle for a present day multitouch panel, mounted on a keyboard sized enclosure, driven by a Raspberry Pi Zero W running in kiosk mode configured as a HID keyboard.

## Documentation
- [Universal Serial Bus (USB)](http://www.usb.org/developers/hidpage/Hut1_12v2.pdf) (Page 53, Table 12)
- [The USB HID protocol](https://docs.mbed.com/docs/ble-hid/en/latest/api/md_doc_HID.html)

## Acknowledgments
The Internet, a neverending source of experiences. The open source community, a wonderful group of brains that share their thoughts in hacks and code.
