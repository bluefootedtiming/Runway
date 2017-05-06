import React from 'react';
import PropTypes from 'prop-types';

import DropdownSelect from './DropdownSelect';

const { shape, string, func, arrayOf } = PropTypes;

const ReaderFields = (props) => (
  <div>
    {/* Set the input to onBlur so update only occurs if the input is no longer in focus */}
    <input
      placeholder="IP Address"
      defaultValue={props.address}
      onBlur={(val) => props.onChangeAddress(props.address, val.target.value)}
    />
    <DropdownSelect
      placeHolder="Location/Event"
      defaultValue={props.event}
      options={props.eventList}
      onChange={(val) => props.onChangeEvent(props.address, val.target.value)}
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
  event: ''
};

ReaderFields.propTypes = {
  address: string,
  event: string,
  eventList: arrayOf(string).isRequired,
  onChangeAddress: func.isRequired,
  onChangeEvent: func.isRequired,
  onRemoveReader: func.isRequired,
};

const ReaderMapForm = (props) => {
  const { readerMap, ...readerFieldProps } = props;
  return (
    <div>
      {Object.keys(readerMap).length > 0 ? (
          Object.entries(readerMap).sort((a, b) => a > b).map(([address, event]) => (
            <ReaderFields
              key={`reader-${address}`}
              {...{ address, event, ...readerFieldProps }}
            />
          ))
        ) : (
          <ReaderFields {...readerFieldProps} />
        )
      }
    </div>
  );
};

ReaderMapForm.propTypes = {
  readerMap: shape({ [string]: string }),
  eventList: arrayOf(string),
  onChangeAddress: func.isRequired,
  onChangeEvent: func.isRequired,
  onRemoveReader: func.isRequired
};

ReaderMapForm.defaultProps = {
  readerMap: {},
  eventList: []
};

export default ReaderMapForm;
