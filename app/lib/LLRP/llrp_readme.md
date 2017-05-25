
# LLRP Messages

## Developer Information

On message creation... This needs to be in the readme.

Simply, first octet describe the reserved and version,
next octet describe the message type,
next 4 octets describe the message length (length of the message value, i.e. all parameters),
next 4 octets describe the message ID (this can be left blank unless specifed),
and the next variable amount of octets (described by the message length) describes
the message value

For example, the following is a hex string for: SET_READER_CONFIG:
040300000010000000000000e2000580

- ['04'] => 0000 0100 => Version 1
- ['03'] => 0000 0010 => SET_READER_CONFIG: 3
- ['00000010'] => ... 0001 0000 => Message length => 16 octets
- ['00000000'] => ... => Message ID
- ['0000e2000580'] => Message Value which is:
  - ['00'] => Reserved
  - ['00e2000580'] => ReaderEventNotificationSpecParameter which is:
    - ['00e2'] => This is the reserved bits and the type (226) EventsAndReports
    - ['0005'] => Length => 5 octets
    - ['8'] => HoldEventsAndReportsUponReconnect = true
