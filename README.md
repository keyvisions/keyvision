KeyVision Project (Programmable Visual Keyboard)
===

The aim of the project is build a programmable keyboard based on a Raspberry PI Zero configured as a USB Gadget and a touch screen.
The Raspberry PI runs in kiosk mode http://localhost, a Node.js, Express and Sockets.io managed site.

   - Raspberry PI Zero
   - 1920x540 Display (0.5K) 113dpi (looking for a screen manufacturer to build the custom touch screen )
   - Keyboard layouts
   - node.js, express and sockets.io: listen for layout, font, key highlight

Keyboard layout
===

Key type (1|2|3) (Action|Character|Hybrid)

Links
===
[Raspberry PI Zero W](https://www.melopero.com/shop/kits-progetti/raspberry-pi-zero-w/)
[Turn PI into USB gadget](https://cdn-learn.adafruit.com/downloads/pdf/turning-your-raspberry-pi-zero-into-a-usb-gadget.pdf)

TODO
===
Keyboards with one touch at a time
Set keyboard font
Highlight key
Timestamp layout
[gruntfile](https://gruntjs.com/sample-gruntfile)

npm install hid-handler --save
