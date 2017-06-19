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

    case 'SET_BREADCRUMBS': {
      return originalReducer(state, {
        type,
        payload: {
          breadcrumbs: payload.breadcrumbs.map((crumb) => (
            (crumb.text === 'Files')
              ? { ...crumb, text: 'Custom Files' }
              : crumb
          )),
        },
      });
    }

    default: {
      return originalReducer(state, { type, payload });
    }
  }
};
