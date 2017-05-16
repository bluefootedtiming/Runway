import React from 'react';
import PropTypes from 'prop-types';

import DropdownSelect from './DropdownSelect';
import { readerShape } from './SyncReaders';

const { shape, string, bool, func, arrayOf } = PropTypes;

const ReaderFields = (props) => (
  <div>
    {/* Set the input to onBlur so update only occurs if the input is no longer in focus */}
    <input
      placeholder="Address"
      defaultValue={props.address}
      onBlur={(val) => props.onChangeValue('address', props.address, val.target.value)}
    />
    <input
      placeholder="Port (Optional)"
      defaultValue={props.port}
      onBlur={(val) => props.onChangeValue('port', props.address, val.target.value)}
    />
    <input
      name="isLLRP"
      type="checkbox"
      checked={props.isLLRP}
    />
    <DropdownSelect
      placeHolder="Location/Event"
      defaultValue={props.event}
      options={props.eventList}
      onChange={(val) => props.onChangeValue('event', props.address, val.target.value)}
    />
    <button
      style={{ backgroundColor: 'white', margin: 0 }}
      onClick={() => props.onRemoveReader(props.address)}
    >
      <i className="fa fa-minus-circle" />
    </button>
  </div>
);

ReaderFields.defaultProps = {
  address: '',
  port: '',
  event: '',
  isLLRP: false
};

ReaderFields.propTypes = {
  address: string,
  port: string,
  isLLRP: bool,
  event: string,
  eventList: arrayOf(string).isRequired,
  onChangeValue: func.isRequired,
  onRemoveReader: func.isRequired,
};

const ReaderMapForm = (props) => {
  const { readerMap, ...readerFieldProps } = props;
  return (
    <div>
      {readerMap.length > 0 &&
        readerMap.map(({ address, event }) => (
          <ReaderFields
            key={`reader-${address}`}
            {...{ address, event, ...readerFieldProps }}
          />
        ))
      }
    </div>
  );
};

ReaderMapForm.propTypes = {
  readerMap: arrayOf(shape(readerShape)).isRequired,
  eventList: arrayOf(string),
  onChangeValue: func.isRequired,
  onRemoveReader: func.isRequired
};

ReaderMapForm.defaultProps = {
  readerMap: {},
  eventList: []
};

export default ReaderMapForm;
