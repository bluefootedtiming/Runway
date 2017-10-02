/**
  * @fileOverview Defines constants used integral to decoding llrp parameters.
  *
  * This file was created at Openovate Labs.
  *
  * @author Jeriel Mari E. Lopez <jerielmari@gmail.com>
  *
  * Edited by Oak.Works
  */

/* eslint-disable max-len */

// General Parameters
export const UTCTimeStamp = { id: 128, hasSubParameter: false, tvLength: 0, staticLength: 12 };
export const Uptime = { id: 129, hasSubParameter: false, tvLength: 0, staticLength: 12 };
// Reader Device Capabilities Parameters
export const GeneralDeviceCapabilities = { id: 137, hasSubParameter: true, tvLength: 0, staticLength: 18 };
export const ReceiveSensitivityTableEntry = { id: 139, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const PerAntennaAirProtocol = { id: 140, hasSubParameter: false, tvLength: 0, staticLength: 12 };
export const GPIOCapabilities = { id: 141, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const LLRPCapabilities = { id: 142, hasSubParameter: false, tvLength: 0, staticLength: 32 };
export const RegulatoryCapabilities = { id: 143, hasSubParameter: true, tvLength: 0, staticLength: 8 };
export const UHFBandCapabilities = { id: 144, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const TransmitPowerLevelTableEntry = { id: 145, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const FrequencyInformation = { id: 146, hasSubParameter: true, tvLength: 0, staticLength: 5 };
export const FrequencyHopTable = { id: 147, hasSubParameter: false, tvLength: 0, staticLength: 8 }; // Variable number of frequencies 1-n
export const FixedFrequencyTable = { id: 148, hasSubParameter: false, tvLength: 0, staticLength: 6 }; // Variable number of frequencies 1-n
export const PerAntennaReceiveSensitivityRange = { id: 149, hasSubParameter: false, tvLength: 0, staticLength: 10 };
// Reader Operations Parameters
export const ROSpec = { id: 177, hasSubParameter: true, tvLength: 0, staticLength: 10 };
export const ROBoundarySpec = { id: 178, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const ROSpecStartTrigger = { id: 179, hasSubParameter: true, tvLength: 0, staticLength: 5 };
export const PeriodicTriggerValue = { id: 180, hasSubParameter: true, tvLength: 0, staticLength: 12 };
export const GPITriggerValue = { id: 181, hasSubParameter: false, tvLength: 0, staticLength: 11 };
export const ROSpecStopTrigger = { id: 182, hasSubParameter: true, tvLength: 0, staticLength: 9 };
export const AISpec = { id: 183, hasSubParameter: true, tvLength: 0, staticLength: 6 };
export const AISpecStopTrigger = { id: 184, hasSubParameter: true, tvLength: 0, staticLength: 9 };
export const TagObservationTrigger = { id: 185, hasSubParameter: false, tvLength: 0, staticLength: 16 };
export const InventoryParameterSpec = { id: 186, hasSubParameter: true, tvLength: 0, staticLength: 7 };
export const RFSurveySpec = { id: 187, hasSubParameter: true, tvLength: 0, staticLength: 14 };
export const RFSurveySpecStopTrigger = { id: 188, hasSubParameter: false, tvLength: 0, staticLength: 13 };
export const LoopSpec = { id: 355, hasSubParameter: false, tvLength: 0, staticLength: 32 };
// Access Operation Parameters
export const AccessSpec = { id: 207, hasSubParameter: true, tvLength: 0, staticLength: 16 };
export const AccessSpecStopTrigger = { id: 208, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const AccessCommand = { id: 209, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const ClientRequestOpSpec = { id: 210, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const ClientRequestResponse = { id: 211, hasSubParameter: true, tvLength: 0, staticLength: 8 };
// Configuration Parameters
export const LLRPConfigurationStateValue = { id: 217, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const Identification = { id: 218, hasSubParameter: false, tvLength: 0, staticLength: 7 }; // variable length ReaderID
export const GPOWriteData = { id: 219, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const KeepaliveSpec = { id: 220, hasSubParameter: false, tvLength: 0, staticLength: 9 };
export const AntennaProperties = { id: 221, hasSubParameter: false, tvLength: 0, staticLength: 9 };
export const AntennaConfiguration = { id: 222, hasSubParameter: true, tvLength: 0, staticLength: 6 };
export const RFReceiver = { id: 223, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const RFTransmitter = { id: 224, hasSubParameter: false, tvLength: 0, staticLength: 10 };
export const GPIPortCurrentState = { id: 225, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const EventsAndReports = { id: 226, hasSubParameter: false, tvLength: 0, staticLength: 5 };
// Reporting Parameters
export const ROReportSpec = { id: 237, hasSubParameter: true, tvLength: 0, staticLength: 7 };
export const TagReportContentSelector = { id: 238, hasSubParameter: true, tvLength: 0, staticLength: 6 };
export const AccessReportSpec = { id: 239, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const TagReportData = { id: 240, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const EPCData = { id: 241, hasSubParameter: false, tvLength: 0, staticLength: 6 }; // variable length EPC
export const EPC96 = { id: 13, hasSubParameter: false, tvLength: 13, staticLength: 13 };
export const ROSpecID = { id: 9, hasSubParameter: false, tvLength: 5, staticLength: 5 };
export const SpecIndex = { id: 14, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const InventoryParameterSpecID = { id: 10, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const AntennaID = { id: 1, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const PeakRSSI = { id: 6, hasSubParameter: false, tvLength: 2, staticLength: 2 };
export const ChannelIndex = { id: 7, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const FirstSeenTimestampUTC = { id: 2, hasSubParameter: false, tvLength: 9, staticLength: 9 };
export const FirstSeenTimestampUptime = { id: 3, hasSubParameter: false, tvLength: 9, staticLength: 9 };
export const LastSeenTimestampUTC = { id: 4, hasSubParameter: false, tvLength: 9, staticLength: 9 };
export const LastSeenTimestampUptime = { id: 5, hasSubParameter: false, tvLength: 9, staticLength: 9 };
export const TagSeenCount = { id: 8, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const ClientRequestOpSpecResult = { id: 15, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const AccessSpecID = { id: 16, hasSubParameter: false, tvLength: 5, staticLength: 5 };
export const RFSurveyReportData = { id: 242, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const FrequencyRSSILevelEntry = { id: 243, hasSubParameter: true, tvLength: 0, staticLength: 14 };
export const ReaderEventNotificationSpec = { id: 244, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const EventNotificationState = { id: 245, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const ReaderEventNotificationData = { id: 246, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const HoppingEvent = { id: 247, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const GPIEvent = { id: 248, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const ROSpecEvent = { id: 249, hasSubParameter: false, tvLength: 0, staticLength: 13 }; // PreemptingROSpecID is ignored if EventType != 2
export const ReportBufferLevelWarningEvent = { id: 250, hasSubParameter: false, tvLength: 0, staticLength: 5 };
export const ReportBufferOverflowErrorEvent = { id: 251, hasSubParameter: false, tvLength: 0, staticLength: 4 };
export const ReaderExceptionEvent = { id: 252, hasSubParameter: true, tvLength: 0, staticLength: 6 }; // variable length UTF8 Message
export const OpSpecID = { id: 17, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const RFSurveyEvent = { id: 253, hasSubParameter: false, tvLength: 0, staticLength: 11 };
export const AISpecEvent = { id: 254, hasSubParameter: true, tvLength: 0, staticLength: 11 };
export const AntennaEvent = { id: 255, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const ConnectionAttemptEvent = { id: 256, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const ConnectionCloseEvent = { id: 257, hasSubParameter: false, tvLength: 0, staticLength: 4 };
// LLRP Error Parameters
export const LLRPStatus = { id: 287, hasSubParameter: false, tvLength: 0, staticLength: 8 }; // variable length UTF8 ErrorDescription
export const FieldError = { id: 288, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const ParameterError = { id: 289, hasSubParameter: true, tvLength: 0, staticLength: 8 };
export const Custom = { id: 1023, hasSubParameter: false, tvLength: 0, staticLength: 12 }; // VendorParameter Vendor specific value
// Air Protocol Specific Parameters
// Class-1 Generation-2 (C1GstaticLength: 2} Protocol Parameters
// Capabilities Parameters
export const C1G2LLRPCapabilities = { id: 327, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const UHFC1G2RFModeTable = { id: 328, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const UHFC1G2RFModeTableEntry = { id: 329, hasSubParameter: false, tvLength: 0, staticLength: 32 };
// Reader Operations Parameters
export const C1G2InventoryCommand = { id: 330, hasSubParameter: true, tvLength: 0, staticLength: 5 };
export const C1G2Filter = { id: 331, hasSubParameter: true, tvLength: 0, staticLength: 5 };
export const C1G2TagInventoryMask = { id: 332, hasSubParameter: false, tvLength: 0, staticLength: 9 }; // Variable length bit count TagMask
export const C1G2TagInventoryStateAwareFilterAction = { id: 333, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const C1G2TagInventoryStateUnawareFilterAction = { id: 334, hasSubParameter: false, tvLength: 0, staticLength: 5 };
export const C1G2RFControl = { id: 335, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const C1G2SingulationControl = { id: 336, hasSubParameter: true, tvLength: 0, staticLength: 11 };
export const C1G2TagInventoryStateAwareSingulationAction = { id: 337, hasSubParameter: false, tvLength: 0, staticLength: 5 };
// Access Operation Parameters
export const C1G2TagSpec = { id: 338, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const C1G2TargetTag = { id: 339, hasSubParameter: false, tvLength: 0, staticLength: 9 }; // Variable length bit count TagMask, plus 16 bit DataBitCount and ariable length bit count TagData
// C1G2 OpSpecs
export const C1G2Read = { id: 341, hasSubParameter: false, tvLength: 0, staticLength: 15 };
export const C1G2Write = { id: 342, hasSubParameter: false, tvLength: 0, staticLength: 15 }; // Variable length word count WriteData
export const C1G2Kill = { id: 343, hasSubParameter: false, tvLength: 0, staticLength: 10 };
export const C1G2Lock = { id: 344, hasSubParameter: true, tvLength: 0, staticLength: 10 };
export const C1G2LockPayload = { id: 345, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const C1G2BlockErase = { id: 346, hasSubParameter: false, tvLength: 0, staticLength: 15 };
export const C1G2BlockWrite = { id: 347, hasSubParameter: false, tvLength: 0, staticLength: 15 }; // Variable length word count WriteData
// Reporting Parameters
export const C1G2EPCMemorySelector = { id: 348, hasSubParameter: false, tvLength: 0, staticLength: 5 };
export const C1G2PC = { id: 12, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const C1G2CRC = { id: 11, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const C1G2SingulationDetails = { id: 18, hasSubParameter: false, tvLength: 5, staticLength: 5 };
// C1G2 OpSpec Results
export const C1G2ReadOpSpecResult = { id: 349, hasSubParameter: false, tvLength: 0, staticLength: 9 }; // Variable word count ReadData
export const C1G2WriteOpSpecResult = { id: 350, hasSubParameter: false, tvLength: 0, staticLength: 9 };
export const C1G2KillOpSpecResult = { id: 351, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const C1G2LockOpSpecResult = { id: 352, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const C1G2BlockEraseOpSpecResult = { id: 353, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const C1G2BlockWriteOpSpecResult = { id: 354, hasSubParameter: false, tvLength: 0, staticLength: 9 };
