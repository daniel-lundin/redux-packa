import { setupStore, promiseAction, CANCEL_TOKEN } from './helpers/store.js';
import * as controllablePromise from './helpers/controllable-promise.js';

const createHandleMock = () => ({
  onSuccess: sinon.stub(),
  onFailure: sinon.stub(),
  onCancel: sinon.stub()
});

Feature('Middleware', () => {
  Scenario('happy path', () => {
    let store;
    const promise = controllablePromise.create();
    const handleMock = createHandleMock();

    Given('A redux store', () => {
      store = setupStore();
    });

    When('action is dispatched', () => {
      store.dispatch(promiseAction(promise, handleMock));
    });

    Then('store is set in loading state', () => {
      const state = store.getState();
      expect(state.isLoading).toBe(true);
    });

    When('promise resolves', () => {
      promise.resolve('payload');
    });

    Then('store should not be in loading state', () => {
      const state = store.getState();
      expect(state.isLoading).toBe(false);
      expect(state.data).toBe('payload');
    });

    And('meta onSuccess should have been called', () => {
      sinon.assert.calledOnce(handleMock.onSuccess);
    });
  });

  Scenario('rejected promise', () => {
    let store;
    const promise = controllablePromise.create();
    const handleMock = createHandleMock();

    Given('A redux store', () => {
      store = setupStore();
    });

    When('action is dispatched', () => {
      store.dispatch(promiseAction(promise, handleMock));
    });

    Then('store is set in loading state', () => {
      const state = store.getState();
      expect(state.isLoading).toBe(true);
    });

    When('promise rejects', () => {
      promise.reject('error');
    });

    Then('store should not be in loading state', () => {
      const state = store.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('error');
    });

    And('meta onFailure should have been called', () => {
      sinon.assert.calledOnce(handleMock.onFailure);
    });
  });

  Scenario('canceled promise', () => {
    let store;
    const promise = controllablePromise.create();
    const handleMock = createHandleMock();

    Given('A redux store', () => {
      store = setupStore();
    });

    When('action is dispatched', () => {
      store.dispatch(promiseAction(promise, handleMock));
    });

    Then('store is set in loading state', () => {
      const state = store.getState();
      expect(state.isLoading).toBe(true);
    });

    When('promise is canceled', () => {
      promise.reject(CANCEL_TOKEN);
    });

    Then('store should not be in loading state', () => {
      const state = store.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.canceled).toBe(true);
    });

    And('meta onCancel should have been called', () => {
      sinon.assert.calledOnce(handleMock.onCancel);
    });
  });
});
