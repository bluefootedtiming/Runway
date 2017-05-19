import * as MSG_CONST from './LLRPMessageConstants';
import * as PRM_CONST from './LLRPParameterConstants';
import { createLLRPMessage, createTLVParam } from './LLRPEncoding';

export const addROSpec = () => {
  const roBoundarySpec = {
    parameterConstant: PRM_CONST.ROBoundarySpec,
    values: [
      {/* ROSpecStartTrigger */
        parameterConstant: PRM_CONST.ROSpecStartTrigger,
        values: [
          '01', /* ROSpecStartTriggerType = 1 => Immediate */
          '',   /* PeriodicTriggerValue, optional/not necessary */
          '',   /* GPITriggerValue, optional/not necessary */
        ]
      },
      {/* ROSpecStopTrigger */
        parameterConstant: PRM_CONST.ROSpecStopTrigger,
        values: [
          '00', /* ROSpecStopTriggerType = 0 => null (? may need to change to Dur) */
          '',   /* DurationTriggerValue, optional/not necessary */
          '',   /* GPITriggerValue, optional/not necessary */
        ]
      }
    ]
  };

  const aiSpec = {
    parameterConstant: PRM_CONST.AISpec,
    values: [
      '0000', /* AntennaCount */
      '0000', /* AntennaID#[1-n], if 0, use all*/
      {/* AISpecStopTrigger */
        parameterConstant: PRM_CONST.AISpecStopTrigger,
        values: [
          '03', /* AISpecStopTriggerType = 3 => TagObservationTrigger*/
          '0'.repeat(8), /* DurationTrigger, not used */
          '0'.repeat(10), /* GPITriggerValue, not used */
          {/* TagObservationTrigger */
            parameterConstant: PRM_CONST.TagObservationTrigger,
            values: [
              '00',   /* TriggerType = 0 => Upon seeing N(1) tag observations*/
              '00', /* Reserved */
              '0001',   /* NumberOfTags = 1 */
              '0000',   /* NumberOfAttempts, not used but needs to be filled */
              '0000',   /* T (time?), not used but needs to be filled */
              '0'.repeat(8),   /* Timeout = 0 */
            ]
          }
        ]
      },
      {/* InventoryParameterSpec */
        parameterConstant: PRM_CONST.InventoryParameterSpec,
        values: [
          '0001', /* InventoryParameterSpecID */
          '01', /* ProtocolID */
          '', /* AntennaConfiguration Parameter, optional */
          ''  /* Custom Parameter, optional */
        ]
      }
    ]
  };

  const roReportSpec = {
    parameterConstant: PRM_CONST.ROReportSpec,
    values: [
      '01', /* ROReportTrigger = 1 => Upon N TagReportData Parameters or End of AISpec */
      '0000', /* N = 0 (unlimited) */
      {/* ReportContents = TagReportContentSelector */
        parameterConstant: PRM_CONST.TagReportContentSelector,
        values: [
          `${[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].join('')}0`.toString(16),
        /* R  I  P  A  C  R  F  L  T [reserved...] */
        /**
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
          '0'.repeat(12), /* AirProtocolSpecificEPCMemorySelectorParameter, not using */
          {/* TagReportData Parameter */
            parameterConstant: PRM_CONST.TagReportData,
            values: [
              {/* EPCData Parameter */
                parameterConstant: PRM_CONST.EPCData,
                values: [
                  '0000', /* EPCLengthBits */
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const loopSpec = {
    parameterConstant: PRM_CONST.LoopSpec,
    values: [
      '0'.repeat(8), /* LoopCount */
    ]
  };

  // Defining the ROSpec
  const roSpec = createTLVParam({
    parameterConstant: PRM_CONST.ROSpec,
    values: [
      '0000', /* ROSpecID */
      '8',    /* Priority */
      '0',    /* CurrentState */
      roBoundarySpec,
      aiSpec,
      roReportSpec,
      loopSpec
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

export const enableROSpec = () => {
  console.log('ENABLE_ROSPEC');
};

export const startROSpec = () => {
  console.log('START_ROSPEC');
};

export const getReaderConfig = () => {
  const message = createLLRPMessage(
    0x22,
    MSG_CONST.GET_READER_CONFIG,
    [
      '0000', /* Antenna ID = 0 => All */
      '00',   /* Requested Data = 0 => All */
      '0000', /* GPI Port Num = 0 => All */
      '0000'  /* GPO Port Num = 0 => All */
    ]
  );
  return message;
};

export const setReaderConfig = () => {
  const message = createLLRPMessage(
    0x33,
    MSG_CONST.SET_READER_CONFIG,
    [
      '00', /* Reserved */
      createTLVParam({
        parameterConstant: PRM_CONST.EventsAndReports,
        values: [
          8 /* Set HoldEventsAndReportsUponReconnect = true */
        ]
      })
    ]
  );
  return message;
};

export const enableEventsAndReport = () => {
  const message = createLLRPMessage(
    0x44,
    MSG_CONST.ENABLE_EVENTS_AND_REPORTS,
    [],
  );
  return message;
};
