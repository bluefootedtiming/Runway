import React from 'react';
import PropTypes from 'prop-types';

import ReaderFields from './ReaderFields';

const { shape, string, func, arrayOf, bool } = PropTypes;

const ReaderMapForm = (props) => {
  const { readerMap, ...readerFieldProps } = props;
  return (
    <div>
      {readerMap.length > 0 &&
        readerMap.map((reader) => (
          <ReaderFields
            key={`reader-${reader.id}`}
            {...{ ...reader, ...readerFieldProps }}
          />
        ))
      }
    </div>
  );
};

ReaderMapForm.propTypes = {
  readerMap: arrayOf(shape({
    id: string,
    address: string,
    event: string,
    isLLRP: bool,
    port: string,
  })).isRequired,
  eventList: arrayOf(string),
  onChangeValue: func.isRequired,
  onRemoveReader: func.isRequired
};

ReaderMapForm.defaultProps = {
  readerMap: {},
  eventList: []
};

export default ReaderMapForm;
