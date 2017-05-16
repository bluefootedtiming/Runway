import React from 'react';
import PropTypes from 'prop-types';

import ReaderFields from './ReaderFields';
import { readerShape } from '../SyncReaders';

const { shape, string, func, arrayOf } = PropTypes;

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
