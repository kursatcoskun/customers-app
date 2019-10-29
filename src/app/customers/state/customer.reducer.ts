import * as customerActions from './customer.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Customer } from '../customer.model';
import * as fromRoot from '../../state/app-state';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface CustomerState extends EntityState<Customer> {
    selectedCustomerID: number | null;
    loading: boolean;
    loaded: boolean;
    error: string;
}

export interface AppState extends fromRoot.AppState {
    customers: CustomerState;
}

export const customerAdapter: EntityAdapter<Customer> = createEntityAdapter<Customer>();

export const defaultCustomer: CustomerState = {
    ids: [],
    entities: {},
    selectedCustomerID: null,
    loading: false,
    loaded: false,
    error: ''
}

export const initialState = customerAdapter.getInitialState(defaultCustomer);

export function customerReducer(state = initialState, action: customerActions.Action): CustomerState {
    switch(action.type) {
        case customerActions.CustomerActionTypes.LOAD_CUSTOMERS_SUCCESS: {
            return customerAdapter.addAll(action.payload, {
                ...state,
                loading: false,
                loaded: true
            });
        }
        case customerActions.CustomerActionTypes.LOAD_CUSTOMERS_FAIL: {
            return {
                ...state,
                entities: {},
                loading: false,
                loaded: false,
                error: action.payload
            };
        }

        case customerActions.CustomerActionTypes.LOAD_CUSTOMER_SUCCESS: {
            return customerAdapter.addOne(action.payload, {
                ...state,
                selectedCustomerID: action.payload.id
            });
        }
        case customerActions.CustomerActionTypes.LOAD_CUSTOMER_FAIL: {
            return {
                ...state,
                error: action.payload
            };
        }
        case customerActions.CustomerActionTypes.CREATE_CUSTOMER_SUCCESS: {
            return customerAdapter.addOne(action.payload, {
                ...state,
                selectedCustomerID: action.payload.id
            });
        }
        case customerActions.CustomerActionTypes.CREATE_CUSTOMER_FAIL: {
            return {
                ...state,
                error: action.payload
            };
        }
        case customerActions.CustomerActionTypes.UPDATE_CUSTOMER_SUCCESS: {
            return customerAdapter.updateOne(action.payload, state);
        }
        case customerActions.CustomerActionTypes.UPDATE_CUSTOMER_FAIL: {
            return {
                ...state,
                error: action.payload
            };
        }
        case customerActions.CustomerActionTypes.DELETE_CUSTOMER_SUCCESS: {
            return customerAdapter.removeOne(action.payload, state);
        }
        case customerActions.CustomerActionTypes.DELETE_CUSTOMER_FAIL: {
            return {
                ...state,
                error: action.payload
            };
        }
        default: {
            return state;
        }
    }


}

const getCustomerFeatureState = createFeatureSelector<CustomerState>(
    'customers'
);

export const getCustomers = createSelector(
    getCustomerFeatureState,
    customerAdapter.getSelectors().selectAll
);
export const getCustomersLoading = createSelector(
    getCustomerFeatureState,
    (state: CustomerState) => state.loading
);
export const getCustomersLoaded = createSelector(
    getCustomerFeatureState,
    (state: CustomerState) => state.loaded
);
export const getCustomersError = createSelector(
    getCustomerFeatureState,
    (state: CustomerState) => state.error
);

export const getCurrentCustomerID = createSelector(
    getCustomerFeatureState,
    (state: CustomerState) => state.selectedCustomerID
);

export const getCurrentCustomer = createSelector(
    getCustomerFeatureState,
    getCurrentCustomerID,
    state => state.entities[state.selectedCustomerID]
)