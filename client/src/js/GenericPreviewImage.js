/**
 *
 * @param {function} originalReducer
 * @param {object} globalState
 * @param {object} state
 * @param {string} type
 * @param {object} payload
 * @return {object} newState
 */
export default (originalReducer) => (globalState) => (state, { type, payload }) => {
  const baseUrl = globalState.config.baseUrl;
  switch (type) {

    case 'PREVIEWFIELD_ADD_FILE': {
      const replacedUrl = `${baseUrl}redux-pocs/client/images/testing.jpg`;
      return originalReducer(state, {
        type,
        payload: {
          ...payload,
          file: {
            ...payload.file,
            url: replacedUrl,
            thumbnail: replacedUrl,
            smallThumbnail: replacedUrl,
          },
        },
      });
    }

    default: {
      return originalReducer(state, { type, payload });
    }
  }
};
