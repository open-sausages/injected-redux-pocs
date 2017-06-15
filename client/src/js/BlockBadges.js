/**
 *
 * @param {function} originalReducer
 * @param {object} globalState
 * @param {object} state
 * @param {string} type
 * @param {object} payload
 * @return {object} newState
 */
export default (originalReducer) => () => (state, { type, payload }) => {
  switch (type) {

    case 'GALLERY.SET_FILE_BADGE': {
      return state;
    }

    default: {
      return originalReducer(state, { type, payload });
    }
  }
};
