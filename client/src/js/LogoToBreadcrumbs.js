const logo = {
  text: 'My injected logo',
};

/**
 *
 * @param {function} originalReducer
 * @param {object} globalState
 * @param {object} state
 * @param {string} type
 * @param {object} payload
 * @return {object} newState
 */
export default (originalReducer) => () => (state = [logo], { type, payload }) => {
  switch (type) {

    case 'SET_BREADCRUMBS': {
      const newPayload = {
        breadcrumbs: [
          logo,
          ...((payload || {}).breadcrumbs || []),
        ],
      };

      return originalReducer(state, { type, payload: newPayload });
    }

    default: {
      return originalReducer(state, { type, payload });
    }
  }
};
