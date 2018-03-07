# AlienRunway

![Imgur](http://i.imgur.com/CYv4KKlm.png)
## Introduction

AlienRunway is a middleware application that connects Alien RFID Readers to RunScore Server. When RFID readers send Bib tag information, AlienRunway inserts the time since start and forwards the message to RunScore. Backup CSVs are created by AlienRunway for each RFID Location in case the connection to RunScore is unavailable. 

AlienRunway is built with [Electron](https://electronjs.org) and [React](https://reactjs.org/), which allows it to be used on Windows (newer than XP), OSX, and more!
## QuickStart

1. Go to [releases](https://github.com/oakworks/AlienRunway/releases) 
1. Download & install either the Windows-32bit exe or the `.dmg`
1. Run the application
1. Click on the wrench icon (Configurations)
1. Set the RunScore Server address and port
1. Set the AlienRunway Listen Server address and port
1. Hit "Save"
1. Optionally, set all Reader Addresses and "Events" in the RFID Location fields and use the "Sync Readers"
1. Hit the "Start" button on the timer
1. RFID traffic is now sent to RunScore!

# Feature Overview

Here is a list of operations that AlienRunway is capable of.

1. Start an RFID Listener Server from an available address on the host computer
1. Map RFID Readers by IP Address to specific “events” or “locations” like Start, Finish, Swim, Bike, etc
1. Add/Delete “Events”
1. Synchronize RFID Reader configurations across mapped readers to ensure accurate data is being received by Alien Runway
1. Connect to a RunScore Server via a specified address & port
1. View status messages from RFID Listener & RunScore Servers
1. Start/Stop an editable timer
1. Save all data sent by Readers to CSVs

## Supported Software/Hardware

AlienRunway is able to be built for any modern OS that electron is able to be built on (Win 32bit, Win 64bit, Mac OS, and Linux).

RunScore Server currently only runs on Windows. Meaning if you're running AlienRunway on anything besides Windows, you will need an instance of Windows in order to run RunScore server.

The RFID Reader we use during development as well as support for reader specific functions, such as "Sync Readers", is the ALR-9650. Alien Readers that are also supported are: ALR-9900, ALR-9800, and ALR-8800.

*For more information on Alien Technology see [Alien Technology](http://www.alientechnology.com/)*

## Connecting to RunScore

![Imgur](http://i.imgur.com/ItqKdvRm.png)

On the initial start of the application, the app will attempt to connect to either the default RunScore Server address and port (192.168.1.4 : 3988) or the previously saved address and port.

To set the address and port for the RunScore Server, click on the wrench icon —Configuration Button — and edit the input fields underneath the ‘RunScore” label. After setting them to the desired value, hit “Save Configurations”.

All configurations saved will be available and used upon restart. The config file can be found in the documents folder (“User/My Documents” on Windows, “User/Documents” on OSX) under the folder named “Alien Runway Data” with a file named “config.json”.

```
/<USER>/<Documents>/'Alien Runway Data'/config.json
```

Alien Runway will stop attempting to reconnect after 5 connection attempts. After 5 attempts, the server can be manually reconnected by pressing the lightning button — RunScore Connection Status Button — on the far left of the toolbar. 

Upon successful connection, the message “Connected to RunScore!” will appear in the message log. The connection status button will be green while connected/red while disconnected.


## Configuring the Alien Runway (RFID Listen Server)

![Imgur](http://i.imgur.com/91ePho2m.png)

Upon startup, the RFID Listen Server initializes on the either the default RFID Listen Server address and port (192.168.1.5 : 3900) or the previously saved address and port.

To configure the address and port for the RFID Listener, go to the configuration panel and change the values under “Alien Runway”. The first field, address field, is a select dropdown that will automatically fill with available iPv4 addresses found on the host computer.

Once changes have been made, the RFID Listener server will need to be reset in order for the changes to take affect. To do this, use the Restart Alien Runway RFID Listener (refresh icon) next to the RunScore Server Connection Status button(lightning icon). 

## Configuring the RFID Locations (In Alien Runway)

The RFID Locations section of the configuration maps the Alien RFID Readers to the specified “Event/Location”. These Events are used to categorize times in RunScore.

Hitting the “+” icon next to the title will input a new field to add a reader’s address and set the event. Hitting “-” next to an reader will remove it from the list.

Events can be added via the “Edit Events” button at the bottom of the configurations panel. This will take the user to a list of all available events to choose from. This list can be edited and all edits will be saved upon using the “Save Configurations” button on the configuration panel. Hit “Back to Config” to return to the configuration panel.

## Syncing The RFID Readers

In the configuration panel, at the bottom right of the panel is the “Sync Readers” button. Using this button will initiate a connection to each saved reader in the map and send a set of commands that will ensure that a) the reader will send the TagStream to the Alien Runway RFID Listen Server and b) the TagStreamFormat is the correct. 

Upon completion of the sync, there will be a notification sent to the user through the native OS. Should any errors occur, a notification will be sent to the native OS as well as be logged in the status log — the triple line icon next to the wrench icon.

## Configuring Readers Manually

Readers can be set to send information to Alien Runway anonymously—i.e., without being preset in Alien Runway. To do this correctly, here are stipulations that need to be followed in order for Alien Runway to correctly interpret the stream:


1. The beginning of the stream needs to begin with ‘RSBI’
2. The stream must have its data comma separated
3. The reader’s name must be fourth item in the stream

An example stream is as follows:

```
RSBI,0542,13:20:02.12,FINISH
```

## Starting the Race

![Imgur](http://i.imgur.com/1Xn7peCm.png)

When you’re ready to start the race hit the large green “Start” button. This will begin Alien Runway’s timer and allow for RFID Reader’s tag stream to be sent along to RunScore and/or logged into the backup CSV files.

An offset for the timer can be set by entering the hours, minutes, and/or seconds into the timer’s fields.

The TagStream format that RunScore Server accepts is as follows:

```
RSBI,<BIB>,<ELASPED_TIME>,<EVENT> 
```

Backup CSV files can be viewed by navigating to your “My Documents/Documents” folder on your OS, under the folder “Alien Runway Data”. The backup CSV folder structure is as follows:

```
/<USER>/<Documents>/'Alien Runway Data'/<YYYYMMDDhhmmss>/<EVENT>.csv
```

The time portion of the path is the “start time” of the race. This is the timestamp of the moment the “Start” button of the timer was pressed, modified by the offset.

The CSV row format of the backups are as follows:


```
RSBI,<BIB>,<ELASPED_TIME>,<EVENT>,<ALIEN_READER_TIME>
```

The “alien reader time” is appended to the end of the row, however this data isn’t sent to RunScore. If this column is removed, then the file can be imported to RunScore.

# Developer Info

Use the following commands to get started:

```bash
git clone git@github.com:oakworks/AlienRunway.git
cd AlienRunway
npm install
npm run dev
```

To build for Mac OS, use:

```
yarn run package
```

To build for Win32bit, use:

```
# If building on Mac for Windows, run these commands (after installing [Homebrew](https://brew.sh/) if needed):
brew cask install xquartz
brew install wine gnu-tar

# For everyone:
yarn run package-win32
```

Once built, they can be found under `release/`

*This project was originally forked from [Electron React Boilerplate](https://github.com/chentsulin/electron-react-boilerplate).*

*Runway was created for BlueFootedtiming by [Oak.Works](https://oak.works)*
