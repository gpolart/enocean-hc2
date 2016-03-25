# enocean-hc2

Node.js program to use enocean switch on Fibaro HC2

## Installation

It is a quirk and dirty work in progress ...

git clone and then :
```sh
$ npm install
```

## Configuration

Copy config-sample.js to config.js and modify it.

## Run

```sh
$ node enocean_hc2.js
```
## File format

When running, the program will collect information for switch and Enocean equipments and put them in a text file with records like :

```
00258b97-f6-00:
    label: unknown
    actions: {nop: 'something to do'}
    lastseen: 1458920366831
    raw: 55000707017af60000258b972001ffffffff370089
```

You can edit the file to add some action to do on Home Center : for example

```
002954d3-f6-50:
    label: RGBW
    actions: {1: 'deviceID=178&name=turnOn', 2: 'deviceID=178&name=setColor&arg1=20&arg2=0&arg3=10&arg4=10'}
```

