# Proof of concepts for redux customisation

This repo contains Proof of concepts for customising the reducer state by using Injector in SilverStripe.

Sometimes data saved into the redux store may want to be tweaked by third-party developer in a SilverStripe module,
 this could be for various reasons such as improved usability, catering for a new UI that is added or even module take over.

The proof of concepts examples here show how to achieve customising the redux store, and what could be done.

__NOTE__: The proof of concepts are focused on customising the redux store only, the examples exclude showing how to handle
 customisations that require additional UI elements or customisations involving data coming from graphql/RESTful data sources
 unless it goes through the redux store as an action.

## Table of contents
- [Getting started](#getting-started)
- [Structuring a transformer](#structuring-a-transformer)
- [A basic transformation](#a-basic-transformation)
- [Using the globalState](#using-the-globalstate)
- [Setting a different initial state](#setting-a-different-initial-state)
- [Cancelling an action](#cancelling-an-action)
- [Calling a different action](#calling-a-different-action)

## Getting started

It is recommended to be familiar with the concepts of Immutability and Redux before starting this.
The examples use `Spread in object literals` which is at this moment in Stage 3 Proposal. If you're more comfortable with using
 the `Object.assign()` API that shouldn't present any problems and should work the same.

To start customising, you'll need to transform an existing registered reducer.

```js
Injector.transform('customisationName', (update) => {
  update.reducer('assetAdmin', MyReducerTransformer);
});
```

Alternatively, you can also register your own reducer to injector.

```js
Injector.reducer.register('myCustom', MyCustomerReducer);
```

## Structuring a transformer

We utilise currying to supply utilities which your transformer may require to handle the transformation.
- `originalReducer` - reducer callback which the transformer is customising, this will need to be called in most cases. This will also callback other transformations down the chain of execution, not calling this will break the chain.
- `globalState` - state of the global redux store, there may be data outside the current scope in the reducer which you may need to help determine the transformation.
- `state` - current state of the current scope, this is what should be used to form the new State.
- `type` - the action to fire, like in any reducer in redux, this helps determine if your transformer should do anything
- `payload` - the new data sent with the action to mutate the redux store.

```js
const MyReducerTransformer = (originalReducer) => (globalState) => (state, { type, payload }) => {
  switch (type) {
    case 'MY_ACTION': {
      // recommended to call and return the originalReducer with the payload changed by the transformer
      /* return action to call here; */
    }
    
    case 'ANOTHER_ACTION_TRANSFORM': {
      // could omit the originalReducer to enforce your change or cancel the originalREducer's change
    }

    default: {
      // it is important to return the originalReducer with original redux parameters.
      return originalReducer(state, { type, payload });
    }
  }
}
```

## A basic transformation

Refer to the [RenameFilesCrumb.js](client/src/js/RenameFilesCrumb.js) source to the full file.

We manipulate the payload data to show something else instead of "Files" before calling the originalReducer

```js
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
```

## Using the globalState

Refer to the [GenericPreviewImage.js](client/src/js/GenericPreviewImage.js) source to the full file.

Accessing the globalState is easy, as it is passed in as part of the curried functions definition.

```js
export default (originalReducer) => (globalState) => (state, { type, payload }) => {
  const baseUrl = globalState.config.baseUrl;
}
```

## Setting a different initial state

Refer to the [LogoToBreadcrumbs.js](client/src/js/LogoToBreadcrumbs.js) source to the full file.

We can easily define a new initial state by providing the `state` param with a default value,
 this does not work if an earlier transformer in the chain has defined an initial state already.

```js
const MyReducerTransformer = (originalReducer) => () => (state = { myCustom: 'initial state here'}, { type, payload }) => {
  return originalReducer(state, { type, payload });
};
```

If you would like your transformation before an earlier transformer, you can define a `before` rule like other Injector APIs.

```js
Injector.transform('customisationName', (update) => {
  update.reducer('assetAdmin', MyReducerTransformer, { before: 'ThatSillyInitialTransformer' });
});
```

## Cancelling an action

Refer to the [BlockBadges.js](client/src/js/BlockBadges.js) source to the full file.

There are valid reasons to break the chain of reducer transformations, such as cancelling the redux store update.
However, like an original reducer in redux, you will still need to return the original state.

```js
case 'CANCEL_THIS_ACTION': {
  return state;
}
```

## Calling a different action

You could manipulate the action called by the originalReducer, there isn't an example available but this block of
 code will present the theory of how it can be achieved.

```js
switch (type) {
  case 'REMOVE_ERROR': {
    // we'd like to archive errors instead of removing them
    return originalReducer(state, {
      type: 'ARCHIVE_ERROR',
      payload,
    });
  }
}
```
