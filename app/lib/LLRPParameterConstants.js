/**
  * @fileOverview Defines constants used integral to decoding llrp parameters.
  *
  * This file was created at Openovate Labs.
  *
  * @author Jeriel Mari E. Lopez <jerielmari@gmail.com>
  *
  * Edited by Oak.Works
  */

/* eslint-disable max-len*/

// General Parameters
export const UTCTimeStamp = { type: 128, hasSubParameter: false, tvLength: 0, staticLength: 12 };
export const Uptime = { type: 129, hasSubParameter: false, tvLength: 0, staticLength: 12 };
// Reader Device Capabilities Parameters
export const GeneralDeviceCapabilities = { type: 137, hasSubParameter: true, tvLength: 0, staticLength: 18 };
export const ReceiveSensitivityTableEntry = { type: 139, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const PerAntennaAirProtocol = { type: 140, hasSubParameter: false, tvLength: 0, staticLength: 12 };
export const GPIOCapabilities = { type: 141, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const LLRPCapabilities = { type: 142, hasSubParameter: false, tvLength: 0, staticLength: 32 };
export const RegulatoryCapabilities = { type: 143, hasSubParameter: true, tvLength: 0, staticLength: 8 };
export const UHFBandCapabilities = { type: 144, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const TransmitPowerLevelTableEntry = { type: 145, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const FrequencyInformation = { type: 146, hasSubParameter: true, tvLength: 0, staticLength: 5 };
export const FrequencyHopTable = { type: 147, hasSubParameter: false, tvLength: 0, staticLength: 8 }; // Variable number of frequencies 1-n
export const FixedFrequencyTable = { type: 148, hasSubParameter: false, tvLength: 0, staticLength: 6 }; // Variable number of frequencies 1-n
export const PerAntennaReceiveSensitivityRange = { type: 149, hasSubParameter: false, tvLength: 0, staticLength: 10 };
// Reader Operations Parameters
export const ROSpec = { type: 177, hasSubParameter: true, tvLength: 0, staticLength: 10 };
export const ROBoundarySpec = { type: 178, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const ROSpecStartTrigger = { type: 179, hasSubParameter: true, tvLength: 0, staticLength: 5 };
export const PeriodicTriggerValue = { type: 180, hasSubParameter: true, tvLength: 0, staticLength: 12 };
export const GPITriggerValue = { type: 181, hasSubParameter: false, tvLength: 0, staticLength: 11 };
export const ROSpecStopTrigger = { type: 182, hasSubParameter: true, tvLength: 0, staticLength: 9 };
export const AISpec = { type: 183, hasSubParameter: true, tvLength: 0, staticLength: 6 };
export const AISpecStopTrigger = { type: 184, hasSubParameter: true, tvLength: 0, staticLength: 9 };
export const TagObservationTrigger = { type: 185, hasSubParameter: false, tvLength: 0, staticLength: 16 };
export const InventoryParameterSpec = { type: 186, hasSubParameter: true, tvLength: 0, staticLength: 7 };
export const RFSurveySpec = { type: 187, hasSubParameter: true, tvLength: 0, staticLength: 14 };
export const RFSurveySpecStopTrigger = { type: 188, hasSubParameter: false, tvLength: 0, staticLength: 13 };
export const LoopSpec = { type: 355, hasSubParameter: false, tvLength: 0, staticLength: 32 };
// Access Operation Parameters
export const AccessSpec = { type: 207, hasSubParameter: true, tvLength: 0, staticLength: 16 };
export const AccessSpecStopTrigger = { type: 208, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const AccessCommand = { type: 209, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const ClientRequestOpSpec = { type: 210, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const ClientRequestResponse = { type: 211, hasSubParameter: true, tvLength: 0, staticLength: 8 };
// Configuration Parameters
export const LLRPConfigurationStateValue = { type: 217, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const Identification = { type: 218, hasSubParameter: false, tvLength: 0, staticLength: 7 }; // variable length ReaderID
export const GPOWriteData = { type: 219, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const KeepaliveSpec = { type: 220, hasSubParameter: false, tvLength: 0, staticLength: 9 };
export const AntennaProperties = { type: 221, hasSubParameter: false, tvLength: 0, staticLength: 9 };
export const AntennaConfiguration = { type: 222, hasSubParameter: true, tvLength: 0, staticLength: 6 };
export const RFReceiver = { type: 223, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const RFTransmitter = { type: 224, hasSubParameter: false, tvLength: 0, staticLength: 10 };
export const GPIPortCurrentState = { type: 225, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const EventsAndReports = { type: 226, hasSubParameter: false, tvLength: 0, staticLength: 5 };
// Reporting Parameters
export const ROReportSpec = { type: 237, hasSubParameter: true, tvLength: 0, staticLength: 7 };
export const TagReportContentSelector = { type: 238, hasSubParameter: true, tvLength: 0, staticLength: 6 };
export const AccessReportSpec = { type: 239, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const TagReportData = { type: 240, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const EPCData = { type: 241, hasSubParameter: false, tvLength: 0, staticLength: 6 }; // variable length EPC
export const EPC96 = { type: 13, hasSubParameter: false, tvLength: 13, staticLength: 13 };
export const ROSpecID = { type: 9, hasSubParameter: false, tvLength: 5, staticLength: 5 };
export const SpecIndex = { type: 14, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const InventoryParameterSpecID = { type: 10, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const AntennaID = { type: 1, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const PeakRSSI = { type: 6, hasSubParameter: false, tvLength: 2, staticLength: 2 };
export const ChannelIndex = { type: 7, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const FirstSeenTimestampUTC = { type: 2, hasSubParameter: false, tvLength: 9, staticLength: 9 };
export const FirstSeenTimestampUptime = { type: 3, hasSubParameter: false, tvLength: 9, staticLength: 9 };
export const LastSeenTimestampUTC = { type: 4, hasSubParameter: false, tvLength: 9, staticLength: 9 };
export const LastSeenTimestampUptime = { type: 5, hasSubParameter: false, tvLength: 9, staticLength: 9 };
export const TagSeenCount = { type: 8, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const ClientRequestOpSpecResult = { type: 15, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const AccessSpecID = { type: 16, hasSubParameter: false, tvLength: 5, staticLength: 5 };
export const RFSurveyReportData = { type: 242, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const FrequencyRSSILevelEntry = { type: 243, hasSubParameter: true, tvLength: 0, staticLength: 14 };
export const ReaderEventNotificationSpec = { type: 244, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const EventNotificationState = { type: 245, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const ReaderEventNotificationData = { type: 246, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const HoppingEvent = { type: 247, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const GPIEvent = { type: 248, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const ROSpecEvent = { type: 249, hasSubParameter: false, tvLength: 0, staticLength: 13 }; // PreemptingROSpecID is ignored if EventType != 2
export const ReportBufferLevelWarningEvent = { type: 250, hasSubParameter: false, tvLength: 0, staticLength: 5 };
export const ReportBufferOverflowErrorEvent = { type: 251, hasSubParameter: false, tvLength: 0, staticLength: 4 };
export const ReaderExceptionEvent = { type: 252, hasSubParameter: true, tvLength: 0, staticLength: 6 }; // variable length UTF8 Message
export const OpSpecID = { type: 17, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const RFSurveyEvent = { type: 253, hasSubParameter: false, tvLength: 0, staticLength: 11 };
export const AISpecEvent = { type: 254, hasSubParameter: true, tvLength: 0, staticLength: 11 };
export const AntennaEvent = { type: 255, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const ConnectionAttemptEvent = { type: 256, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const ConnectionCloseEvent = { type: 257, hasSubParameter: false, tvLength: 0, staticLength: 4 };
// LLRP Error Parameters
export const LLRPStatus = { type: 287, hasSubParameter: false, tvLength: 0, staticLength: 8 }; // variable length UTF8 ErrorDescription
export const FieldError = { type: 288, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const ParameterError = { type: 289, hasSubParameter: true, tvLength: 0, staticLength: 8 };
export const Custom = { type: 1023, hasSubParameter: false, tvLength: 0, staticLength: 12 }; // VendorParameter Vendor specific value
// Air Protocol Specific Parameters
// Class-1 Generation-2 (C1GstaticLength: 2} Protocol Parameters
// Capabilities Parameters
export const C1G2LLRPCapabilities = { type: 327, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const UHFC1G2RFModeTable = { type: 328, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const UHFC1G2RFModeTableEntry = { type: 329, hasSubParameter: false, tvLength: 0, staticLength: 32 };
// Reader Operations Parameters
export const C1G2InventoryCommand = { type: 330, hasSubParameter: true, tvLength: 0, staticLength: 5 };
export const C1G2Filter = { type: 331, hasSubParameter: true, tvLength: 0, staticLength: 5 };
export const C1G2TagInventoryMask = { type: 332, hasSubParameter: false, tvLength: 0, staticLength: 9 }; // Variable length bit count TagMask
export const C1G2TagInventoryStateAwareFilterAction = { type: 333, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const C1G2TagInventoryStateUnawareFilterAction = { type: 334, hasSubParameter: false, tvLength: 0, staticLength: 5 };
export const C1G2RFControl = { type: 335, hasSubParameter: false, tvLength: 0, staticLength: 8 };
export const C1G2SingulationControl = { type: 336, hasSubParameter: true, tvLength: 0, staticLength: 11 };
export const C1G2TagInventoryStateAwareSingulationAction = { type: 337, hasSubParameter: false, tvLength: 0, staticLength: 5 };
// Access Operation Parameters
export const C1G2TagSpec = { type: 338, hasSubParameter: true, tvLength: 0, staticLength: 4 };
export const C1G2TargetTag = { type: 339, hasSubParameter: false, tvLength: 0, staticLength: 9 }; // Variable length bit count TagMask, plus 16 bit DataBitCount and ariable length bit count TagData
// C1G2 OpSpecs
export const C1G2Read = { type: 341, hasSubParameter: false, tvLength: 0, staticLength: 15 };
export const C1G2Write = { type: 342, hasSubParameter: false, tvLength: 0, staticLength: 15 }; // Variable length word count WriteData
export const C1G2Kill = { type: 343, hasSubParameter: false, tvLength: 0, staticLength: 10 };
export const C1G2Lock = { type: 344, hasSubParameter: true, tvLength: 0, staticLength: 10 };
export const C1G2LockPayload = { type: 345, hasSubParameter: false, tvLength: 0, staticLength: 6 };
export const C1G2BlockErase = { type: 346, hasSubParameter: false, tvLength: 0, staticLength: 15 };
export const C1G2BlockWrite = { type: 347, hasSubParameter: false, tvLength: 0, staticLength: 15 }; // Variable length word count WriteData
// Reporting Parameters
export const C1G2EPCMemorySelector = { type: 348, hasSubParameter: false, tvLength: 0, staticLength: 5 };
export const C1G2PC = { type: 12, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const C1G2CRC = { type: 11, hasSubParameter: false, tvLength: 3, staticLength: 3 };
export const C1G2SingulationDetails = { type: 18, hasSubParameter: false, tvLength: 5, staticLength: 5 };
// C1G2 OpSpec Results
export const C1G2ReadOpSpecResult = { type: 349, hasSubParameter: false, tvLength: 0, staticLength: 9 }; // Variable word count ReadData
export const C1G2WriteOpSpecResult = { type: 350, hasSubParameter: false, tvLength: 0, staticLength: 9 };
export const C1G2KillOpSpecResult = { type: 351, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const C1G2LockOpSpecResult = { type: 352, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const C1G2BlockEraseOpSpecResult = { type: 353, hasSubParameter: false, tvLength: 0, staticLength: 7 };
export const C1G2BlockWriteOpSpecResult = { type: 354, hasSubParameter: false, tvLength: 0, staticLength: 9 };
