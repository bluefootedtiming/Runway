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
      '', /* AntennaCount */
      '', /* AntennaID#[1-n]*/
      {/* AISpecStopTrigger */
        parameterConstant: PRM_CONST.AISpecStopTrigger,
        values: [
          '', /* AISpecStopTriggerType */
          '', /* DurationTrigger */
          '', /* GPITriggerValue */
          {/* TagObservationTrigger */
            parameterConstant: PRM_CONST.TagObservationTrigger,
            values: [
              '',   /* TriggerType */
              '00', /* Reserved */
              '',   /* NumberOfTags */
              '',   /* NumberOfAttempts */
              '',   /* T (time?) */
              '',   /* Timeout */
            ]
          }
        ]
      },
      {/* InventoryParameterSpec */
        parameterConstant: PRM_CONST.InventoryParameterSpec,
        values: [
          '', /* InventoryParameterSpecID */
          '', /* ProtocolID */
          '', /* AntennaConfiguration Parameter, optional */
          ''  /* Custom Parameter, optional */
        ]
      }
    ]
  };

  const roReportSpec = {
    parameterConstant: PRM_CONST.ROReportSpec,
    values: [
      '', /* ROReportTrigger */
      '', /* N (not sure) */
      {/* TagReportContentSelector */
        parameterConstant: PRM_CONST.TagReportContentSelector,
        values: [
          [0, 0, 0, 0, 0, 0, 0, 0].join('').toString(16), /* RIPACRFLT */
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
            *
            */
        ]
      }
    ]
  };

  // Defining the ROSpec
  const roSpec = createTLVParam({
    parameterConstant: PRM_CONST.ROSpec,
    values: [
      '0000', /* ROSpecID */
      '8',    /* Priority */
      '0',    /* CurrentState */
    ]
  }, [
    roBoundarySpec,
    aiSpec,
    roReportSpec
  ]);

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