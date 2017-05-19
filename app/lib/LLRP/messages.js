import * as MSG_CONST from './messageConstants';
import * as PRM_CONST from './parameterConstants';
import { createLLRPMessage, createTLVParam, fill } from './encode';

/**
  * binToHex
  *
  * Take an array of binary numbers and converts to hex.
  * The length must be evenly divisble by 4 (4 bits = 1 hex)
  *
  * @param {Array<number>} bin
  *
  * @return {string}
  */
const binToHex = (bin: Array<number>) => (bin.length % 4 === 0 && parseInt(bin.join(''), 2).toString(16));

// Temporary constants to fill unused parameters
const HEX_CONST = {
  OCTET: '00',
  TWO_OCTETS: '00'.repeat(2),
  FOUR_OCTETS: '00'.repeat(4)
};

const ROSPEC_ID = '00000099';

export const addROSpec = () => {
  const roBoundarySpec = {
    type: PRM_CONST.ROBoundarySpec,
    values: [
      {/* ROSpecStartTrigger */
        type: PRM_CONST.ROSpecStartTrigger,
        values: [
          HEX_CONST.OCTET,    /* ROSpecStartTriggerType = 0 => null */
          // '',   /* PeriodicTriggerValue, optional/not necessary */
          // '',   /* GPITriggerValue, optional/not necessary */
        ]
      },
      {/* ROSpecStopTrigger */
        type: PRM_CONST.ROSpecStopTrigger,
        values: [
          HEX_CONST.OCTET,   /* ROSpecStopTriggerType = 0 => null (? may need to change to Dur) */
          HEX_CONST.FOUR_OCTETS,   /* DurationTriggerValue, optional/not necessary */
          // '',   /* GPITriggerValue, optional/not necessary */
        ]
      }
    ]
  };

  const aiSpec = {
    type: PRM_CONST.AISpec,
    values: [
      '0001', /* AntennaCount */
      HEX_CONST.TWO_OCTETS, /* AntennaID#[1-n], if 0, use all*/
      {/* AISpecStopTrigger */
        type: PRM_CONST.AISpecStopTrigger,
        values: [
          '01', /* AISpecStopTriggerType = 1 => TagObservationTrigger*/
          `${fill(8, '3e8')}3e8`, /* DurationTrigger, not used */
        ]
      },
      {/* InventoryParameterSpec */
        type: PRM_CONST.InventoryParameterSpec,
        values: [
          '0001', /* InventoryParameterSpecID */
          '01',   /* ProtocolID */
          '', /* AntennaConfiguration Parameter, optional */
          ''  /* Custom Parameter, optional */
        ]
      }
    ]
  };

  const roReportSpec = {
    type: PRM_CONST.ROReportSpec,
    values: [
      '01', /* ROReportTrigger = 1 => Upon N TagReportData Parameters or End of AISpec */
      HEX_CONST.TWO_OCTETS, /* N = 0 (unlimited) */
      {/* ReportContents = TagReportContentSelector */
        type: PRM_CONST.TagReportContentSelector,
        values: [
          `${binToHex([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0])}0`,
        /**
          * R  I  P  A  C  R  F  L  T  S [reserved...]
          *
          * R – EnableROSpecID
          * I – EnableSpecIndex
          * P – EnableInventoryParameterSpecID
          * A – EnableAntennaID
          * C – EnableChannelIndex
          * R – EnablePeakRSSI
          * F – EnableFirstSeenTimestamp
          * L – EnableLastSeenTimestamp
          * T – EnableTagSeenCount
          */
          {/* C1G2EPCMemorySelector Parameter */
            type: PRM_CONST.C1G2EPCMemorySelector,
            values: [
              `${binToHex([1, 1, 0, 0])}0`
              /**
                * C  P  X [Reserved]
                *
                * C – EnableCRC
                * P – EnablePCBits
                * X – EnableXPCBits
                */
            ]
          }
        ]
      }
    ]
  };

  // Defining the ROSpec
  const roSpec = createTLVParam({
    type: PRM_CONST.ROSpec,
    values: [
      ROSPEC_ID,  /* ROSpecID */
      HEX_CONST.OCTET,        /* Priority */
      HEX_CONST.OCTET,        /* CurrentState */
      roBoundarySpec,
      aiSpec,
      roReportSpec
    ]
  });

  // Define Message
  const message = createLLRPMessage(
    0x55,
    MSG_CONST.ADD_ROSPEC,
    [
      roSpec
    ]
  );
  return message;
};

export const enableROSpec = () => (
  createLLRPMessage(
    0x66,
    MSG_CONST.ENABLE_ROSPEC,
    [ROSPEC_ID]
  )
);

export const startROSpec = () => (
  createLLRPMessage(
    0x77,
    MSG_CONST.START_ROSPEC,
    [ROSPEC_ID]
  )
);

export const getReaderConfig = () => (
  createLLRPMessage(
    0x22,
    MSG_CONST.GET_READER_CONFIG,
    [
      '0000', /* Antenna ID = 0 => All */
      '00',   /* Requested Data = 0 => All */
      '0000', /* GPI Port Num = 0 => All */
      '0000'  /* GPO Port Num = 0 => All */
    ]
  )
);

export const setReaderConfig = () => (
  createLLRPMessage(
    0x33,
    MSG_CONST.SET_READER_CONFIG,
    [
      '00', /* Reserved */
      createTLVParam({
        type: PRM_CONST.EventsAndReports,
        values: [
          8 /* Set HoldEventsAndReportsUponReconnect = true */
        ]
      })
    ]
  )
);

export const enableEventsAndReport = () => (
  createLLRPMessage(
    0x44,
    MSG_CONST.ENABLE_EVENTS_AND_REPORTS,
    [],
  )
);
